import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingThemeToggle from "./ui/buttons/FloatingThemeToggle";
import WelcomePage from "./pages/WelcomePage";
import AircraftsPage from "./pages/AircraftsPage";
import AircraftDetailPage from "./pages/AircraftDetailPage";
import CompaniesPage from "./pages/CompaniesPage";
import ComparePage from "./pages/ComparePage";
import SuggestPage from "./pages/SuggestPage";
import AboutPage from "./pages/AboutPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";

// Scroll to top helper when changing routes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7fb] dark:bg-[#060d19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/aircrafts" element={<AircraftsPage />} />
          <Route path="/HomePage" element={<Navigate to="/aircrafts" replace />} />
          <Route path="/aircraft/:id" element={<AircraftDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/radar" element={<Navigate to="/live-tracking" replace />} />
          <Route path="/suggest" element={<SuggestPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <FloatingThemeToggle />
    </div>
  );
}

export default App;
