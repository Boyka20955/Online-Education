import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

// 🔹 Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Courses from "./components/Courses";
import Testimonials from "./components/Testimonials";
import FaqSec from "./components/FaqSec";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import LoadingSpinner from "./components/LoadingSpinner";

// 🔹 Pages
import CoursesPage from "./pages/CoursesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AuthPage from "./pages/AuthPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// 🌍 Home Page
const LandingPage = () => (
  <div>
    <Header />
    <main>
      <Hero />
      <Benefits />
      <Courses />
      <Testimonials />
      <FaqSec />
      <AboutUs />
      <Pricing />
      <Contact />
    </main>
    <Footer />
  </div>
);

// 🔐 Wrapper for Protected Dashboard Routes
const ProtectedDashboard = ({ component }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user?.isVerified) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardPage initialSection={component} />;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <Routes>
        {/* 🏠 Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔐 Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* 🔒 Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedDashboard component="Dashboard" />} />
        <Route path="/courses" element={<ProtectedDashboard component="Courses" />} />
        <Route path="/pricing" element={<ProtectedDashboard component="Pricing" />} />
        <Route path="/contact" element={<ProtectedDashboard component="Contact" />} />

        {/* 👨‍💼 Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* 🚧 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
