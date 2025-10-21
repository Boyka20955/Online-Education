import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const PurchasedCourses = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPurchases();
    // Set up polling for real-time updates
    const interval = setInterval(fetchPurchases, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/purchased-courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      } else {
        toast.error('Failed to fetch purchased courses');
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Error loading purchased courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300">Loading purchased courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Purchased Courses</h2>

      {purchases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No purchased courses yet.</p>
          <p className="text-gray-500 text-sm mt-2">Enroll in courses from the Pricing section to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{purchase.title}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                  Purchased
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Instructor</p>
                  <p className="text-white font-medium">{purchase.instructor}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">User</p>
                  <p className="text-white font-medium">{purchase.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Purchase Date</p>
                  <p className="text-white font-medium">{new Date(purchase.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">ID</p>
                  <p className="text-white font-medium">{purchase.id}</p>
                </div>
              </div>

              {purchase.text && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{purchase.text}</p>
                </div>
              )}

              {purchase.message && (
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 mb-4">
                  <h4 className="text-white font-medium mb-2">Message</h4>
                  <div className="bg-gray-600 rounded p-3">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{purchase.message}</p>
                  </div>
                </div>
              )}

              {purchase.link && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Course Link</p>
                  <a href={purchase.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                    Access Course
                  </a>
                </div>
              )}

              {purchase.img && (
                <div className="mb-4">
                  <img src={purchase.img} alt={purchase.title} className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedCourses;
