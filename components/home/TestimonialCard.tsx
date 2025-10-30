'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, Quote, CheckCircle } from 'lucide-react';

export interface TestimonialProps {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  testimonial: string;
  companyLogo?: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialProps;
  isActive?: boolean;
  isLarge?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  isActive = false,
  isLarge = false
}) => {
  const { name, role, company, avatar, rating, testimonial: content, companyLogo } = testimonial;

  if (isLarge) {
    return (
      <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-700 transform hover:scale-105 hover:shadow-3xl overflow-hidden">
        <CardContent className="p-12 relative">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
          </div>

          {/* Quote Icon */}
          <div className="absolute top-8 right-8 text-blue-100">
            <Quote className="h-12 w-12" />
          </div>

          {/* Enhanced Rating */}
          <div className="flex items-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all duration-300 ${
                  i < rating 
                    ? 'text-yellow-400 fill-current drop-shadow-sm' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-lg text-gray-600 ml-3 font-semibold">({rating}.0)</span>
          </div>

          {/* Enhanced Testimonial Content */}
          <blockquote className="text-gray-800 text-2xl leading-relaxed mb-10 font-medium relative z-10">
            <span className="text-4xl text-blue-400 font-bold leading-none">"</span>
            {content}
            <span className="text-4xl text-blue-400 font-bold leading-none">"</span>
          </blockquote>

          {/* Enhanced Author Info */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-2xl mb-1">{name}</div>
              <div className="text-gray-600 text-lg mb-2">{role}</div>
              <div className="flex items-center gap-3">
                <span className="text-lg text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">{company}</span>
                {companyLogo && (
                  <img 
                    src={companyLogo} 
                    alt={`${company} logo`} 
                    className="h-6 w-auto opacity-70"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 left-12 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute bottom-8 right-16 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping animation-delay-2000"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative bg-white/95 backdrop-blur-sm border-0 shadow-xl transition-all duration-500 transform ${
      isActive ? 'scale-105 shadow-2xl' : 'scale-95 opacity-75'
    } hover:scale-105 hover:shadow-2xl hover:opacity-100`}>
      <CardContent className="p-8 relative">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 text-blue-100">
          <Quote className="h-8 w-8" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">({rating}.0)</span>
        </div>

        {/* Testimonial Content */}
        <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 font-medium">
          "{content}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-3 border-blue-100"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-lg">{name}</div>
            <div className="text-gray-600">{role}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-blue-600 font-medium">{company}</span>
              {companyLogo && (
                <img 
                  src={companyLogo} 
                  alt={`${company} logo`} 
                  className="h-4 w-auto opacity-70"
                />
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-lg"></div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
