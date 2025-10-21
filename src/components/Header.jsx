import React, { useState } from 'react';
import { RiCloseLine, RiMenuLine } from '@remixicon/react';
import { Link } from 'react-router-dom';
import { navItems } from '../constant/data';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(!isOpen);

  return (
    <header className="w-full py-5">
      <div className="container flex items-center border-b border-b-white-95 pb-5">
        {/* Left: Title */}
        <div className="flex-1">
          <h2 className="text-left">Education Path</h2>
        </div>

        {/* Center Nav (Desktop) */}
        <div className="flex-1 flex justify-center hidden lg:flex">
          <ul className="flex gap-10">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="hover:text-orange-50 transition-colors font-medium text-lg text-center"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            to="/auth?mode=login"
            className="hidden lg:block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Login
          </Link>

          <Link
            to="/auth?mode=signup"
            className="hidden lg:block px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
          >
            Sign Up
          </Link>

          <button className="lg:hidden" onClick={handleClick}>
            <RiMenuLine />
          </button>
        </div>

        {/* Mobile Menu */}
        <nav className={`navbar lg:hidden ${isOpen ? 'active' : ''}`}>
          <button className="absolute top-8 right-8" onClick={handleClick}>
            <RiCloseLine size={30} />
          </button>

          <ul className="space-y-5 text-center">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="text-lg font-medium hover:text-orange-50 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/auth?mode=login"
                className="text-lg font-medium hover:text-orange-50 transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/auth?mode=signup"
                className="text-lg font-medium hover:text-orange-50 transition-colors"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
