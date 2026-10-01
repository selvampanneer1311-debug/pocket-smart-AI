import React from 'react';
import { AppTab, HistoryRecord, User } from '../types';
import {
  Home,
  PartyPopper,
  Gem,
  History,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (tab: AppTab) => void;
  recentHistory: HistoryRecord[];
  onSelectHistoryItem: (record: HistoryRecord) => void;
  currency: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onNavigate,
  recentHistory,
  onSelectHistoryItem,
  currency
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Welcome Banner (Matches Page 31) */}
        <div className="text-center space-y-3 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> PocketSmart Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {user.username || 'sai'}!
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Choose a budget planner to get started with your personalized financial planning experience
          </p>
        </div>

        {/* 3 Planner Cards (Matches Page 31 layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Home Budget Planner */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
            <div className="p-6 space-y-4">
              <div className="h-44 w-full rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 to-blue-950 flex items-center justify-center relative border border-slate-700/60 group-hover:scale-[1.02] transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                  alt="Home interior decor"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-blue-600 shadow-md">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm drop-shadow">Interior Design</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-400" />
                  Home Budget Planner
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Plan your interior design budget efficiently with AI-powered recommendations for furniture, lighting, and more.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('home-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Party Budget Planner */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 transition-all group">
            <div className="p-6 space-y-4">
              <div className="h-44 w-full rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 to-amber-950 flex items-center justify-center relative border border-slate-700/60 group-hover:scale-[1.02] transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
                  alt="Party balloons and festive celebration"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-amber-600 shadow-md">
                    <PartyPopper className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm drop-shadow">Celebrations</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-amber-400" />
                  Party Budget Planner
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Plan your perfect event with budget allocations for venue, catering, decorations, and entertainment.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('party-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-600/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Jewelry Budget Planner */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/10 transition-all group">
            <div className="p-6 space-y-4">
              <div className="h-44 w-full rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 to-pink-950 flex items-center justify-center relative border border-slate-700/60 group-hover:scale-[1.02] transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                  alt="Jewelry pearls and gold accessories"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-pink-600 shadow-md">
                    <Gem className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm drop-shadow">Jewelry & Style</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gem className="w-5 h-5 text-pink-400" />
                  Jewelry Budget Planner
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Find the ideal jewelry pieces for any occasion that match your outfit and stay within your budget.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-pink-600/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View All History Big Button (Matches Page 31) */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => onNavigate('history')}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <History className="w-4 h-4" />
            <span>View All Recommendation History</span>
          </button>
        </div>

        {/* Recent Activity Section (Matches Page 31 bottom) */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Recent Activity</h2>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              See all ({recentHistory.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-700/60">
            {recentHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No recommendation history yet. Choose a planner above to create your first budget plan!
              </div>
            ) : (
              recentHistory.slice(0, 3).map((item) => {
                const isHome = item.type === 'home';
                const isParty = item.type === 'party';
                const Icon = isHome ? Home : isParty ? PartyPopper : Gem;
                const iconColor = isHome
                  ? 'text-blue-400 bg-blue-500/15'
                  : isParty
                  ? 'text-amber-400 bg-amber-500/15'
                  : 'text-pink-400 bg-pink-500/15';

                const title =
                  item.type === 'home'
                    ? 'Home Budget Plan'
                    : item.type === 'party'
                    ? 'Party Budget Plan'
                    : 'Jewelry Budget Plan';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item)}
                    className="p-5 flex items-center justify-between hover:bg-slate-750/50 hover:bg-slate-700/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Budget: {item.currency} {item.total_budget?.toLocaleString()} • Created on{' '}
                          {new Date(item.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-md mt-0.5 hidden sm:block">
                          {item.input_summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                        Rem: {item.currency} {item.remaining_budget?.toLocaleString()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
