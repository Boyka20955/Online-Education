import React from 'react'
import { heroLogos } from '../constant/data'
import { RiPlayFill } from '@remixicon/react'
import Marquee from 'react-fast-marquee'

const Hero = () => {
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
  return (
    <section className="pb-10 md:pb-16">
      <div className="container">
        {/* Hero Content */}
        <div className="mt-10 md:mt-14 text-center space-y-3">

          {/* Title Section */}
          <div className="relative flex items-center justify-center max-w-max mx-auto">
            <span className="absolute -left-10 top-1/2 -translate-y-1/2 w-[36px] h-[40px] animate-float">
              <img src="/images/shape-1.png" alt="shape" className="w-full h-full object-contain" />
            </span>

            <div className="flex items-center bg-white-99 border border-white-95 rounded-md py-2 px-3 gap-2">
              <img src="/images/shape-2.png" alt="shape" width={36} height={36} />
              <h1 className="text-xl md:text-3xl">
                <span className="text-orange-50">Unlock</span> Your Creative Potential
              </h1>
            </div>
          </div>

          <p className="text-base md:text-lg font-medium">with Online Design and Development Courses.</p>
          <p className="text-sm md:text-base">Learn from Industry Experts and Enhance Your Skills.</p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => scrollToSection('courses')}
              className="primary-btn px-5 py-2 text-sm md:text-base"
            >
              Explore Courses
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="secondary-btn px-5 py-2 text-sm md:text-base"
            >
              View Pricing
            </button>
          </div>

          {/* Client Logos */}
          <div className="mt-8 relative overflow-hidden">
            <Marquee pauseOnHover={true} speed={40}>
              {heroLogos.map((logo) => (
                <div className="px-8" key={logo.id}>
                  <img src={logo.img} alt="logo" width={logo.width} height={24} />
                </div>
              ))}
            </Marquee>
            <div className="absolute top-0 left-0 bg-gradient-to-r from-white-97 via-white-97/70 to-transparent w-10 h-full z-10" />
            <div className="absolute top-0 right-0 bg-gradient-to-l from-white-97 via-white-97/70 to-transparent w-10 h-full z-10" />
          </div>

          {/* Hero Banner */}
          <figure className="relative rounded-lg overflow-hidden mt-8 md:mt-10 max-w-[480px] w-full h-[240px] mx-auto shadow-md">
            <img src="/images/hero-banner.png" alt="hero" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/25 z-10" />
            <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
              <span className="flex bg-white w-12 h-12 items-center justify-center rounded-full play-btn shadow hover:scale-110 transition-transform">
                <RiPlayFill size={22} />
              </span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}

export default Hero
