import React, { useState } from 'react';
import { HistoryRecord, AppTab } from '../types';
import {
  History,
  Home,
  PartyPopper,
  Gem,
  Calendar,
  DollarSign,
  Trash2,
  ExternalLink,
  Printer,
  X,
  ArrowRight,
  Filter
} from 'lucide-react';

interface HistoryPageProps {
  history: HistoryRecord[];
  onDeleteHistory: (id: string) => void;
  onNavigate: (tab: AppTab) => void;
  onOpenPrint: (title: string, data: any) => void;
  onLoadPlanIntoPlanner: (record: HistoryRecord) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onDeleteHistory,
  onNavigate,
  onOpenPrint,
  onLoadPlanIntoPlanner
}) => {
  const [filterType, setFilterType] = useState<'all' | 'home' | 'party' | 'jewelry'>('all');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header (Matches Page 38) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <History className="w-3.5 h-3.5" /> Recommendation Archive
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Recommendation History
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            View and manage all your previous budget plans and recommendations
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 rounded-2xl border border-slate-700 p-3 shadow-md">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Filter by Planner:
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilterType('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                filterType === 'home'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-blue-400" />
              <span>Home Interior</span>
            </button>
            <button
              onClick={() => setFilterType('party')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                filterType === 'party'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Party Planning</span>
            </button>
            <button
              onClick={() => setFilterType('jewelry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                filterType === 'jewelry'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-pink-400" />
              <span>Jewelry Budget</span>
            </button>
          </div>
        </div>

        {/* History Cards Grid (Matches Page 38 style) */}
        {filteredHistory.length === 0 ? (
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No plans found</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                No past recommendations in this category. Generate a new budget plan to see it saved here!
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('home-planner')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Launch Home Planner
              </button>
              <button
                onClick={() => onNavigate('party-planner')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Launch Party Planner
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHistory.map((item) => {
              const isHome = item.type === 'home';
              const isParty = item.type === 'party';
              const isJewelry = item.type === 'jewelry';

              const Icon = isHome ? Home : isParty ? PartyPopper : Gem;
              const borderAccent = isHome
                ? 'border-t-4 border-t-emerald-500'
                : isParty
                ? 'border-t-4 border-t-amber-500'
                : 'border-t-4 border-t-pink-500';

              const categoryBadgeColor = isHome
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : isParty
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-pink-500/10 text-pink-400 border-pink-500/30';

              const title = isHome
                ? 'Home Interior Budget'
                : isParty
                ? 'Party Planning Budget'
                : 'Jewelry Budget';

              return (
                <div
                  key={item.id}
                  className={`bg-slate-800/90 rounded-2xl border border-slate-700 ${borderAccent} p-6 flex flex-col justify-between hover:shadow-xl transition-all shadow-md group`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${categoryBadgeColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">{title}</h3>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(item.id);
                        }}
                        title="Delete record"
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Budget & Remaining Numbers */}
                    <div className="grid grid-cols-2 gap-3 pt-2 pb-2 border-y border-slate-700/60">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          Total Budget
                        </span>
                        <p className="text-lg font-extrabold text-white">
                          {item.currency} {item.total_budget?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          Remaining
                        </span>
                        <p className="text-lg font-extrabold text-emerald-400">
                          {item.currency} {item.remaining_budget?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Summary Context */}
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                        {item.input_summary}
                      </p>

                      {/* Pill tags matching Page 38 */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {isHome && (
                          <>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Lighting
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Ceiling Fans
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Furniture
                            </span>
                          </>
                        )}
                        {isParty && (
                          <>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Venue
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Catering
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Entertainment
                            </span>
                          </>
                        )}
                        {isJewelry && (
                          <>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Bracelet
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Ring
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              Watch
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Page 38: View Full Details) */}
                  <div className="pt-6">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
                  {selectedRecord.type === 'home'
                    ? 'Home Interior Plan'
                    : selectedRecord.type === 'party'
                    ? 'Party Event Plan'
                    : 'Jewelry Styling Plan'}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedRecord.input_summary}</h3>
                <p className="text-xs text-slate-400">
                  Created on {new Date(selectedRecord.timestamp).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Budget Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div>
                <p className="text-xs text-slate-400">Total Budget</p>
                <p className="text-xl font-bold text-white mt-1">
                  {selectedRecord.currency} {selectedRecord.total_budget?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Remaining Budget</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {selectedRecord.currency} {selectedRecord.remaining_budget?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Platform</p>
                <p className="text-xl font-bold text-blue-300 mt-1">PocketSmart AI</p>
              </div>
            </div>

            {/* Content summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Plan Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                {selectedRecord.summary}
              </p>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onOpenPrint(
                    `${selectedRecord.type.toUpperCase()} Budget Report`,
                    selectedRecord.full_result
                  );
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Plan</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onLoadPlanIntoPlanner(selectedRecord);
                    setSelectedRecord(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Load into Planner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
