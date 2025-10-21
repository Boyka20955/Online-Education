import React, { useState } from 'react'
import Title from './Title'
import { testimonialsItems } from '../constant/data'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import { Navigation, Autoplay } from 'swiper/modules'

const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const [showAllModal, setShowAllModal] = useState(false);
  const closeModal = () => setSelectedTestimonial(null)
  const openAllModal = () => setShowAllModal(true);
  const closeAllModal = () => setShowAllModal(false);

const scrollToTestimonials = () => {
  const element = document.getElementById('testimonials');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

  return (
    <div id="testimonials" className="container mx-auto px-6 py-16 bg-gradient-to-b relative overflow-hidden">
      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
      <Title
        title="Our Testimonials"
        text="Strive for excellence in all that you do. Value time and discipline as paths to growth. Live with dignity and confidence, even in simple moments. Build your life with purpose, strength, and lasting harmony."
        link="View All"
        onClick={openAllModal}
      />
      </div>

      {/* Testimonials Slider */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={40}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 1.5 },
          1280: { slidesPerView: 2.5 },
        }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          prevEl: ".prev-btn",
          nextEl: ".next-btn",
        }}
        className="pb-12"
      >
        {testimonialsItems.map(item => (
          <SwiperSlide
            key={item.id}
            className="bg-gradient-to-br from-orange-50/40 to-white/20 backdrop-blur-sm border border-orange-100/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl text-center py-10 px-6 w-[85%] mx-auto"
          >
            {/* Image, Name, and Button */}
            <div className="flex flex-col items-center space-y-3">
              <img
                src={item.img}
                alt={item.author}
                width={80}
                height={80}
                className="rounded-full object-cover shadow-md cursor-pointer hover:scale-110 transition-transform duration-300"
                onClick={() =>
                  setSelectedTestimonial({
                    author: item.author,
                    text: item.text,
                    img: item.img,
                  })
                }
              />

              {/* Author Name */}
              <p className="font-semibold text-gray-800 text-base">
                {item.author}
              </p>

              {/* Button */}
              <button
                className="text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 transition-all duration-300 font-medium rounded-full px-5 py-1.5 text-sm shadow-sm"
                onClick={() =>
                  setSelectedTestimonial({
                    author: item.author,
                    text: item.text,
                    img: item.img,
                  })
                }
              >
                Read Full Story
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center mt-10 gap-6">
        <button className="prev-btn bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <RiArrowLeftLine size={24} />
        </button>
        <button className="next-btn bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
          <RiArrowRightLine size={24} />
        </button>
      </div>

      {/* Modal Popup */}
      {selectedTestimonial && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Image */}
            <div className="flex justify-center mb-4">
              <img
                src={selectedTestimonial.img}
                alt={selectedTestimonial.author}
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            </div>

            {/* Popup Text */}
            <p className="text-gray-700 italic mb-4 text-center">
              "{selectedTestimonial.text}"
            </p>

            {/* Author */}
            <p className="text-center font-semibold text-gray-900">
              — {selectedTestimonial.author}
            </p>
          </div>
        </div>
      )}

      {/* All Testimonials Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeAllModal}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">All Testimonials</h3>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={closeAllModal}
              >
                &times;
              </button>
            </div>

            {/* Modal Swiper */}
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={40}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1.5 },
                1280: { slidesPerView: 2.5 },
              }}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              navigation={{
                prevEl: ".modal-prev-btn",
                nextEl: ".modal-next-btn",
              }}
              className="pb-12"
            >
              {testimonialsItems.map(item => (
                <SwiperSlide
                  key={item.id}
                  className="bg-gradient-to-br from-orange-50/40 to-white/20 backdrop-blur-sm border border-orange-100/40 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-2xl text-center py-10 px-6 w-[85%] mx-auto"
                >
                  {/* Image, Name, and Button */}
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={item.img}
                      alt={item.author}
                      width={80}
                      height={80}
                      className="rounded-full object-cover shadow-md cursor-pointer hover:scale-110 transition-transform duration-300"
                      onClick={() =>
                        setSelectedTestimonial({
                          author: item.author,
                          text: item.text,
                          img: item.img,
                        })
                      }
                    />

                    {/* Author Name */}
                    <p className="font-semibold text-gray-800 text-base">
                      {item.author}
                    </p>

                    {/* Button */}
                    <button
                      className="text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 transition-all duration-300 font-medium rounded-full px-5 py-1.5 text-sm shadow-sm"
                      onClick={() =>
                        setSelectedTestimonial({
                          author: item.author,
                          text: item.text,
                          img: item.img,
                        })
                      }
                    >
                      Read Full Story
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Modal Navigation */}
            <div className="flex items-center justify-center mt-10 gap-6">
              <button className="modal-prev-btn bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <RiArrowLeftLine size={24} />
              </button>
              <button className="modal-next-btn bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <RiArrowRightLine size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Testimonials
