import React, { useState } from 'react'
import Title from './Title'
import { coursesSecItems, pricingPlans } from '../constant/data'
import { RiArrowRightUpLine } from '@remixicon/react'

const Courses = () => {
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
    openCourseDetailsModal(course);
  };

  return (
    <section id="courses" className="py-16 bg-gray-50">
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
                onClick={() => handleGetItNow(item)}
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

        {/* Course Details Modal */}
        {showCourseDetailsModal && selectedCourse && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
            onClick={closeCourseDetailsModal}
          >
            <div 
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">{selectedCourse.title}</h3>
                <button 
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold" 
                  onClick={closeCourseDetailsModal}
                >
                  &times;
                </button>
              </div>

              {/* Course Info */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <img
                    src={selectedCourse.img}
                    alt={selectedCourse.title}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {selectedCourse.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-md border border-orange-200"
                      >
                        {tag.tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{selectedCourse.instructor}</p>
                  <p className="text-gray-700 leading-relaxed">{selectedCourse.text}</p>
                </div>

                {/* Pricing Plan for Selected Course */}
                <div>
                  <h4 className="text-xl font-semibold mb-4">Course Pricing</h4>
                  {pricingPlans.filter(plan => plan.id === selectedCourse.id).map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-lg font-semibold">{plan.name}</h5>
                        {plan.popular && (
                          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">${plan.price}<span className="text-sm">{plan.period ? `/${plan.period}` : ''}</span></p>
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                      <ul className="space-y-2 mb-4 text-sm text-gray-700">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <RiArrowRightUpLine size={16} className="text-orange-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={scrollToPricing}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Courses
