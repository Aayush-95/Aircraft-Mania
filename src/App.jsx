import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WelcomePage from "./pages/WelcomePage";
import AircraftsPage from "./pages/AircraftsPage";
import AircraftDetailPage from "./pages/AircraftDetailPage";
import CompaniesPage from "./pages/CompaniesPage";
import ComparePage from "./pages/ComparePage";
import SuggestPage from "./pages/SuggestPage";
import AboutPage from "./pages/AboutPage";

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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
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
          <Route path="/suggest" element={<SuggestPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
