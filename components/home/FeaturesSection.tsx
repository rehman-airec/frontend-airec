'use client';

import React from 'react';
import FeatureCard from './FeatureCard';
import { Search, Users, TrendingUp, Shield, Clock, Target } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      description: 'Advanced AI-powered filtering and search capabilities to find the perfect job match tailored to your skills.',
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      title: 'Direct Applications',
      description: 'Apply directly to companies with streamlined application processes and instant confirmation.',
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your application status in real-time and get insights to improve your success rate.',
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and complete privacy control.',
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about new opportunities and application status changes.',
      iconColor: 'text-indigo-600',
      iconBgColor: 'bg-indigo-100'
    },
    {
      icon: Target,
      title: 'Perfect Matches',
      description: 'Our algorithm analyzes your profile to suggest the most relevant job opportunities.',
      iconColor: 'text-rose-600',
      iconBgColor: 'bg-rose-100'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Everything You Need to
            <span className="block text-blue-600">Land Your Dream Job</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide comprehensive tools and services to make your job search journey 
            smooth, efficient, and successful
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-2">Ready to experience the difference?</p>
          <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
            <span>Join thousands of successful candidates</span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
