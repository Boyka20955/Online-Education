import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardAnalytics from "../components/DashboardAnalytics";
import DashboardReports from "../components/DashboardReports";
import UserAccount from "../components/UserAccount";
import PurchasedCourses from "../components/PurchasedCourses";
import CoursesPage from "./CoursesPage";
import PricingPage from "./PricingPage";
import ContactPage from "./ContactPage";

const DashboardPage = ({ initialSection = "Dashboard" }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);

  // Sync with route
  useEffect(() => {
    if (location.pathname.includes("courses")) setActiveSection("Courses");
    else if (location.pathname.includes("pricing")) setActiveSection("Pricing");
    else if (location.pathname.includes("contact")) setActiveSection("Contact");
    else setActiveSection("Dashboard");
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const sidebarItems = [
    { label: "Dashboard", component: "Dashboard" },
    { label: "Courses", component: "Courses" },
    { label: "Pricing", component: "Pricing" },
    { label: "Purchased Courses", component: "PurchasedCourses" },
    { label: "Contact", component: "Contact" },
    { label: "User Account", component: "UserAccount" },
    { label: "Reports", component: "Reports" },
    { label: "Sign Out", action: handleLogout },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardAnalytics />;
      case "Reports":
        return <DashboardReports />;
      case "UserAccount":
        return <UserAccount />;
      case "Courses":
        return <CoursesPage containerRef={contentRef} />;
      case "Pricing":
        return <PricingPage containerRef={contentRef} />;
      case "PurchasedCourses":
        return <PurchasedCourses />;
      case "Contact":
        return <ContactPage />;
      default:
        return <DashboardAnalytics />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar (fixed) */}
      <aside className="w-64 bg-gray-800 p-4 flex-shrink-0">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.action ? (
                <button
                  onClick={item.action}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-700"
                >
                  {item.label}
                </button>
              ) : (
                <button
                  onClick={() => setActiveSection(item.component)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === item.component
                      ? "bg-orange-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header stays constant */}
        <header className="bg-gray-800 p-4 sticky top-0 z-20">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || "User"}
          </h1>
        </header>

        {/* Scrollable content container */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto p-8 bg-gray-900"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
