'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';

const CTASection: React.FC = () => {
  const benefits = [
    'Free to join and use',
    'No hidden fees or charges',
    'Direct employer connections',
    '24/7 customer support'
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/90 to-purple-800/90"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-blue-100">Rated 4.9/5 by 10,000+ users</span>
        </div>

        {/* Main CTA heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Ready to Transform
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Your Career?
          </span>
        </h2>

        <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Join thousands of candidates and companies already using our platform 
          to build successful careers and teams
        </p>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link href="/auth/signup">
            <Button 
              size="lg" 
              className="group bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 font-bold px-10 py-5 text-lg shadow-2xl"
            >
              Sign Up as Candidate
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white bg-black hover:bg-gray-800 backdrop-blur-sm scale-105 transition-all duration-300 font-bold px-10 py-5 text-lg"
            >
              Post Jobs as Employer
            </Button>
          </Link>
        </div>

        {/* Additional info */}
        <div className="mt-12 text-blue-200 text-sm">
          <p>No credit card required • Get started in less than 2 minutes</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
