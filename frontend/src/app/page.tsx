"use client";

import Link from "next/link";
import { Activity, TrendingUp, Target, Brain, Menu, X, ArrowRight, CheckCircle2, Zap, Award, Briefcase } from "lucide-react";
import SiteFooter from "@/components/layout/site-footer";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              SkillXIntell
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="#sectors" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Sectors
            </Link>
            <Link href="#how-it-works" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              How it Works
            </Link>
            <Link href="/login" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="#features" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">
                Features
              </Link>
              <Link href="#sectors" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">
                Sectors
              </Link>
              <Link href="#how-it-works" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">
                How it Works
              </Link>
              <Link href="/login" className="text-slate-700 hover:text-blue-600 transition-colors font-medium py-2">
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-center"
              >
                Get Started Free
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
            <Zap className="h-4 w-4" />
            AI-Powered Skill Intelligence Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Master Your Skills in
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare, Agriculture, Urban Tech & Beyond
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Track, analyze, and enhance your professional competencies with AI-powered insights. 
            Build career-ready skills across specialized sectors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link 
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Your Journey Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 hover:shadow-lg transition-all duration-200"
            >
              Login to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">3+</div>
              <div className="text-sm md:text-base text-slate-600 mt-1">Specialized Sectors</div>
            </div>
            <div className="text-center border-l border-r border-slate-200">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">AI</div>
              <div className="text-sm md:text-base text-slate-600 mt-1">Powered Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">100%</div>
              <div className="text-sm md:text-base text-slate-600 mt-1">Free to Start</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to track your progress and accelerate your career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 - Skill Tracker */}
            <div className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Skill Tracker</h3>
              <p className="text-slate-600 leading-relaxed">
                Monitor your competencies with detailed proficiency levels and comprehensive progress tracking
              </p>
            </div>

            {/* Feature 2 - Certifications */}
            <div className="group p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Certifications</h3>
              <p className="text-slate-600 leading-relaxed">
                Track and manage your professional credentials across all specialized sectors
              </p>
            </div>

            {/* Feature 3 - Projects */}
            <div className="group p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Projects</h3>
              <p className="text-slate-600 leading-relaxed">
                Showcase your real-world projects and demonstrate practical expertise to Employees
              </p>
            </div>

            {/* Feature 4 - Career Pathways */}
            <div className="group p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Career Pathways</h3>
              <p className="text-slate-600 leading-relaxed">
                Discover recommended career paths aligned with your skills and industry demand
              </p>
            </div>

            {/* Feature 5 - Assessment */}
            <div className="group p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Assessment</h3>
              <p className="text-slate-600 leading-relaxed">
                Evaluate your skill levels with comprehensive assessments and get actionable insights
              </p>
            </div>

            {/* Feature 6 - Analytics & Insights */}
            <div className="group p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analytics & Insights</h3>
              <p className="text-slate-600 leading-relaxed">
                Gain deep insights into your skill development with interactive dashboards and reports
              </p>
            </div>

            {/* Feature 7 - Sector Performance */}
            <div className="group p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sector Performance</h3>
              <p className="text-slate-600 leading-relaxed">
                Compare your performance across Healthcare, Agriculture, and Urban Technology sectors
              </p>
            </div>

            {/* Feature 8 - AI Recommendations */}
            <div className="group p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Recommendations</h3>
              <p className="text-slate-600 leading-relaxed">
                Get personalized learning paths and career recommendations powered by advanced AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="relative py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Specialized Sectors
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Master industry-specific skills with targeted learning paths and assessments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Healthcare */}
            <div className="group relative bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Healthcare Informatics</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Master EHR systems, medical coding, telemedicine platforms, and healthcare IT infrastructure for the digital health era.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
                    Electronic Health Records
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
                    Medical Coding & Billing
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
                    Telemedicine Systems
                  </li>
                </ul>
                <Link 
                  href="/register"
                  className="inline-flex items-center text-blue-600 font-semibold hover:gap-2 transition-all group/link"
                >
                  Explore Healthcare
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Agriculture */}
            <div className="group relative bg-white rounded-2xl border-2 border-green-100 hover:border-green-300 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Agricultural Technology</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Develop expertise in precision agriculture, IoT sensors, crop monitoring systems, and sustainable farming practices.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Precision Agriculture
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    IoT & Sensor Networks
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    Sustainable Farming
                  </li>
                </ul>
                <Link 
                  href="/register"
                  className="inline-flex items-center text-green-600 font-semibold hover:gap-2 transition-all group/link"
                >
                  Explore Agriculture
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Urban */}
            <div className="group relative bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Urban & Smart Cities</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Build skills in GIS systems, smart infrastructure, sustainable urban design, and modern city planning technologies.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    GIS & Mapping Systems
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    Smart Infrastructure
                  </li>
                  <li className="flex items-center text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 mr-2" />
                    Urban Planning Tech
                  </li>
                </ul>
                <Link 
                  href="/register"
                  className="inline-flex items-center text-purple-600 font-semibold hover:gap-2 transition-all group/link"
                >
                  Explore Urban Tech
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and begin your journey to professional excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Create Your Profile</h3>
              <p className="text-slate-600 leading-relaxed">
                Sign up and set up your professional profile with your current skills and career goals
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Track Your Skills</h3>
              <p className="text-slate-600 leading-relaxed">
                Add skills, certifications, and projects. Get AI-powered assessments and gap analysis
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Grow Your Career</h3>
              <p className="text-slate-600 leading-relaxed">
                Follow personalized learning paths and watch your career readiness score improve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100">
              Join thousands of professionals mastering their skills with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                href="/register"
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started Now - It&apos;s Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
