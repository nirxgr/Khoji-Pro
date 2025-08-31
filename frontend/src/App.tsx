import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./pages/auth/Register.tsx";
import Home from "./pages/home/home.tsx";
import Login from "./pages/auth/Login.tsx";
import LoginGuard from "./shared/guards/loginGuard.tsx";
import AuthGuard from "./shared/guards/authGuard.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import SearchedProfilePage from "./pages/profiles/Profile.tsx";
import NotFoundPage from "./pages/notfound/NotFoundPage.tsx";
import ProfileCompletion from "./pages/auth/ProfileCompletion.tsx";
import CompleteProfileGuard from "./shared/guards/completeProfileGuard.tsx";
import LandingPage from "./pages/landing/landingpage.tsx";
import Favorites from "./pages/favorites/favorites.tsx";
import Explore from "./pages/explore/explore.tsx";

function App() {
  return (
    <div>
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route
          path="/"
          element={
            <LoginGuard>
              <LandingPage />
            </LoginGuard>
          }
        />

        <Route
          path="/register"
          element={
            <LoginGuard>
              <Register />
            </LoginGuard>
          }
        />

        <Route
          path="/complete-profile"
          element={
            <CompleteProfileGuard>
              <ProfileCompletion />
            </CompleteProfileGuard>
          }
        />

        <Route
          path="/login"
          element={
            <LoginGuard>
              <Login />
            </LoginGuard>
          }
        />

        <Route
          path="/reset-password"
          element={
            <LoginGuard>
              <ResetPassword />
            </LoginGuard>
          }
        />

        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <AuthGuard>
              <SearchedProfilePage />
            </AuthGuard>
          }
        />

        <Route
          path="/favorites"
          element={
            <AuthGuard>
              <Favorites />
            </AuthGuard>
          }
        />

        <Route
          path="/explore"
          element={
            <AuthGuard>
              <Explore />
            </AuthGuard>
          }
        />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
