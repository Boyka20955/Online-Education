import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { coursesSecItems, pricingPlans } from '../constant/data'
import { RiArrowRightUpLine } from '@remixicon/react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const CoursesPage = ({ containerRef }) => {
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const isInDashboard = containerRef ? true : false;

  useEffect(() => {
    if (isInDashboard) {
      fetchCourses();
    }
  }, [isInDashboard]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const currentCourses = isInDashboard ? courses : coursesSecItems;

  const openCoursesModal = () => setShowCoursesModal(true);
  const closeCoursesModal = () => setShowCoursesModal(false);

  const openCourseDetailsModal = (course) => {
    setSelectedCourse(course);
    setShowCourseDetailsModal(true);
  };
  const closeCourseDetailsModal = () => setShowCourseDetailsModal(false);

  const scrollToPricing = () => {
    const element = document.getElementById('pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetItNow = (course) => {
    if (!user) {
      toast.error('Please login to enroll in courses')
      return
    }
    setSelectedCourse(course);
    // Find the corresponding pricing plan
    const plan = pricingPlans.find(p => p.id === course.id);
    setAmount(plan ? plan.price.toString() : '0');
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!phoneNumber || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('http://localhost:5000/api/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone: phoneNumber,
          accountNumber: selectedCourse.title,
          amount: parseInt(amount)
        })
      })

      const data = await response.json()

      if (data.status) {
        toast.success(data.msg)
        setShowPaymentModal(false)
        // Create purchase record
        await fetch('http://localhost:5000/api/purchase/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            courseName: selectedCourse.title,
            amount: parseInt(amount),
            phoneNumber
          })
        })
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  };

  return (
<section id="courses" className={`py-16 relative z-10 ${isInDashboard ? 'bg-amber-50 text-blue-500' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-5">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
        <Title
          title="Courses"
          text="Work with dedication and excellence in all things. Use your time wisely and strive for growth and balance. Live with dignity and humility in every situation. Build your life with strength, grace, and lasting wisdom."
          link="View All"
          onClick={openCoursesModal}
        />
        </div>

        {/* Card Wrapper */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : (
            currentCourses.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-6">
                  {/* Tags + Instructor */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-md border border-orange-200"
                      >
                        {tag.tag}
                      </span>
                    ))}
                    <p className="ml-auto text-sm font-medium text-gray-600">
                      {item.instructor}
                    </p>
                  </div>

                  {/* Meta Data */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* All Courses Modal */}
        {showCoursesModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeCoursesModal}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">All Courses</h3>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  onClick={closeCoursesModal}
                >
                  &times;
                </button>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {coursesSecItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="w-full h-56 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between p-6">
                      {/* Tags + Instructor */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-md border border-orange-200"
                          >
                            {tag.tag}
                          </span>
                        ))}
                        <p className="ml-auto text-sm font-medium text-gray-600">
                          {item.instructor}
                        </p>
                      </div>

                      {/* Meta Data */}
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => {
                          closeCoursesModal();
                          handleGetItNow(item);
                        }}
                        className="mt-6 w-full py-3 text-center text-sm font-medium rounded-lg
                                  bg-orange-500 text-white hover:bg-orange-600
                                  transition-colors duration-300"
                      >
                        Get it now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Enroll in Course</h3>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  onClick={() => setShowPaymentModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{selectedCourse.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="254XXXXXXXXX"
                  />
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Send Payment Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CoursesPage
