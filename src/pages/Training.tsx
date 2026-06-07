import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Dumbbell, Timer, Users, ArrowRight, Plus, X, Check, ClipboardCheck, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserStore, useTrainingStore } from '@/stores';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import PaceDisplay from '@/components/PaceDisplay';
import ProgressRing from '@/components/ProgressRing';
import type { TrainingPlan } from '@/mock/training';

const TODAY = '2026-06-08';
const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

const typeLabels: Record<string, string> = {
  easy: '轻松跑', interval: '间歇', long: '长距离',
  tempo: '节奏跑', recovery: '恢复跑', speed: '速度', fartlek: '法特莱克',
};

const typeColors: Record<string, string> = {
  easy: 'bg-brand-green/20 text-brand-green',
  interval: 'bg-brand-red/20 text-brand-red',
  long: 'bg-brand-cyan/20 text-brand-cyan',
  tempo: 'bg-brand-orange/20 text-brand-orange',
  recovery: 'bg-brand-green/20 text-brand-green',
  speed: 'bg-brand-red/20 text-brand-red',
  fartlek: 'bg-brand-orange/20 text-brand-orange',
};

const hrZones = ['Z1', 'Z1-Z2', 'Z2', 'Z2-Z3', 'Z3', 'Z3-Z4', 'Z4', 'Z4-Z5', 'Z5'];
const targetGroups = ['全队', '竞速组', '耐力组'];

function getWeekDates(baseDate: string) {
  const base = new Date(baseDate);
  const dayOfWeek = base.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function formatPaceSec(seconds: number) {
  if (seconds <= 0) return '--';
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}'${sec.toString().padStart(2, '0')}"`;
}

const emptyForm = {
  date: TODAY, type: 'easy' as TrainingPlan['type'], targetDistance: '',
  targetPace: '', heartRateZone: 'Z2-Z3', targetGroup: '全队',
  warmup: '', mainSession: '', cooldown: '',
};

const reviewFilters = ['全部', '已完成', '未完成', '高疲劳'] as const;
type ReviewFilter = typeof reviewFilters[number];

export default function Training() {
  const { role, currentUser } = useUserStore();
  const {
    selectedDate, setSelectedDate, selectedPlanId, setSelectedPlanId,
    getPlansByDate, getCompletionRate, getRecordSubmissionRate,
    getCompletionDetails, getRecordByPlanAndUser, addPlan,
  } = useTrainingStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('全部');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const weekDates = getWeekDates(TODAY);
  const dayPlans = getPlansByDate(selectedDate);

  const activePlan = selectedPlanId
    ? dayPlans.find(p => p.id === selectedPlanId) ?? dayPlans[0]
    : dayPlans[0];

  const existingRecord = activePlan && role === 'member'
    ? getRecordByPlanAndUser(activePlan.id, currentUser.id)
    : undefined;

  const completionDetails = activePlan && role === 'coach'
    ? getCompletionDetails(activePlan.id)
    : [];

  const filteredDetails = useMemo(() => {
    if (reviewFilter === '全部') return completionDetails;
    if (reviewFilter === '已完成') return completionDetails.filter(d => d.checkedIn);
    if (reviewFilter === '未完成') return completionDetails.filter(d => !d.checkedIn);
    if (reviewFilter === '高疲劳') return completionDetails.filter(d => d.fatigue >= 7);
    return completionDetails;
  }, [completionDetails, reviewFilter]);

  const executionSteps = role === 'member' && activePlan ? [
    {
      label: '训练记录',
      desc: existingRecord?.completed ? `${existingRecord.distance}km / ${existingRecord.duration}min` : '记录距离、配速、心率',
      completed: !!existingRecord?.completed,
      path: '/training/record',
    },
    {
      label: '疲劳自评',
      desc: existingRecord && existingRecord.fatigue > 0 ? `RPE ${existingRecord.fatigue}/10` : 'RPE 主观疲劳量表',
      completed: !!existingRecord && existingRecord.fatigue > 0,
      path: '/training/fatigue',
    },
    {
      label: '心率区间',
      desc: existingRecord && Object.values(existingRecord.heartRateZones).some(v => v > 0) ? `均HR ${existingRecord.avgHR}bpm` : '各心率区间时间分布',
      completed: !!existingRecord && Object.values(existingRecord.heartRateZones).some(v => v > 0),
      path: '/training/record',
    },
    {
      label: '打卡签到',
      desc: existingRecord?.checkedIn ? '今日已打卡' : '确认完成今日训练',
      completed: !!existingRecord?.checkedIn,
      path: '/training/checkin',
    },
  ] : [];

  const completedStepCount = executionSteps.filter(s => s.completed).length;
  const allStepsDone = completedStepCount === executionSteps.length && executionSteps.length > 0;

  const checkInRate = activePlan ? getCompletionRate(activePlan.id) : 0;
  const submitRate = activePlan ? getRecordSubmissionRate(activePlan.id) : 0;

  const handlePublish = () => {
    if (!form.date || !form.targetDistance || !form.targetPace || !form.mainSession) return;
    const plan: TrainingPlan = {
      id: `p_${Date.now()}`, title: typeLabels[form.type] || form.type,
      date: form.date, type: form.type,
      targetDistance: Number(form.targetDistance),
      targetPace: Number(form.targetPace) * 60,
      warmup: form.warmup || '动态拉伸5分钟',
      mainSession: form.mainSession,
      cooldown: form.cooldown || '拉伸放松10分钟',
      heartRateZone: form.heartRateZone,
      targetGroup: form.targetGroup,
      description: form.mainSession,
    };
    addPlan(plan);
    setShowForm(false);
    setForm(emptyForm);
    setSelectedDate(form.date);
    setSelectedPlanId(plan.id);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setExpandedMember(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header title="训练计划" />
      <div className="page-content space-y-5">
        {role === 'coach' && (
          <button onClick={() => setShowForm(!showForm)} className="brand-btn-outline flex items-center gap-2 text-sm w-full justify-center">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? '取消新建' : '新建训练计划'}
          </button>
        )}

        {role === 'coach' && showForm && (
          <div className="brand-card space-y-4 animate-slide-up">
            <h3 className="section-title text-base">发布训练计划</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-gray mb-1 block">训练日期</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="brand-input w-full text-sm" />
              </div>
              <div>
                <label className="text-xs text-brand-gray mb-1 block">训练类型</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TrainingPlan['type'] })} className="brand-input w-full text-sm">
                  {Object.entries(typeLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-gray mb-1 block">目标距离 (km)</label>
                <input type="number" placeholder="10" value={form.targetDistance} onChange={(e) => setForm({ ...form, targetDistance: e.target.value })} className="brand-input w-full text-sm" />
              </div>
              <div>
                <label className="text-xs text-brand-gray mb-1 block">目标配速 (min/km)</label>
                <input type="number" step="0.1" placeholder="6.0" value={form.targetPace} onChange={(e) => setForm({ ...form, targetPace: e.target.value })} className="brand-input w-full text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-gray mb-1 block">心率区间</label>
                <select value={form.heartRateZone} onChange={(e) => setForm({ ...form, heartRateZone: e.target.value })} className="brand-input w-full text-sm">
                  {hrZones.map((z) => (<option key={z} value={z}>{z}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs text-brand-gray mb-1 block">训练对象</label>
                <select value={form.targetGroup} onChange={(e) => setForm({ ...form, targetGroup: e.target.value })} className="brand-input w-full text-sm">
                  {targetGroups.map((g) => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-brand-gray mb-1 block">热身内容</label>
              <input type="text" placeholder="动态拉伸5分钟" value={form.warmup} onChange={(e) => setForm({ ...form, warmup: e.target.value })} className="brand-input w-full text-sm" />
            </div>
            <div>
              <label className="text-xs text-brand-gray mb-1 block">主训练内容 *</label>
              <textarea placeholder="10公里匀速跑，配速6:00-6:15" value={form.mainSession} onChange={(e) => setForm({ ...form, mainSession: e.target.value })} className="brand-input w-full text-sm min-h-[60px] resize-none" rows={2} />
            </div>
            <div>
              <label className="text-xs text-brand-gray mb-1 block">放松内容</label>
              <input type="text" placeholder="拉伸放松10分钟" value={form.cooldown} onChange={(e) => setForm({ ...form, cooldown: e.target.value })} className="brand-input w-full text-sm" />
            </div>
            <button onClick={handlePublish} disabled={!form.date || !form.targetDistance || !form.targetPace || !form.mainSession} className={cn('brand-btn w-full flex items-center justify-center gap-2', (!form.date || !form.targetDistance || !form.targetPace || !form.mainSession) && 'opacity-50 cursor-not-allowed')}>
              <Dumbbell size={16} />发布计划
            </button>
          </div>
        )}

        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="w-4 h-4 text-brand-cyan" />
            <span className="text-sm text-brand-gray">本周训练日历</span>
          </div>
          <div className="flex gap-1.5">
            {weekDates.map((date, i) => {
              const plans = getPlansByDate(date);
              const isSelected = date === selectedDate;
              const isToday = date === TODAY;
              const dayNum = new Date(date).getDate();
              return (
                <button key={date} onClick={() => { setSelectedDate(date); if (plans.length > 0) setSelectedPlanId(plans[0].id); }} className={cn('flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all', isSelected ? 'bg-gradient-brand shadow-glow' : 'bg-brand-card hover:bg-brand-card-hover')}>
                  <span className={cn('text-[10px] font-medium', isSelected ? 'text-white/80' : 'text-brand-gray')}>{weekDays[i]}</span>
                  <span className={cn('text-sm font-bold', isSelected ? 'text-white' : isToday ? 'text-brand-cyan' : 'text-white')}>{dayNum}</span>
                  {plans.length > 0 && (<div className="flex gap-0.5">{plans.slice(0, 3).map((_, pi) => (<div key={pi} className={cn('w-1 h-1 rounded-full', isSelected ? 'bg-white' : 'bg-brand-green')} />))}</div>)}
                </button>
              );
            })}
          </div>
        </div>

        {dayPlans.length > 0 ? (
          <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.05s' }}>
            {dayPlans.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {dayPlans.map((plan) => {
                  const memberRec = role === 'member' ? getRecordByPlanAndUser(plan.id, currentUser.id) : undefined;
                  const isDone = memberRec?.checkedIn;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm font-medium',
                        activePlan?.id === plan.id
                          ? 'bg-gradient-brand text-white shadow-glow'
                          : 'bg-brand-card text-brand-gray hover:bg-brand-card-hover',
                      )}
                    >
                      {isDone && <Check size={14} className="text-brand-green" />}
                      <span>{plan.title}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', typeColors[plan.type])}>{typeLabels[plan.type]}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activePlan && (
              <>
                <div className="brand-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg font-bold text-white">{activePlan.title}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', typeColors[activePlan.type])}>{typeLabels[activePlan.type]}</span>
                  </div>
                  <p className="text-sm text-brand-gray mb-4">{activePlan.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs text-brand-green font-bold">热</span></div>
                      <div><p className="text-xs text-brand-gray mb-0.5">热身</p><p className="text-sm text-white">{activePlan.warmup}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs text-brand-cyan font-bold">主</span></div>
                      <div><p className="text-xs text-brand-gray mb-0.5">主训练</p><p className="text-sm text-white">{activePlan.mainSession}</p></div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-brand-deeper rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs text-brand-orange font-bold">冷</span></div>
                      <div><p className="text-xs text-brand-gray mb-0.5">放松</p><p className="text-sm text-white">{activePlan.cooldown}</p></div>
                    </div>
                  </div>
                </div>

                <div className="brand-card">
                  <h4 className="text-sm font-medium text-brand-gray mb-3">训练目标</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-brand-cyan" /><div><p className="text-[10px] text-brand-gray">目标配速</p><PaceDisplay pace={activePlan.targetPace} /></div></div>
                    <div className="flex items-center gap-2"><Dumbbell className="w-4 h-4 text-brand-orange" /><div><p className="text-[10px] text-brand-gray">心率区间</p><span className="text-sm font-semibold text-brand-orange">{activePlan.heartRateZone}</span></div></div>
                    <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-brand-green" /><div><p className="text-[10px] text-brand-gray">目标距离</p><span className="text-sm font-semibold text-brand-green">{activePlan.targetDistance}km</span></div></div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /><div><p className="text-[10px] text-brand-gray">训练对象</p><span className="text-sm font-semibold text-purple-400">{activePlan.targetGroup}</span></div></div>
                  </div>
                </div>

                {role === 'member' && (
                  <div className="brand-card">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-brand-cyan" />训练执行</h4>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', allStepsDone ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-deeper text-brand-gray')}>
                        {completedStepCount}/{executionSteps.length} 完成
                      </span>
                    </div>
                    <div className="space-y-2">
                      {executionSteps.map((step, i) => (
                        <div key={i} className={cn('flex items-center gap-3 p-3 rounded-xl transition-all', step.completed ? 'bg-brand-green/5' : 'bg-brand-deeper')}>
                          <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold', step.completed ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-card text-brand-gray')}>
                            {step.completed ? <Check size={14} /> : i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm font-medium', step.completed ? 'text-white' : 'text-brand-gray')}>{step.label}</p>
                            <p className="text-[10px] text-brand-gray mt-0.5">{step.desc}</p>
                          </div>
                          {!step.completed && (
                            <Link to={step.path} onClick={() => setSelectedPlanId(activePlan.id)} className="text-xs text-brand-cyan hover:text-brand-cyan/80 shrink-0">去完成</Link>
                          )}
                          {step.completed && step.label === '训练记录' && (
                            <Link to="/training/record" onClick={() => setSelectedPlanId(activePlan.id)} className="text-xs text-brand-gray hover:text-white shrink-0">修改</Link>
                          )}
                          {step.completed && step.label === '疲劳自评' && (
                            <Link to="/training/fatigue" onClick={() => setSelectedPlanId(activePlan.id)} className="text-xs text-brand-gray hover:text-white shrink-0">修改</Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {role === 'coach' && (
                  <div className="brand-card">
                    <h4 className="text-sm font-medium text-white mb-3">训练复盘 · {activePlan.title}</h4>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-brand-deeper rounded-xl">
                        <ProgressRing percentage={checkInRate} size={48} strokeWidth={5} />
                        <div>
                          <p className="text-xs text-brand-gray">打卡完成率</p>
                          <p className="font-display font-bold text-white">{checkInRate}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-brand-deeper rounded-xl">
                        <ProgressRing percentage={submitRate} size={48} strokeWidth={5} />
                        <div>
                          <p className="text-xs text-brand-gray">记录提交率</p>
                          <p className="font-display font-bold text-white">{submitRate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-3.5 h-3.5 text-brand-gray" />
                      {reviewFilters.map((f) => (
                        <button key={f} onClick={() => setReviewFilter(f)} className={cn('text-xs px-2.5 py-1 rounded-full font-medium transition-all', reviewFilter === f ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-brand-deeper text-brand-gray hover:text-white')}>
                          {f}
                        </button>
                      ))}
                      <span className="text-[10px] text-brand-gray ml-auto">{filteredDetails.length} 人</span>
                    </div>

                    <div className="space-y-2">
                      {filteredDetails.map((detail) => {
                        const isExpanded = expandedMember === detail.userId;
                        return (
                          <div key={detail.userId} className="bg-brand-deeper rounded-xl overflow-hidden">
                            <button onClick={() => setExpandedMember(isExpanded ? null : detail.userId)} className="w-full flex items-center gap-3 p-3">
                              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0', detail.checkedIn ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-card text-brand-gray')}>
                                {detail.checkedIn ? <Check size={12} /> : detail.name[0]}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white font-medium">{detail.name}</span>
                                  {detail.fatigue >= 7 && (<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red font-medium">疲劳</span>)}
                                </div>
                                {detail.completed ? (
                                  <p className="text-[10px] text-brand-gray mt-0.5">{detail.distance}km · {detail.duration}min · {formatPaceSec(detail.pace)}/km</p>
                                ) : (
                                  <p className="text-[10px] text-brand-gray mt-0.5">未提交记录</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', detail.checkedIn ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-card text-brand-gray')}>
                                  {detail.checkedIn ? '已打卡' : '未打卡'}
                                </span>
                                {isExpanded ? <ChevronUp size={14} className="text-brand-gray" /> : <ChevronDown size={14} className="text-brand-gray" />}
                              </div>
                            </button>
                            {isExpanded && detail.completed && (
                              <div className="px-3 pb-3 pt-1 border-t border-brand-border grid grid-cols-3 gap-2 animate-slide-up">
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">距离</p><p className="text-sm font-semibold text-white">{detail.distance}km</p></div>
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">用时</p><p className="text-sm font-semibold text-white">{detail.duration}min</p></div>
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">配速</p><p className="text-sm font-semibold text-brand-cyan">{formatPaceSec(detail.pace)}/km</p></div>
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">心率</p><p className="text-sm font-semibold text-white">{detail.avgHR}bpm</p></div>
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">疲劳</p><p className={cn('text-sm font-semibold', detail.fatigue >= 7 ? 'text-brand-red' : detail.fatigue >= 4 ? 'text-brand-orange' : 'text-brand-green')}>RPE {detail.fatigue}</p></div>
                                <div className="text-center p-2 bg-brand-card rounded-lg"><p className="text-[10px] text-brand-gray">打卡</p><p className={cn('text-sm font-semibold', detail.checkedIn ? 'text-brand-green' : 'text-brand-gray')}>{detail.checkedIn ? '已打卡' : '未打卡'}</p></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {role === 'member' && (
                  <div className="flex gap-3">
                    <Link to="/training/record" onClick={() => setSelectedPlanId(activePlan.id)} className="brand-btn flex-1 flex items-center justify-center gap-2">
                      {existingRecord?.completed ? '修改记录' : '记录训练'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/training/checkin" onClick={() => setSelectedPlanId(activePlan.id)} className={cn('flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all', existingRecord?.checkedIn ? 'bg-brand-green/20 text-brand-green' : 'bg-gradient-brand text-white shadow-glow')}>
                      {existingRecord?.checkedIn ? '已打卡' : '去打卡'}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="animate-slide-up flex flex-col items-center justify-center py-16">
            <CalendarDays className="w-12 h-12 text-brand-gray/50 mb-3" />
            <p className="text-brand-gray text-sm">今日无训练安排</p>
            <p className="text-brand-gray/50 text-xs mt-1">享受休息日吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
