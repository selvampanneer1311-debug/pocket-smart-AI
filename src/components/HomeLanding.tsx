import React from 'react';
import { AppTab } from '../types';
import {
  Home,
  PartyPopper,
  Gem,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Layers,
  CheckCircle2,
  Quote
} from 'lucide-react';

interface HomeLandingProps {
  onNavigate: (tab: AppTab) => void;
  onOpenAuth: (isRegister: boolean) => void;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 border-b border-slate-800 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Next-Gen Budgeting with Gemini 3.8 Flash
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            PocketSmart
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent mt-2">
              AI-Powered Budget Planning for Everyday Needs
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Make smarter financial decisions with personalized budget recommendations for{' '}
            <span className="text-white font-medium">home interiors</span>,{' '}
            <span className="text-white font-medium">parties</span>, and{' '}
            <span className="text-white font-medium">jewelry purchases</span>. Our AI helps you get the most value for your money with direct shopping links.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:gap-3 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#planners"
              className="px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Quick value props pill bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-Platform Sourcing (Amazon, IKEA, Swiggy, Tanishq)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Visual Multimodal Outfit Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Overspending Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Budget Planners Section (Matches Page 27) */}
      <section id="planners" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">Our Smart Budget Planners</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Discover how PocketSmart helps you make better financial decisions across different areas of your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior Planner */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-7 flex flex-col justify-between hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Home Interior Budget Planner</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Get personalized recommendations for furniture, lighting, and decor that fit your style preferences and budget constraints. Our AI helps you create a beautiful space without overspending.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Lighting</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Ceiling Fans</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">IKEA & Amazon</span>
              </div>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('home-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Party Budget Planner */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-7 flex flex-col justify-between hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <PartyPopper className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Party Budget Planner</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Plan your perfect event with smart budget allocations for venue, catering, decorations, and entertainment. Our AI suggests the best ways to create memorable events while staying within your budget.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Venue & OYO</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Swiggy & Zomato</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Decor & Music</span>
              </div>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('party-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Jewelry Budget Planner */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-7 flex flex-col justify-between hover:border-pink-500/60 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                <Gem className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Jewelry Budget Planner</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Find the ideal jewelry pieces for any occasion that match your outfit and budget. Our AI analyzes your outfit photo, color harmonies, and recommends options based on style preferences and occasion.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Photo Analysis</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Tanishq & CaratLane</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700">Styling Tips</span>
              </div>
            </div>
            <div className="pt-8">
              <button
                onClick={() => onNavigate('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Matches Page 28) */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">What Our Users Say</h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Real experiences from people who have transformed their financial planning with PocketSmart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 relative flex flex-col justify-between shadow-lg">
              <Quote className="w-8 h-8 text-blue-500/20 absolute top-5 right-5" />
              <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                "PocketSmart helped me furnish my new apartment without breaking the bank. The recommendations were spot on and I saved nearly 30% of my original budget!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow">
                  SK
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Sarah K.</h4>
                  <p className="text-xs text-slate-400">Home Owner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 relative flex flex-col justify-between shadow-lg">
              <Quote className="w-8 h-8 text-amber-500/20 absolute top-5 right-5" />
              <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                "Planning my daughter's birthday party was so much easier with PocketSmart's budget breakdown. The AI suggestions for affordable decorations and catering options were fantastic."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white text-sm shadow">
                  MR
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Michael R.</h4>
                  <p className="text-xs text-slate-400">Parent</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 relative flex flex-col justify-between shadow-lg">
              <Quote className="w-8 h-8 text-pink-500/20 absolute top-5 right-5" />
              <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                "The jewelry recommendations perfectly matched my outfit for the wedding. Saved me hours of searching and I received so many compliments on my accessories!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm shadow">
                  PM
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Priya M.</h4>
                  <p className="text-xs text-slate-400">Fashion Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Matches Page 28) */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-slate-900/90 rounded-3xl border border-blue-500/30 p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Optimize Your Budget?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join PocketSmart today and start making smarter financial decisions across all areas of your life.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth(true)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
