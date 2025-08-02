'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import RecommendationEngine from '../components/RecommendationEngine';
import { productImages, categoryImages, getProductImage } from '../lib/cloudinary-images';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const topDeals = [
    {
      id: '1',
      name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
      price: 89999,
      originalPrice: 124999,
      image: productImages['samsung-s24'],
      rating: 4.5,
      reviews: 1250
    },
    {
      id: '2',
      name: 'Apple iPhone 15 Pro Max (Natural Titanium, 256GB)',
      price: 134900,
      originalPrice: 159900,
      image: productImages['iphone-15'],
      rating: 4.7,
      reviews: 892
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      price: 24990,
      originalPrice: 34990,
      image: productImages['sony-headphones'],
      rating: 4.6,
      reviews: 2100
    },
    {
      id: '4',
      name: 'MacBook Air M2 Chip (13-inch, 8GB RAM, 256GB SSD)',
      price: 99900,
      originalPrice: 119900,
      image: productImages['macbook-air'],
      rating: 4.8,
      reviews: 756
    },
    {
      id: '5',
      name: 'Dell XPS 13 Plus (Intel i7, 16GB RAM, 512GB SSD)',
      price: 134990,
      originalPrice: 159990,
      image: productImages['dell-xps'],
      rating: 4.4,
      reviews: 432
    }
  ];

  const electronics = [
    {
      id: '6',
      name: 'LG 55" 4K Ultra HD Smart OLED TV',
      price: 89999,
      originalPrice: 124999,
      image: productImages['lg-oled-tv'],
      rating: 4.5,
      reviews: 678
    },
    {
      id: '7',
      name: 'Canon EOS R6 Mark II Mirrorless Camera',
      price: 219999,
      originalPrice: 259999,
      image: productImages['canon-camera'],
      rating: 4.7,
      reviews: 245
    },
    {
      id: '8',
      name: 'PlayStation 5 Console with DualSense Controller',
      price: 54999,
      originalPrice: 59999,
      image: productImages['ps5-console'],
      rating: 4.9,
      reviews: 1890
    },
    {
      id: '9',
      name: 'Nintendo Switch OLED Model Gaming Console',
      price: 37999,
      originalPrice: 42999,
      image: productImages['nintendo-switch'],
      rating: 4.6,
      reviews: 1234
    }
  ];

  const mobiles = [
    {
      id: '10',
      name: 'OnePlus 12 5G (Flowy Emerald, 256GB)',
      price: 64999,
      originalPrice: 69999,
      image: 'https://readdy.ai/api/search-image?query=OnePlus%20flagship%20smartphone%20emerald%20green%20color%20premium%20mobile%20phone%20sleek%20design%20clean%20white%20background%20professional%20product%20photography%20modern%20android&width=300&height=300&seq=oneplus-12&orientation=squarish',
      rating: 4.4,
      reviews: 892
    },
    {
      id: '11',
      name: 'Google Pixel 8 Pro (Obsidian Black, 128GB)',
      price: 79999,
      originalPrice: 94999,
      image: 'https://readdy.ai/api/search-image?query=Google%20Pixel%20smartphone%20obsidian%20black%20premium%20mobile%20phone%20clean%20minimalist%20design%20white%20background%20professional%20product%20photography%20android%20flagship&width=300&height=300&seq=pixel-8&orientation=squarish',
      rating: 4.5,
      reviews: 567
    },
    {
      id: '12',
      name: 'Xiaomi 14 Ultra (White, 512GB)',
      price: 99999,
      originalPrice: 119999,
      image: 'https://readdy.ai/api/search-image?query=Xiaomi%20flagship%20smartphone%20white%20color%20premium%20mobile%20phone%20modern%20design%20camera%20setup%20clean%20white%20background%20professional%20product%20photography&width=300&height=300&seq=xiaomi-14&orientation=squarish',
      rating: 4.3,
      reviews: 1123
    }
  ];

  const categories = [
    {
      name: 'Electronics',
      icon: 'ri-computer-line',
      image: 'https://readdy.ai/api/search-image?query=electronics%20category%20icon%20with%20laptop%20smartphone%20headphones%20modern%20tech%20gadgets%20blue%20background%20clean%20minimalist%20design%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-electronics&orientation=squarish',
      href: '/electronics'
    },
    {
      name: 'Fashion',
      icon: 'ri-shirt-line',
      image: 'https://readdy.ai/api/search-image?query=fashion%20category%20icon%20with%20stylish%20clothing%20accessories%20shoes%20modern%20apparel%20design%20colorful%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-fashion&orientation=squarish',
      href: '/fashion'
    },
    {
      name: 'Home & Kitchen',
      icon: 'ri-home-line',
      image: 'https://readdy.ai/api/search-image?query=home%20kitchen%20category%20icon%20with%20appliances%20furniture%20cooking%20utensils%20modern%20household%20items%20warm%20background%20clean%20minimalist%20ecommerce%20illustration&width=120&height=120&seq=cat-home&orientation=squarish',
      href: '/home'
    },
    {
      name: 'Appliances',
      icon: 'ri-fridge-line',
      image: 'https://readdy.ai/api/search-image?query=appliances%20category%20icon%20with%20refrigerator%20washing%20machine%20microwave%20modern%20home%20appliances%20clean%20background%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-appliances&orientation=squarish',
      href: '/appliances'
    },
    {
      name: 'Mobiles',
      icon: 'ri-smartphone-line',
      image: 'https://readdy.ai/api/search-image?query=mobile%20phones%20category%20icon%20with%20smartphones%20accessories%20modern%20mobile%20devices%20tech%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-mobiles&orientation=squarish',
      href: '/mobiles'
    },
    {
      name: 'Books',
      icon: 'ri-book-line',
      image: 'https://readdy.ai/api/search-image?query=books%20category%20icon%20with%20stack%20of%20books%20reading%20education%20literature%20warm%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-books&orientation=squarish',
      href: '/books'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection />

      <ProductCarousel title="Top Deals" products={topDeals} />

      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <RecommendationEngine title="Recommended for You" />

      <ProductCarousel title="Best of Electronics" products={electronics} />

      <div className="bg-gradient-to-r from-red-500 to-pink-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">⚡ Flash Sale</h2>
          <p className="text-white/90 text-lg mb-6">Limited time offer! Grab these deals before they're gone!</p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold" suppressHydrationWarning={true}>{timeLeft.hours}</div>
              <div className="text-sm">Hours</div>
            </div>
            <div className="text-white text-2xl">:</div>
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold" suppressHydrationWarning={true}>{timeLeft.minutes}</div>
              <div className="text-sm">Minutes</div>
            </div>
            <div className="text-white text-2xl">:</div>
            <div className="bg-white/20 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold" suppressHydrationWarning={true}>{timeLeft.seconds}</div>
              <div className="text-sm">Seconds</div>
            </div>
          </div>
          <Link href="/flash-sale" className="inline-block bg-[#fdd835] text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors whitespace-nowrap cursor-pointer">
            Shop Flash Sale
          </Link>
        </div>
      </div>

      <ProductCarousel title="Trending Mobiles" products={mobiles} />

      <Footer />
    </div>
  );
}