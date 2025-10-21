import React, { useState } from 'react'
import Title from './Title'
import { benefitItems } from '../constant/data'
import { RiArrowRightUpLine } from '@remixicon/react'

const Benefits = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div id="benefits" className="container">
      {/* Title */}
      <Title
        title="Benefits"
        text="Pain itself is something to be cherished together. Time and rhythm also belong to the noble and disciplined. Live with dignity in humility and simplicity, with graceful strength and wisdom in old age."
        link="View All"
        onClick={openModal}
      />

      {/* Card wrapper */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-10 md:mt-12">
        {benefitItems.map((item) => (
          <div key={item.title} className="bg-white p-8 flex flex-col rounded-xl shadow-sm hover:shadow-md transition-shadow">
            {/* Icon */}
            <div className="bg-orange-75 w-[65%] h-20 flex items-center justify-center mx-auto rounded-lg mb-6">
              <img src={item.icon} alt={item.title} width={56} height={56} />
            </div>

            {/* Content */}
            <div className="mb-4 text-center space-y-2">
              <h4 className="text-xl">{item.title}</h4>
              <p className="text-sm md:text-base">{item.text}</p>
            </div>

            {/* Button */}
            <button className="mt-auto ml-auto border border-white-95 w-12 h-12 flex items-center justify-center rounded-md text-orange-50 hover:bg-orange-50 hover:text-white transition-colors">
              <RiArrowRightUpLine size={22} />
            </button>
          </div>
        ))}
      </div>

      {/* Benefits Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">All Benefits</h3>
              <button 
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold" 
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefitItems.map((item) => (
                <div key={item.title} className="bg-white p-8 flex flex-col rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  {/* Icon */}
                  <div className="bg-orange-75 w-[65%] h-20 flex items-center justify-center mx-auto rounded-lg mb-6">
                    <img src={item.icon} alt={item.title} width={56} height={56} />
                  </div>

                  {/* Content */}
                  <div className="mb-4 text-center space-y-2">
                    <h4 className="text-xl">{item.title}</h4>
                    <p className="text-sm md:text-base">{item.text}</p>
                  </div>

                  {/* Button */}
                  <button className="mt-auto ml-auto border border-white-95 w-12 h-12 flex items-center justify-center rounded-md text-orange-50 hover:bg-orange-50 hover:text-white transition-colors">
                    <RiArrowRightUpLine size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Benefits
