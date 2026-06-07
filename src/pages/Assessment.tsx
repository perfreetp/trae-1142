import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import Header from '@/components/Header';

const questions = [
  { id: 1, text: '近一周训练强度感觉如何？' },
  { id: 2, text: '睡眠质量如何？' },
  { id: 3, text: '身体疲劳程度？' },
  { id: 4, text: '训练积极性如何？' },
  { id: 5, text: '伤痛点有无不适？' },
];

const scaleLabels = ['很差', '较差', '一般', '良好', '优秀'];

export default function Assessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const maxScore = questions.length * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getRecommendation = () => {
    if (percentage >= 80) return { text: '状态良好，可以正常参加比赛', color: 'text-brand-green' };
    if (percentage >= 60) return { text: '状态一般，建议适当降低比赛目标', color: 'text-brand-orange' };
    return { text: '状态欠佳，建议谨慎参赛或休息调整', color: 'text-brand-red' };
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setShowResult(true);
  };

  return (
    <div className="page-content">
      <Header title="赛前测评" showBack />

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="brand-card">
            <div className="text-white font-medium mb-3">{q.id}. {q.text}</div>
            <div className="flex gap-2">
              {scaleLabels.map((label, idx) => {
                const value = idx + 1;
                const selected = answers[q.id] === value;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [q.id]: value }));
                      if (showResult) setShowResult(false);
                    }}
                    className={`flex-1 rounded-xl py-2 text-center text-xs transition-all ${
                      selected
                        ? 'bg-gradient-brand text-white shadow-glow'
                        : 'bg-brand-deeper text-brand-gray hover:text-white'
                    }`}
                  >
                    {value}
                    <div className="mt-0.5 text-[10px]">{label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className={`brand-btn w-full mt-6 flex items-center justify-center gap-2 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ClipboardCheck size={16} />
        提交测评
      </button>

      {showResult && (
        <div className="brand-card mt-6 animate-slide-up">
          <div className="text-center mb-4">
            <div className="text-4xl font-display font-bold text-brand-cyan">{percentage}</div>
            <div className="text-brand-gray text-sm">综合评分</div>
          </div>

          <div className="h-2 bg-brand-deeper rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="text-center">
            <div className={`font-semibold ${getRecommendation().color}`}>
              {getRecommendation().text}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-brand-border/50">
            <div className="text-center">
              <div className="text-white font-display font-bold">{totalScore}</div>
              <div className="text-xs text-brand-gray">总得分</div>
            </div>
            <div className="text-center">
              <div className="text-white font-display font-bold">{maxScore}</div>
              <div className="text-xs text-brand-gray">满分</div>
            </div>
            <div className="text-center">
              <div className="text-white font-display font-bold">{Object.keys(answers).length}</div>
              <div className="text-xs text-brand-gray">测评项</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
