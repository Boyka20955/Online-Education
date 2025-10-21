import React from 'react'
import {
  RiFacebookCircleFill,
  RiTwitterFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiUserLocationLine,
} from '@remixicon/react'
import { contactInfo as dataContactInfo } from '../constant/data'

// Social links
const socialLinks = [
  { id: 1, icon: RiFacebookCircleFill, href: '#' },
  { id: 2, icon: RiTwitterFill, href: '#' },
  { id: 3, icon: RiInstagramFill, href: '#' },
  { id: 4, icon: RiLinkedinBoxFill, href: '#' },
]

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 bg-gradient-to-b from-orange-50 via-white to-orange-100 border-t border-orange-100">
      <div className="container mx-auto px-6">
        {/* Footer Top */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-10 text-center md:text-left">
          {/* Brand + Social */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Education Path</h2>
              <p className="text-gray-600 text-sm max-w-sm mx-auto md:mx-0 leading-relaxed">
                Empowering learners and professionals to grow their skills through
                quality resources and practical training.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-start gap-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className="text-orange-600 bg-orange-100 hover:bg-orange-600 hover:text-white p-3 rounded-full shadow-md transition-all duration-300"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Get In Touch
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-md hover:shadow-xl hover:border-orange-300 transition-all duration-500 p-6">
              {dataContactInfo.map((item) => (
                <div
                  key={item.id}
                  className="flex group items-start gap-3 min-w-0"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-orange-200 transition-shadow duration-300">
                    {item.icon ? (
                      <item.icon
                        size={20}
                        className="text-orange-600 group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <RiUserLocationLine
                        size={20}
                        className="text-orange-600 group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs mb-0.5 group-hover:text-orange-600 transition-colors duration-300">
                      {item.type}
                    </h4>
                    {item.value && (
                      <a
                        href={
                          item.value.includes('@')
                            ? `mailto:${item.value}`
                            : item.value.includes('+')
                            ? `tel:${item.value}`
                            : '#'
                        }
                        className="text-gray-800 hover:text-orange-600 text-xs font-semibold block transition-colors duration-300 underline decoration-orange-300 underline-offset-1"
                      >
                        {item.value}
                      </a>
                    )}
                    {item.description && (
                      <p className="text-gray-600 text-xs mt-0.5 leading-tight font-medium">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-orange-100 pt-6 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} SkillPath. All rights reserved. | Designed by{' '}
            <span className="text-orange-600 font-medium">Francis Irungu</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
