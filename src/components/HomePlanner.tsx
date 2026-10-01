import React, { useState } from 'react';
import { HomePlanResult } from '../types';
import { generateHomePlan } from '../services/api';
import {
  Home,
  Sparkles,
  Printer,
  Bookmark,
  Check,
  RotateCcw,
  ExternalLink,
  Lightbulb,
  Fan,
  Armchair,
  UtensilsCrossed,
  Layers,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface HomePlannerProps {
  currency: string;
  onSaveToHistory: (plan: {
    type: 'home';
    total_budget: number;
    currency: string;
    remaining_budget: number;
    input_summary: string;
    summary: string;
    full_result: HomePlanResult;
  }) => void;
  onPrint: (title: string, content: any) => void;
  initialResult?: HomePlanResult | null;
}

export const HomePlanner: React.FC<HomePlannerProps> = ({
  currency,
  onSaveToHistory,
  onPrint,
  initialResult
}) => {
  // Form states
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [numLights, setNumLights] = useState<number>(5);
  const [numFans, setNumFans] = useState<number>(4);
  const [numFurniture, setNumFurniture] = useState<number>(2);
  const [numDiningTables, setNumDiningTables] = useState<number>(1);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room', 'Kitchen']);
  const [additionalPrefs, setAdditionalPrefs] = useState<string>(
    'Modern functional aesthetic, warm ambient lighting, durable furniture.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HomePlanResult | null>(initialResult || null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const availableRooms = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Balcony / Dining'];

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (totalBudget <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const plan = await generateHomePlan({
        total_budget: totalBudget,
        currency,
        num_lights: numLights,
        num_fans: numFans,
        num_furniture: numFurniture,
        num_dining_tables: numDiningTables,
        rooms: selectedRooms,
        additional_requirements: additionalPrefs
      });
      setResult(plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToHistory({
      type: 'home',
      total_budget: result.total_budget,
      currency: result.currency || currency,
      remaining_budget: result.remaining_budget,
      input_summary: `${selectedRooms.join(', ')} (${numLights} Lights, ${numFans} Fans, ${numFurniture} Furniture, ${numDiningTables} Table)`,
      summary: `Interior decor plan with ${result.budget_breakdown.length} categories and direct store links.`,
      full_result: result
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header (Matches Page 32) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Home className="w-3.5 h-3.5" /> Scenario 1
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Home Interior Budget Planner
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Create a customized budget plan for your dream home interior with smart product sourcing
          </p>
        </div>

        {/* If no result or user toggles back to edit, show the Form (Page 32) */}
        {!result || isLoading ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 1. Budget Details */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs">
                  {currency}
                </span>
                Budget Details
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Total Budget ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                    placeholder="5000"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[2000, 5000, 10000, 25000, 50000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalBudget(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        totalBudget === preset
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {currency} {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Fixtures & Furniture (Page 32) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Fixtures & Furniture
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-400" /> Number of Lights / Fixtures
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={numLights}
                    onChange={(e) => setNumLights(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Fan className="w-3.5 h-3.5 text-blue-400" /> Number of Ceiling Fans
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={numFans}
                    onChange={(e) => setNumFans(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <Armchair className="w-3.5 h-3.5 text-blue-400" /> Number of Furniture Pieces
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={numFurniture}
                    onChange={(e) => setNumFurniture(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-blue-400" /> Number of Dining Tables
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={numDiningTables}
                    onChange={(e) => setNumDiningTables(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Rooms to Include (Page 32) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <Layers className="w-5 h-5 text-indigo-400" />
                Rooms to Include
              </div>

              <div className="flex flex-wrap gap-3">
                {availableRooms.map((room) => {
                  const isChecked = selectedRooms.includes(room);
                  return (
                    <button
                      key={room}
                      type="button"
                      onClick={() => toggleRoom(room)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-blue-600 border-blue-500' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span>{room}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Additional Information (Page 32) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <Info className="w-5 h-5 text-emerald-400" />
                Additional Information
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Special Requirements or Preferences
                </label>
                <textarea
                  rows={3}
                  value={additionalPrefs}
                  onChange={(e) => setAdditionalPrefs(e.target.value)}
                  placeholder="Any specific requirements or preferences like colors, wood type, modern or traditional style..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Budget with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Results View (Matches Page 33) */
          <div className="space-y-8 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/90 rounded-2xl border border-slate-700 p-4 shadow-md">
              <button
                onClick={() => setResult(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Inputs</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrint('Home Interior Budget Plan', result)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Saved to History!' : 'Save Plan'}</span>
                </button>
              </div>
            </div>

            {/* Header Title */}
            <h2 className="text-2xl font-bold text-center text-white">
              Your Personalized Budget Plan
            </h2>

            {/* Budget Summary Card (Page 33) */}
            <div className="bg-gradient-to-r from-blue-900/60 to-slate-800/90 rounded-2xl border border-blue-500/30 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-base mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-xs">
                  {result.currency || currency}
                </span>
                Budget Summary
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-400">Total Budget</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    {result.currency || currency} {result.total_budget?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Remaining Budget</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {result.currency || currency} {result.remaining_budget?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Budget Utilization</p>
                  <p className="text-2xl font-extrabold text-blue-300 mt-1">
                    {Math.round(
                      (((result.total_budget - (result.remaining_budget || 0)) / result.total_budget) *
                        100) || 100
                    )}%
                  </p>
                </div>
              </div>
            </div>

            {/* Category Breakdown Cards (Page 33) */}
            <div className="space-y-6">
              {result.budget_breakdown?.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      {cat.category.toLowerCase().includes('light') ? (
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                      ) : cat.category.toLowerCase().includes('fan') ? (
                        <Fan className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Armchair className="w-5 h-5 text-indigo-400" />
                      )}
                      <h3 className="text-lg font-bold text-white">{cat.category}</h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                      Allocation: {result.currency || currency} {cat.allocation?.toLocaleString()}
                    </span>
                  </div>

                  {/* Items List Table (Page 33) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/60 uppercase font-semibold text-slate-400 border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3">Price</th>
                          <th className="py-2.5 px-3">Quantity</th>
                          <th className="py-2.5 px-3">Shopping Links</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {cat.items?.map((item, itemIdx) => (
                          <tr key={itemIdx} className="hover:bg-slate-750/30">
                            <td className="py-3 px-3 font-semibold text-white max-w-[180px]">
                              {item.name}
                            </td>
                            <td className="py-3 px-3 text-slate-300 max-w-[260px] leading-relaxed">
                              {item.description}
                            </td>
                            <td className="py-3 px-3 font-medium text-emerald-400 whitespace-nowrap">
                              {result.currency || currency} {item.estimated_price?.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-slate-300 whitespace-nowrap font-medium">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap gap-1.5 min-w-[200px]">
                                {item.shopping_links &&
                                  Object.entries(item.shopping_links).map(([platform, url]) => (
                                    <a
                                      key={platform}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500 transition-colors"
                                    >
                                      <span>{platform}</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                    </a>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation Table (as shown in OCR Page 12) */}
            {result.calculation_table && result.calculation_table.length > 0 && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Category Budget Breakdown Table
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900/60 uppercase font-semibold text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Items Count</th>
                        <th className="py-2.5 px-3">Total Cost</th>
                        <th className="py-2.5 px-3">% of Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {result.calculation_table.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-semibold text-white">{row.category}</td>
                          <td className="py-2.5 px-3">{row.items_count}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-medium">
                            {result.currency || currency} {row.total_cost?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${Math.min(100, row.percentage_of_budget)}%` }}
                                ></div>
                              </div>
                              <span>{row.percentage_of_budget}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Additional Suggestions Box (Page 33) */}
            {result.additional_suggestions && result.additional_suggestions.length > 0 && (
              <div className="bg-slate-800/90 rounded-2xl border border-blue-500/20 p-6 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Additional Suggestions & Cost-Saving Tips
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {result.additional_suggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
