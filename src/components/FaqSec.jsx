import { useState } from 'react'
import { faqItems } from '../constant/data'
import { RiAddLine } from '@remixicon/react'

const FaqSec = () => {
  const [openId, setOpenId] = useState(faqItems[0]?.id ?? null)

  const handleClick = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="container mx-auto px-6 py-14 mb-16 bg-gradient-to-b from-orange-50 via-white to-orange-100 rounded-2xl shadow-[0_8px_25px_rgba(255,165,0,0.08)] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-200 rounded-full opacity-25 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>

      {/* Title Section */}
      <div className="relative max-w-2xl mx-auto text-center mb-10 z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-2 leading-relaxed">
          Still have any questions? Reach out to our friendly support team at{' '}
          <span className="text-orange-600 font-medium cursor-pointer hover:underline">
            support@skillpath.com
          </span>
        </p>
        <a
          href="#"
          className="inline-block text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all text-sm"
        >
          See All FAQ’s
        </a>
        <div className="h-[2px] w-20 bg-gradient-to-r from-orange-500 to-yellow-300 rounded-full mx-auto mt-4"></div>
      </div>

      {/* FAQ List */}
      <div className="relative max-w-2xl mx-auto bg-white/85 backdrop-blur-sm rounded-2xl shadow-md p-5 md:p-7 border border-orange-100/60 z-10">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="border-b border-orange-100/70 py-3 md:py-4 transition-all last:border-none"
          >
            {/* Question Header */}
            <div
              className="flex items-center justify-between cursor-pointer select-none gap-4 group"
              onClick={() => handleClick(item.id)}
            >
              <h4 className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h4>

              <button
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm 
                ${
                  openId === item.id
                    ? 'bg-orange-600 text-white rotate-45 scale-105'
                    : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}
              >
                <RiAddLine size={22} />
              </button>
            </div>

            {/* Answer Section */}
            <div
              className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                openId === item.id ? 'grid-rows-[1fr] pt-2' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-600 leading-relaxed text-xs md:text-sm px-1 md:px-2">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FaqSec
