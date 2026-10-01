import React from 'react';
import { AppTab } from '../types';
import { Wallet, Sparkles, Twitter, Facebook, Linkedin, Instagram, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">PocketSmart</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-semibold border border-blue-400/30 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              AI-powered budget planning tools to help you make smarter financial decisions across home interiors, parties, and jewelry shopping. Powered by Google Gemini GenAI.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#twitter" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-blue-400 hover:border-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-blue-500 hover:border-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-blue-400 hover:border-blue-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-pink-400 hover:border-pink-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#github" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-500 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">About Us</button></li>
              <li><a href="#features" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('home-planner')} className="hover:text-white transition-colors">Home Planner</button></li>
              <li><button onClick={() => onNavigate('party-planner')} className="hover:text-white transition-colors">Party Planner</button></li>
              <li><button onClick={() => onNavigate('jewelry-planner')} className="hover:text-white transition-colors">Jewelry Planner</button></li>
              <li><button onClick={() => onNavigate('history')} className="hover:text-white transition-colors">History & Reports</button></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Legal & Help</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ & Support</a></li>
              <li><a href="#cookie" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 PocketSmart AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini GenAI Engine Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
