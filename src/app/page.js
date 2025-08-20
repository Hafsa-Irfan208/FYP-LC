"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="w-full scroll-smooth">
      {/* Navbar */}
      <header className="w-full backdrop-blur-md bg-white/90 fixed top-0 left-0 z-50 border-b border-[#38b2ac]/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full px-8 py-1">
          {/* Logo */}
          <div className="flex items-center -my-2">
            <Image 
              src="/logo.png" 
              alt="LeetConnect Logo" 
              width={700} 
              height={700} 
              className="h-24 w-auto" 
              priority 
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-lg font-medium text-gray-700">
            <a
              href="#home"
              className="hover:text-[#38b2ac] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#38b2ac] after:transition-all after:duration-300"
            >
              Home
            </a>
            <a
              href="#about-us"
              className="hover:text-[#38b2ac] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#38b2ac] after:transition-all after:duration-300"
            >
              About Us
            </a>
            <a
              href="#services"
              className="hover:text-[#38b2ac] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#38b2ac] after:transition-all after:duration-300"
            >
              Services
            </a>
            <a
              href="#explore"
              className="hover:text-[#38b2ac] transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#38b2ac] after:transition-all after:duration-300"
            >
              Explore
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link href="/signin">
              <button className="px-6 py-2.5 text-[#38b2ac] font-medium border border-[#38b2ac] rounded-full hover:bg-[#38b2ac] hover:text-white transition-all duration-300">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2.5 text-white font-medium bg-[#38b2ac] rounded-full hover:bg-[#2c9490] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#38b2ac]/20">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Home Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center py-20 md:py-32 px-8 bg-gradient-to-br from-[#38b2ac] via-[#319795] to-[#2c9490] text-white overflow-hidden"
      >
        {/* Geometric shapes decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full border border-white/10 animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full border border-white/10 animate-float-medium"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 rounded-full border border-white/10 animate-float-slow"></div>
          
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-teal-300/10 animate-float-fast"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-tl-3xl rounded-br-3xl bg-white/5 rotate-45 animate-float-slow"></div>
          
          <div className="absolute top-10 left-1/3 w-36 h-36 bg-white/5 rounded-3xl rotate-12 animate-float-medium"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-3xl -rotate-12 animate-float-slow"></div>
          
          {/* Hexagon grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(5) rotate(0)">
                  <polygon points="25,0 50,14.4 50,37.7 25,51.7 0,37.7 0,14.4" fill="none" stroke="white" strokeWidth="1"></polygon>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)"></rect>
            </svg>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-lg" data-aos="fade-right">
            <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
              <span className="text-white text-sm font-medium tracking-wide">The Ultimate Coding Education Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight md:leading-snug">
              <span className="block">Empower Your</span>
              <span className="bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            
            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              LeetConnect provides a comprehensive classroom platform with automated code evaluation capabilities, allowing you to create, manage, and evaluate coding assignments with unprecedented ease and efficiency.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-5">
              <Link href="/register">
                <button className="group relative px-8 py-4 bg-white text-[#38b2ac] font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </span>
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-teal-400 to-teal-500 transform -skew-x-[20deg] -left-10 group-hover:left-[calc(100%+10px)] transition-all duration-1000 ease-in-out"></div>
                </button>
              </Link>
              
              <button className="relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center">
                  Watch Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
              </button>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-3">
                <img src="/avatar1.png" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="/avatar2.png" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                <img src="/avatar3.png" alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-teal-600 flex items-center justify-center text-white text-xs font-bold">+5k</div>
              </div>
              <div className="text-white/90 text-sm">
                <span className="font-bold text-white">5,000+</span> learners already joined
              </div>
            </div>
            
            {/* New Trust badges */}
            <div className="mt-16 pt-6 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-4">Trusted by leading institutions</p>
              <div className="flex flex-wrap items-center gap-6">
                <div className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                    <path d="M12 2H2v10h10V2zM26 2H16v10h10V2zM12 16H2v10h10V16zM26 16H16v10h10V16zM40 2h10v10H40V2zM40 16h10v10H40V16zM64 2H54v10h10V2zM78 2H68v10h10V2zM64 16H54v10h10V16zM78 16H68v10h10V16z" />
                  </svg>
                </div>
                <div className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                    <path d="M20 6H6v2h14V6zM24 10H2v2h22v-2zM24 14H2v2h22v-2zM24 18H2v2h22v-2zM20 22H6v2h14v-2zM50 10l-6-4v8l6-4zM60 6H46v2h14V6zM64 10H42v2h22v-2zM64 14H42v2h22v-2zM64 18H42v2h22v-2zM60 22H46v2h14v-2zM90 6H76v2h14V6zM94 10H72v2h22v-2zM94 14H72v2h22v-2zM94 18H72v2h22v-2zM90 22H76v2h14v-2zM114 10l-6-4v8l6-4z" />
                  </svg>
                </div>
                <div className="opacity-70 hover:opacity-100 transition-opacity">
                  <svg width="90" height="28" viewBox="0 0 90 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                    <path d="M14 3.875L2 9.175v13.9L14 18.4V3.875zM45 3.875L33 9.175v13.9L45 18.4V3.875zM30 9.175L18 3.875V18.4l12 4.675v-13.9zM61 9.175L49 3.875V18.4l12 4.675v-13.9zM76 3.875v14.525l12-4.675v-13.9L76 3.875z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative mt-10 md:mt-0" data-aos="fade-left">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-600/20 to-teal-300/20 rounded-3xl blur-xl"></div>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"></div>
            
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-2xl p-2">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/code-pattern.png')] bg-center opacity-5"></div>
              
              <Image 
                src="/home.png" 
                alt="Learning Platform" 
                width={600} 
                height={600} 
                className="relative rounded-2xl shadow-2xl transform transition-transform duration-700 hover:scale-105 z-10"
              />
              
              {/* Floating badges */}
              <div className="absolute -right-6 top-10 bg-white rounded-xl shadow-lg p-4 w-36 animate-float-medium z-20">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-xs font-bold text-gray-800">Task Complete</div>
                    <div className="text-xs text-gray-500">All tests passed</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-6 bottom-20 bg-white rounded-xl shadow-lg p-3 w-44 animate-float-slow z-20">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#38b2ac] flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-xs font-bold text-gray-800">Code Verified</div>
                    <div className="text-xs text-gray-500">100% efficiency</div>
                  </div>
                </div>
              </div>
              
              {/* New notification badge */}
              <div className="absolute -top-4 left-12 bg-white rounded-xl shadow-lg p-3 w-40 animate-float-medium z-20">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-xs font-bold text-gray-800">New Assignment</div>
                    <div className="text-xs text-gray-500">Due in 2 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full text-white"
            fill="currentColor"
            preserveAspectRatio="none"
          >
            <path
              fillOpacity="1"
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Add required CSS animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>

      {/* About Us Section */}
      <section
        id="about-us"
        className="py-28 px-8 bg-white relative overflow-hidden"
      >
        {/* Background patterns */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#38b2ac]/5">
            <g clipPath="url(#clip0_201_2)">
              <g opacity="0.5">
                <path d="M400 0H0V400H400V0Z" fill="currentColor" />
                <path d="M39 400H-11V350H39V400Z" fill="currentColor" />
                <path d="M90 350H40V300H90V350Z" fill="currentColor" />
                <path d="M190 350H140V300H190V350Z" fill="currentColor" />
                <path d="M290 350H240V300H290V350Z" fill="currentColor" />
                <path d="M390 350H340V300H390V350Z" fill="currentColor" />
                <path d="M39 200H-11V150H39V200Z" fill="currentColor" />
                <path d="M39 100H-11V50H39V100Z" fill="currentColor" />
                <path d="M90 250H40V200H90V250Z" fill="currentColor" />
                <path d="M90 150H40V100H90V150Z" fill="currentColor" />
                <path d="M90 50H40V0H90V50Z" fill="currentColor" />
                <path d="M190 250H140V200H190V250Z" fill="currentColor" />
                <path d="M190 150H140V100H190V150Z" fill="currentColor" />
                <path d="M190 50H140V0H190V50Z" fill="currentColor" />
                <path d="M290 250H240V200H290V250Z" fill="currentColor" />
                <path d="M290 150H240V100H290V150Z" fill="currentColor" />
                <path d="M290 50H240V0H290V50Z" fill="currentColor" />
                <path d="M390 250H340V200H390V250Z" fill="currentColor" />
                <path d="M390 150H340V100H390V150Z" fill="currentColor" />
                <path d="M390 50H340V0H390V50Z" fill="currentColor" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_201_2">
                <rect width="400" height="400" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 rotate-180">
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#38b2ac]/5">
            <g clipPath="url(#clip0_201_2)">
              <g opacity="0.5">
                <path d="M400 0H0V400H400V0Z" fill="currentColor" />
                <path d="M39 400H-11V350H39V400Z" fill="currentColor" />
                <path d="M90 350H40V300H90V350Z" fill="currentColor" />
                <path d="M190 350H140V300H190V350Z" fill="currentColor" />
                <path d="M290 350H240V300H290V350Z" fill="currentColor" />
                <path d="M390 350H340V300H390V350Z" fill="currentColor" />
                <path d="M39 200H-11V150H39V200Z" fill="currentColor" />
                <path d="M39 100H-11V50H39V100Z" fill="currentColor" />
                <path d="M90 250H40V200H90V250Z" fill="currentColor" />
                <path d="M90 150H40V100H90V150Z" fill="currentColor" />
                <path d="M90 50H40V0H90V50Z" fill="currentColor" />
                <path d="M190 250H140V200H190V250Z" fill="currentColor" />
                <path d="M190 150H140V100H190V150Z" fill="currentColor" />
                <path d="M190 50H140V0H190V50Z" fill="currentColor" />
                <path d="M290 250H240V200H290V250Z" fill="currentColor" />
                <path d="M290 150H240V100H290V150Z" fill="currentColor" />
                <path d="M290 50H240V0H290V50Z" fill="currentColor" />
                <path d="M390 250H340V200H390V250Z" fill="currentColor" />
                <path d="M390 150H340V100H390V150Z" fill="currentColor" />
                <path d="M390 50H340V0H390V50Z" fill="currentColor" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_201_2">
                <rect width="400" height="400" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section heading with animated effect */}
          <div className="relative text-center mb-20">
            <h2 className="text-9xl font-bold text-center opacity-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-[#38b2ac]">
              ABOUT
            </h2>
            <div className="relative z-10">
              <span className="inline-block px-4 py-1 bg-[#38b2ac]/10 rounded-full text-[#38b2ac] text-sm font-medium tracking-wider mb-4">WHO WE ARE</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Transforming Education Through Technology
              </h2>
              <div className="h-1 w-20 bg-[#38b2ac] mx-auto rounded-full"></div>
            </div>
          </div>
          
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
            At <span className="text-[#38b2ac] font-bold">LeetConnect</span>, we
            strive to revolutionize the way educators and students interact. Our
            platform provides a complete educational environment with advanced code evaluation features, making it easier to
            manage coding assignments, evaluate results, and provide instant
            feedback, fostering a smarter and more engaging learning experience.
          </p>

          {/* Feature Highlights with 3D effect cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20 items-center">
            {/* Left Side Text */}
            <div className="space-y-12">
              <div
                className="feature-card group bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38b2ac] to-teal-500 flex items-center justify-center shadow-lg text-white">
                    <Image
                      src="/classroom.png"
                      alt="Virtual Classroom"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[#38b2ac] mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      Virtual Classroom
                    </h3>
                    <p className="text-gray-600">
                      Efficiently manage class materials, assignments, and
                      announcements with our intuitive education platform. Save time and streamline your workflow.
                    </p>
                    <a href="#" className="inline-flex items-center mt-3 text-sm text-[#38b2ac] hover:underline">
                      Learn more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div
                className="feature-card group bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38b2ac] to-teal-500 flex items-center justify-center shadow-lg text-white">
                    <Image
                      src="/judge.png"
                      alt="Automated Code Evaluation"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[#38b2ac] mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      Automated Code Evaluation
                    </h3>
                    <p className="text-gray-600">
                      Automatically assess coding assignments in multiple
                      programming languages with our powerful evaluation engine. Grade with confidence and accuracy.
                    </p>
                    <a href="#" className="inline-flex items-center mt-3 text-sm text-[#38b2ac] hover:underline">
                      Learn more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div
                className="feature-card group bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38b2ac] to-teal-500 flex items-center justify-center shadow-lg text-white">
                    <Image
                      src="/aboutus2.png"
                      alt="Real-Time Feedback"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[#38b2ac] mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      Real-Time Feedback
                    </h3>
                    <p className="text-gray-600">
                      Enable students to improve faster with smart, personalized feedback on
                      their work. Accelerate learning with detailed insights and suggestions.
                    </p>
                    <a href="#" className="inline-flex items-center mt-3 text-sm text-[#38b2ac] hover:underline">
                      Learn more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Image */}
            <div className="relative order-first md:order-last perspective">
              <div className="absolute inset-0 border-2 border-[#38b2ac]/30 rounded-xl transform rotate-6 scale-105"></div>
              <div className="absolute inset-0 border-2 border-[#38b2ac]/20 rounded-xl transform -rotate-2 scale-105"></div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#38b2ac]/10 to-teal-100/20 rounded-xl transform rotate-3 scale-105"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src="/aboutus1.png"
                    alt="About Us"
                    width={600}
                    height={400}
                    className="relative w-full h-auto hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#38b2ac]/90 to-transparent p-6">
                    <div className="grid grid-cols-3 gap-4 text-white">
                      <div className="text-center">
                        <div className="text-3xl font-bold">500+</div>
                        <div className="text-sm opacity-80">Schools</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">10k+</div>
                        <div className="text-sm opacity-80">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold">95%</div>
                        <div className="text-sm opacity-80">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating decoration */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#38b2ac]/10"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#38b2ac]/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Add required CSS for 3D effect */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        
        .feature-card {
          position: relative;
          z-index: 1;
        }
        
        .feature-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(56, 178, 172, 0) 100%);
          border-radius: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .feature-card:hover::after {
          opacity: 1;
        }
      `}</style>

      {/* Services Section */}
      <section
        id="services"
        className="py-24 px-8 bg-gradient-to-b from-white to-teal-50/30 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-0.5 w-full max-w-3xl bg-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 text-[#38b2ac] text-sm font-medium uppercase tracking-widest">Our Services</span>
            </div>
          </div>
          
          <h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8"
          >
            What We Offer
          </h2>
          <p
            className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-20"
          >
            Discover how <span className="text-[#38b2ac] font-bold">LeetConnect</span>{" "}
            transforms learning with innovative tools like virtual classroom
            management, automated code evaluation, and real-time feedback. We empower both
            educators and students with seamless experiences and data-driven insights.
          </p>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="group relative p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-[#38b2ac]/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 left-0 h-2 w-0 group-hover:w-full bg-[#38b2ac] transition-all duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-teal-50 p-3 mb-6 group-hover:bg-[#38b2ac]/10 transition-all duration-300">
                <Image
                  src="/classroom.png"
                  alt="Virtual Classroom"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#38b2ac] mb-4">
                Virtual Classroom Environment
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Manage class materials, assignments, and announcements effortlessly
                with our comprehensive educational platform. Save time and focus on what matters most - teaching.
              </p>
              <a href="#" className="inline-flex items-center text-[#38b2ac] font-medium hover:underline mt-auto">
                Learn more
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            
            <div
              className="group relative p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-[#38b2ac]/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 left-0 h-2 w-0 group-hover:w-full bg-[#38b2ac] transition-all duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-teal-50 p-3 mb-6 group-hover:bg-[#38b2ac]/10 transition-all duration-300">
                <Image
                  src="/judge.png"
                  alt="Automated Code Evaluation"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#38b2ac] mb-4">
                Automated Code Evaluation
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Automatically evaluate coding assignments with support for multiple
                programming languages via our advanced execution engine. Provide accurate and consistent grading at scale.
              </p>
              <a href="#" className="inline-flex items-center text-[#38b2ac] font-medium hover:underline mt-auto">
                Learn more
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            
            <div
              className="group relative p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-[#38b2ac]/30 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 left-0 h-2 w-0 group-hover:w-full bg-[#38b2ac] transition-all duration-500"></div>
              <div className="w-16 h-16 rounded-2xl bg-teal-50 p-3 mb-6 group-hover:bg-[#38b2ac]/10 transition-all duration-300">
                <Image
                  src="/feedback.png"
                  alt="Real-Time Feedback"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#38b2ac] mb-4">
                Real-Time Feedback System
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Provide students with personalized, detailed feedback to help them improve their
                skills and achieve their learning goals faster. Build confidence through continuous improvement.
              </p>
              <a href="#" className="inline-flex items-center text-[#38b2ac] font-medium hover:underline mt-auto">
                Learn more
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section
        id="explore"
        className="py-24 px-8 bg-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-0.5 w-full max-w-3xl bg-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 text-[#38b2ac] text-sm font-medium uppercase tracking-widest">Explore</span>
            </div>
          </div>
          
          <h2
            className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8"
          >
            Explore Our Platform
          </h2>
          <p
            className="text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16"
          >
            Discover the unique features of{" "}
            <span className="text-[#38b2ac] font-bold">LeetConnect</span>. From
            personalized dashboards to advanced analytics, we offer everything you
            need to track progress, gain insights, and create an engaging learning
            experience for coding education.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-stretch">
            {/* Feature 1 */}
            <div className="group flex flex-col h-full">
              <div className="mb-6 overflow-hidden rounded-xl shadow-lg relative h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-[#38b2ac]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/explore1.png"
                  alt="Personalized Dashboards"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-[#38b2ac] mb-4">
                  Personalized Dashboards
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get a comprehensive overview of assignments, deadlines, and
                  performance with user-friendly dashboards. Our intuitive interface makes it easy to stay on top of your work and track your progress.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Customizable widgets for different needs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">At-a-glance progress tracking</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Easy navigation between assignments</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col h-full">
              <div className="mb-6 overflow-hidden rounded-xl shadow-lg relative h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-[#38b2ac]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/explore2.png"
                  alt="Advanced Analytics"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-[#38b2ac] mb-4">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Measure student performance and gain actionable insights with
                  real-time data analytics. Make informed decisions based on comprehensive data visualization and reporting tools.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Performance trends over time</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Detailed reports on coding challenges</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#38b2ac] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Comparison with class averages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <section className="py-12 px-8 my-12 relative overflow-hidden">
          <div className="max-w-5xl mx-auto bg-[#38b2ac] rounded-3xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path fill="url(#cta-gradient)" fillOpacity="0.15" d="M0 0H100V100H0z" />
                <defs>
                  <pattern id="cta-pattern" patternUnits="userSpaceOnUse" width="25" height="25" patternTransform="scale(4) rotate(0)">
                    <circle cx="10" cy="10" r="1.5" fill="white" fillOpacity="0.4" />
                  </pattern>
                  <linearGradient id="cta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-12 md:p-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-lg">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Learning Experience?</h2>
                  <p className="text-white/90 text-lg">
                    Join thousands of educators and students who are already using LeetConnect to revolutionize their teaching and coding education journey.
                  </p>
                  
                  {/* Features list */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Smart assignment evaluation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Real-time code analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Virtual classroom management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">Advanced analytics dashboard</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20 w-full md:w-auto">
                  <h3 className="text-xl font-bold text-white mb-4">Get Started Today</h3>
                  <p className="text-white/80 text-sm mb-6">Create your account in less than 2 minutes and start using our platform immediately.</p>
                  
                  <div className="space-y-4">
                    <Link href="/register">
                      <button className="w-full px-8 py-3.5 bg-white text-[#38b2ac] font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                        Sign Up Now
                      </button>
                    </Link>
                    <button className="w-full px-8 py-3.5 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                      Request Demo
                    </button>
                  </div>
                  
                  <p className="text-white/60 text-xs text-center mt-6">No credit card required. Free 14-day trial.</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>
          </div>
        </section>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Image src="/logo.png" alt="LeetConnect Logo" width={180} height={180} className="mb-4" />
              <p className="text-gray-400 mt-4">Empowering education through innovative technology solutions.</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-[#38b2ac] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#38b2ac] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.017 10.017 0 01-3.127 1.195A4.92 4.92 0 0016.92 2.222a4.927 4.927 0 00-4.922 4.922 4.93 4.93 0 00.126 1.125A13.98 13.98 0 011.64 3.16a4.9 4.9 0 001.524 6.57 4.886 4.886 0 01-2.23-.616v.06a4.923 4.923 0 003.95 4.828 4.88 4.88 0 01-1.3.173 4.896 4.896 0 01-.927-.085 4.931 4.931 0 004.598 3.42A9.88 9.88 0 010 19.288a13.941 13.941 0 007.548 2.209c9.058 0 14.01-7.503 14.01-14.01 0-.211-.005-.424-.014-.636a10.015 10.015 0 002.46-2.548z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#38b2ac] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.072-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#38b2ac] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zm-13.632 17h-3v-8.746h3V19zm-1.5-9.708a1.631 1.631 0 110-3.261 1.631 1.631 0 010 3.261zM19 19h-3v-4.573c0-1.248-.28-2.082-1.599-2.082-.853 0-1.359.415-1.581.812-.083.202-.104.49-.104.777V19h-3v-8.746h3v1.297c.456-.623 1.308-1.297 3.108-1.297C17.693 10.254 19 11.517 19 14.151V19z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#38b2ac]">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about-us" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#explore" className="text-gray-400 hover:text-white transition-colors">Explore</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#38b2ac]">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-[#38b2ac]">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-400">info@leetconnect.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-400">123 Education St., Tech City, TC 12345</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 LeetConnect. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
