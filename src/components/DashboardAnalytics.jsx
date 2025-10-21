import { useState, useEffect } from "react";

const DashboardAnalytics = () => {
  // Mock data - replace with API call later
  const [analytics, setAnalytics] = useState({
    totalPaidAmount: 0,
    totalPaidCourses: 0,
    totalRegisteredUsers: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    setAnalytics({
      totalPaidAmount: 12500, // e.g., $12,500
      totalPaidCourses: 150,
      totalRegisteredUsers: 500,
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-300">Total Paid Courses Amount</h3>
        <p className="text-3xl font-bold text-orange-500">${analytics.totalPaidAmount.toLocaleString()}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-300">Total Paid Courses</h3>
        <p className="text-3xl font-bold text-orange-500">{analytics.totalPaidCourses}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-300">Total Registered Users</h3>
        <p className="text-3xl font-bold text-orange-500">{analytics.totalRegisteredUsers}</p>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
