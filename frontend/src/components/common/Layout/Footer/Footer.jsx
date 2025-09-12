// src/components/common/Layout/Footer/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Learn',
      links: [
        { name: 'About Math', href: '#' },
        { name: 'How to Play', href: '#' },
        { name: 'Tips & Tricks', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#' },
        { name: 'Contact Us', href: '#' },
        { name: 'Bug Report', href: '#' }
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Leaderboard', href: '#' },
        { name: 'Forums', href: '#' },
        { name: 'Teachers', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl animate-pulse">🔢</div>
              <h3 className="text-xl font-bold">OnlyMaths</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Making mathematics fun and accessible for kids everywhere! 
              Join thousands of young mathematicians on their learning journey.
            </p>
            <div className="flex space-x-4">
              {['📘', '🐦', '📷', '🎵'].map((emoji, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-2xl hover:scale-110 transition-transform duration-300"
                >
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4 text-yellow-200">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-purple-100 hover:text-yellow-200 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-400 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-sm text-purple-100">
              © {currentYear} OnlyMaths. All rights reserved.
            </p>
            <span className="text-yellow-300 text-sm">Made with 💝 for kids</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-purple-100">
            <a href="#" className="hover:text-yellow-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-200 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-yellow-200 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
