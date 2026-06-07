import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import TrainingRecord from "@/pages/TrainingRecord";
import CheckIn from "@/pages/CheckIn";
import Fatigue from "@/pages/Fatigue";
import Team from "@/pages/Team";
import Leave from "@/pages/Leave";
import Activity from "@/pages/Activity";
import RoutesPage from "@/pages/Routes";
import RouteDetail from "@/pages/RouteDetail";
import Data from "@/pages/Data";
import Goals from "@/pages/Goals";
import Scores from "@/pages/Scores";
import Assessment from "@/pages/Assessment";
import Equipment from "@/pages/Equipment";
import Injury from "@/pages/Injury";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/training/record" element={<TrainingRecord />} />
          <Route path="/training/checkin" element={<CheckIn />} />
          <Route path="/training/fatigue" element={<Fatigue />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/leave" element={<Leave />} />
          <Route path="/team/activity" element={<Activity />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/data" element={<Data />} />
          <Route path="/data/goals" element={<Goals />} />
          <Route path="/data/scores" element={<Scores />} />
          <Route path="/data/assessment" element={<Assessment />} />
          <Route path="/data/equipment" element={<Equipment />} />
          <Route path="/data/injury" element={<Injury />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
