import React from 'react'
import Title from './Title'
import { aboutData } from '../constant/data'

const AboutUs = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-5">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <Title
            title="About Us"
            text="We are dedicated to empowering learners worldwide with quality education. Our mission is to make learning accessible, engaging, and effective for everyone."
            link="Learn More"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-16">
          {aboutData.stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-orange-50 mb-2">{stat.value}</h3>
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Meet Our Team</h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aboutData.team.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                <img 
                  src={member.img} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-lg font-semibold mb-2">{member.name}</h4>
                <p className="text-orange-50 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs