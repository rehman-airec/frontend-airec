'use client';

import React, { useState, useEffect, useRef } from 'react';
import TestimonialCard, { TestimonialProps } from './TestimonialCard';
import { ChevronLeft, ChevronRight, Play, Pause, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock testimonial data
const testimonials: TestimonialProps[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0c5?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'This platform completely transformed my job search experience. I found my dream role within 2 weeks of signing up. The application process was seamless and the quality of job matches was exceptional.',
    companyLogo: ''
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateLabs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'As a hiring manager, I\'ve never seen such high-quality candidates. The platform\'s AI matching system brings us exactly the talent we\'re looking for. It\'s saved us months of recruitment time.',
    companyLogo: ''
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    company: 'DesignStudio Pro',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'The user experience is incredible! From profile creation to application tracking, everything is intuitive and well-designed. I landed 3 interviews in my first week.',
    companyLogo: ''
  },
  {
    id: 4,
    name: 'David Park',
    role: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'I was skeptical about online job platforms, but this one proved me wrong. The direct communication with employers and transparent process made all the difference. Highly recommend!',
    companyLogo: ''
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Marketing Director',
    company: 'BrandForward',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'The analytics and insights provided helped me understand exactly what employers were looking for. I was able to tailor my applications and got a 90% response rate.',
    companyLogo: ''
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Full Stack Developer',
    company: 'StartupXYZ',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: 'From junior to senior level positions, the platform has opportunities for everyone. The skill-based matching is spot-on and the interview preparation resources are top-notch.',
    companyLogo: ''
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isPaused]);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const toggleAutoPlay = () => {
    setIsPaused(!isPaused);
  };

  // Get visible testimonials with smooth transitions
  const getVisibleTestimonials = () => {
    const visible = [];
    const total = testimonials.length;
    
    // Show current, previous, and next for smooth transitions
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + total) % total;
      visible.push({
        ...testimonials[index],
        position: i,
        isActive: i === 0
      });
    }
    return visible;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-400 to-blue-500 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Success Stories
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            What Our Users
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Join thousands of satisfied professionals who found their dream jobs and companies 
            who discovered amazing talent through our platform
          </p>
        </div>

        {/* Enhanced Testimonials Slider */}
        <div className="relative">
          {/* Main Slider Container */}
          <div className="relative overflow-hidden rounded-3xl">
            <div 
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-4xl mx-auto">
                    <TestimonialCard
                      testimonial={testimonial}
                      isActive={true}
                      isLarge={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="group p-4 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={toggleAutoPlay}
              className="group p-4 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isPaused ? (
                <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
              ) : (
                <Pause className="h-6 w-6 group-hover:scale-110 transition-transform" />
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={goToNext}
              disabled={isTransitioning}
              className="group p-4 rounded-full border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {/* Enhanced Dot Indicators */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`group transition-all duration-300 disabled:opacity-50 ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full hover:scale-125'
                }`}
              >
                {index === currentIndex && (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">98%</div>
              <div className="text-gray-700 font-semibold text-lg">Success Rate</div>
              <div className="text-gray-500 text-sm mt-2">Job placements</div>
            </div>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">2.5x</div>
              <div className="text-gray-700 font-semibold text-lg">Faster Hiring</div>
              <div className="text-gray-500 text-sm mt-2">Than traditional methods</div>
            </div>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">4.9</div>
              <div className="text-gray-700 font-semibold text-lg">Average Rating</div>
              <div className="text-gray-500 text-sm mt-2">User satisfaction</div>
            </div>
          </div>
          <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">24/7</div>
              <div className="text-gray-700 font-semibold text-lg">Support</div>
              <div className="text-gray-500 text-sm mt-2">Always available</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;