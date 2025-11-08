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

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<UserLayout />}>
          {/* <Route path="/dashboard"element={<ProtectedRoute roles={["Learner", "Mentor"]}>  <UserDashboard /></ProtectedRoute>}/> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Learner", "Mentor"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/apply-mentor" element={<BecomeMentorPage />} />
          <Route path="/me" element={<ProfilePage />} />
                    <Route path="/groups" element={<GroupsList />} />
                              <Route path="/groups/:id" element={<GroupDetails />} />


        </Route>
        <Route path="/" element={<IntroPage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />

        {/* More routes */}
      </Routes>
    </BrowserRouter>
  );
}
