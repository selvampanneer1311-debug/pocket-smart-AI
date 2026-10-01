import React from 'react';
import { AppTab, User } from '../types';
import {
  Wallet,
  Sparkles,
  Home,
  PartyPopper,
  Gem,
  History,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onNavigate: (tab: AppTab) => void;
  user: User;
  onLogout: () => void;
  onOpenAuth: (isRegister: boolean) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  user,
  onLogout,
  onOpenAuth,
  currency,
  onCurrencyChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard' as AppTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home-planner' as AppTab, label: 'Home Planner', icon: Home },
    { id: 'party-planner' as AppTab, label: 'Party Planner', icon: PartyPopper },
    { id: 'jewelry-planner' as AppTab, label: 'Jewelry Planner', icon: Gem },
    { id: 'history' as AppTab, label: 'History', icon: History }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate(user.isLoggedIn ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-white">
                <span>PocketSmart</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-400" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal hidden sm:block">
                Smart Budget & Recommendations
              </p>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Currency + User Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onCurrencyChange('₹')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  currency === '₹' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Indian Rupee (INR)"
              >
                ₹ INR
              </button>
              <button
                onClick={() => onCurrencyChange('$')}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  currency === '$' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="US Dollar (USD)"
              >
                $ USD
              </button>
            </div>

            {user.isLoggedIn ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200">{user.username}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth(false)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth(true)}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onCurrencyChange(currency === '₹' ? '$' : '₹')}
              className="px-2 py-1 text-xs bg-slate-800 rounded border border-slate-700 text-slate-200"
            >
              {currency}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user.isLoggedIn ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200">Hi, {user.username}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => {
                    onOpenAuth(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-slate-800 text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-blue-600 text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
