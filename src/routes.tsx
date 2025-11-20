import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import IntroPage from "./pages/IntroPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserDashboard from "./pages/User/UserDashboard";
import UserLayout from "./pages/User/UserLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ProfilePage from "./pages/User/ProfilePage";
import BecomeMentorPage from "./pages/User/BecomeMentorPage";
import NotAuthorizedPage from "./pages/User/NotAuthorizedPage";
import GroupsList from "./pages/User/GroupListPage";
import GroupDetails from "./pages/User/GroupDetailsPage";
import ChatApp from "./pages/User/chat/ChatApp";
import ChatWrapper from "./pages/User/chat/ChatWrapper";
import SessionsManagement from "./pages/User/SessionManagement";
import MyBookingsPage from "./pages/User/MyBookingsPage";
import MentorsList from "./pages/User/MentorsList";
import MentorProfile from "./pages/User/MentorProfile";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* <Route path="/dashboard"element={<ProtectedRoute roles={["Learner", "Mentor"]}>  <UserDashboard /></ProtectedRoute>}/> */}
        <Route
          element={
            <ProtectedRoute roles={["Learner", "Mentor"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/apply-mentor" element={<BecomeMentorPage />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/chat" element={<ChatApp />} />
          <Route path="/chat/:otherUserId" element={<ChatApp />} />
          <Route path="/sessions" element={<SessionsManagement />} />

          <Route path="/myBookings" element={<MyBookingsPage />} />
          <Route path="/mentors" element={<MentorsList />} />
          <Route path="/mentors/:id" element={<MentorProfile />} />
        </Route>
        <Route path="/" element={<IntroPage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />

        {/* More routes */}
      </Routes>
    </BrowserRouter>
  );
}
