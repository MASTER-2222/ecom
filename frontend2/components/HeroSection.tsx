'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      title: 'Biggest Sale of the Year',
      subtitle: 'Up to 80% OFF on Electronics',
      image: 'https://readdy.ai/api/search-image?query=modern%20electronics%20sale%20banner%20with%20smartphones%20laptops%20headphones%20on%20vibrant%20blue%20background%20with%20shopping%20elements%20promotional%20design%20clean%20professional%20ecommerce%20layout&width=1200&height=400&seq=banner1&orientation=landscape',
      cta: 'Shop Now',
      link: '/electronics'
    },
    {
      id: 2,
      title: 'Fashion Fiesta',
      subtitle: 'Trendy Clothes at Best Prices',
      image: 'https://readdy.ai/api/search-image?query=fashionable%20clothing%20collection%20banner%20with%20stylish%20apparel%20accessories%20shoes%20on%20elegant%20background%20modern%20fashion%20ecommerce%20promotional%20design%20colorful%20attractive%20layout&width=1200&height=400&seq=banner2&orientation=landscape',
      cta: 'Explore Fashion',
      link: '/fashion'
    },
    {
      id: 3,
      title: 'Mobile Madness',
      subtitle: 'Latest Smartphones at Unbeatable Prices',
      image: 'https://readdy.ai/api/search-image?query=latest%20smartphone%20collection%20banner%20with%20multiple%20mobile%20phones%20modern%20technology%20gadgets%20on%20sleek%20background%20professional%20ecommerce%20design%20promotional%20layout%20tech%20focused&width=1200&height=400&seq=banner3&orientation=landscape',
      cta: 'Shop Mobiles',
      link: '/mobiles'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-96 md:h-[400px] overflow-hidden bg-gradient-to-r from-[#2874f0] to-blue-600">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-lg">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {banner.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.link}
                    className="inline-block bg-[#fdd835] text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/20 rounded-full p-2 transition-colors cursor-pointer"
      >
        <i className="ri-arrow-left-line text-2xl w-6 h-6 flex items-center justify-center"></i>
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % banners.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/20 rounded-full p-2 transition-colors cursor-pointer"
      >
        <i className="ri-arrow-right-line text-2xl w-6 h-6 flex items-center justify-center"></i>
      </button>
    </div>
  );
}