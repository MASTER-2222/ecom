'use client';

import Link from 'next/link';

import { footerImages } from '../lib/cloudinary-images';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#fdd835]">About RitKart</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">About Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">RitKart Stories</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#fdd835]">Help</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Payments</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Shipping</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Cancellation & Returns</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">FAQ</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Report Infringement</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#fdd835]">Policy</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Return Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Terms of Use</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Security</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Privacy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white text-sm cursor-pointer">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#fdd835]">Social</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-facebook-fill text-xl w-6 h-6 flex items-center justify-center"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-twitter-fill text-xl w-6 h-6 flex items-center justify-center"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-youtube-fill text-xl w-6 h-6 flex items-center justify-center"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white cursor-pointer">
                <i className="ri-instagram-line text-xl w-6 h-6 flex items-center justify-center"></i>
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p className="mb-2">Mail Us:</p>
              <p>RitKart Internet Private Limited</p>
              <p>Buildings Alyssa, Begonia & Clove</p>
              <p>Embassy Tech Village</p>
              <p>Outer Ring Road, Devarabeesanahalli Village</p>
              <p>Bengaluru, 560103, Karnataka, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-2xl font-['Pacifico'] text-[#fdd835] mr-4">RitKart</span>
            <span className="text-sm text-gray-400">© 2024 RitKart. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <img src={footerImages.payment} alt="Payment Icons" className="h-6 object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}