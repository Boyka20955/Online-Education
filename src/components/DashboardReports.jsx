import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const DashboardReports = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Mock data for yearly totals
    setYearlyData([
      { year: "2020", amount: 5000 },
      { year: "2021", amount: 8000 },
      { year: "2022", amount: 12000 },
      { year: "2023", amount: 15000 },
      { year: "2024", amount: 18000 },
    ]);

    // Mock data for monthly totals (last 12 months)
    setMonthlyData([
      { month: "Jan", amount: 1200 },
      { month: "Feb", amount: 1500 },
      { month: "Mar", amount: 1800 },
      { month: "Apr", amount: 2000 },
      { month: "May", amount: 2200 },
      { month: "Jun", amount: 2500 },
      { month: "Jul", amount: 2800 },
      { month: "Aug", amount: 3000 },
      { month: "Sep", amount: 3200 },
      { month: "Oct", amount: 3500 },
      { month: "Nov", amount: 3800 },
      { month: "Dec", amount: 4000 },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Total Amount for Paid Courses Per Year</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Total Amount for Paid Courses Per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardReports;
