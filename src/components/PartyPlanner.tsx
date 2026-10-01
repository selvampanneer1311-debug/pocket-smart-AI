import React, { useState } from 'react';
import { PartyPlanResult } from '../types';
import { generatePartyPlan } from '../services/api';
import {
  PartyPopper,
  Sparkles,
  Printer,
  Bookmark,
  Check,
  RotateCcw,
  ExternalLink,
  Users,
  MapPin,
  Utensils,
  Music,
  Camera,
  Layers,
  HeartHandshake,
  DollarSign
} from 'lucide-react';

interface PartyPlannerProps {
  currency: string;
  onSaveToHistory: (plan: {
    type: 'party';
    total_budget: number;
    currency: string;
    remaining_budget: number;
    input_summary: string;
    summary: string;
    full_result: PartyPlanResult;
  }) => void;
  onPrint: (title: string, content: any) => void;
  initialResult?: PartyPlanResult | null;
}

export const PartyPlanner: React.FC<PartyPlannerProps> = ({
  currency,
  onSaveToHistory,
  onPrint,
  initialResult
}) => {
  // Form states
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [numGuests, setNumGuests] = useState<number>(3);
  const [partyType, setPartyType] = useState<string>('Wedding');
  const [venueType, setVenueType] = useState<string>('Home');
  const [needsCatering, setNeedsCatering] = useState<boolean>(true);
  const [needsDecoration, setNeedsDecoration] = useState<boolean>(true);
  const [needsEntertainment, setNeedsEntertainment] = useState<boolean>(true);
  const [needsPhotography, setNeedsPhotography] = useState<boolean>(false);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>(
    'Intimate celebration, warm ambient lighting, finger foods, and interactive board games.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PartyPlanResult | null>(initialResult || null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const partyTypes = [
    'Wedding',
    'Birthday',
    'Anniversary',
    'House Party',
    'Corporate Mixer',
    'Dinner Party',
    'Festival / Diwali'
  ];

  const venueTypes = [
    'Home',
    'Banquet Hall',
    'Rooftop Cafe',
    'Outdoor Lawn',
    'Resort / Farmhouse',
    'Club / Lounge'
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (totalBudget <= 0) {
      setError('Please enter a valid budget');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const plan = await generatePartyPlan({
        total_budget: totalBudget,
        currency,
        num_guests: numGuests,
        party_type: partyType,
        venue_type: venueType,
        needs_catering: needsCatering,
        needs_decoration: needsDecoration,
        needs_entertainment: needsEntertainment,
        needs_photography: needsPhotography,
        additional_requirements: additionalRequirements
      });
      setResult(plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate party budget plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToHistory({
      type: 'party',
      total_budget: result.total_budget,
      currency: result.currency || currency,
      remaining_budget: result.remaining_budget,
      input_summary: `${partyType} (${numGuests} Guests, Venue: ${venueType})`,
      summary: `Allocated plan across Catering, Venue, Decoration, Entertainment & Contingency.`,
      full_result: result
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header (Matches Page 34) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <PartyPopper className="w-3.5 h-3.5" /> Scenario 2
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Party Budget Planner
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Plan your perfect event with AI-powered budget recommendations across food, decor, and venues
          </p>
        </div>

        {!result || isLoading ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 1. Basic Information (Page 34) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Basic Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[3000, 5000, 10000, 20000, 50000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTotalBudget(preset)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          totalBudget === preset
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {currency} {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="1"
                      max="500"
                      required
                      value={numGuests}
                      onChange={(e) => setNumGuests(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base focus:border-amber-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[3, 10, 25, 50, 100].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setNumGuests(g)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          numGuests === g
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g} guests
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Event Details (Page 34) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <PartyPopper className="w-5 h-5 text-amber-400" />
                Event Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Party Type</label>
                  <select
                    value={partyType}
                    onChange={(e) => setPartyType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-amber-500 outline-none"
                  >
                    {partyTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Venue Type</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-amber-500 outline-none"
                  >
                    {venueTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Party Needs (Page 34) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <Utensils className="w-5 h-5 text-amber-400" />
                Party Needs
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setNeedsCatering(!needsCatering)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    needsCatering
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Utensils className="w-5 h-5" />
                  <span className="text-xs font-medium">Catering</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedsDecoration(!needsDecoration)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    needsDecoration
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-medium">Decoration</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedsEntertainment(!needsEntertainment)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    needsEntertainment
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Music className="w-5 h-5" />
                  <span className="text-xs font-medium">Entertainment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedsPhotography(!needsPhotography)}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    needsPhotography
                      ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-xs font-medium">Photography</span>
                </button>
              </div>
            </div>

            {/* 4. Additional Requirements (Page 34) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                Additional Requirements
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Special requests, themes, dietary restrictions, etc.
                </label>
                <textarea
                  rows={3}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Special requests, themes, vegetarian dietary restrictions, background music preference..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 outline-none"
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
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white font-semibold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Optimizing Party Budget with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Budget Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Results View (Matches Page 35) */
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
                  onClick={() => onPrint('Party Budget Plan', result)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print/Save</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Saved to History!' : 'Save Plan'}</span>
                </button>
              </div>
            </div>

            {/* Plan Header Card (Page 35) */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-800/90 to-slate-800/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Party Budget Plan</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Event: {partyType} • Guests: {numGuests} • Venue: {venueType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">
                    Total Budget
                  </p>
                  <p className="text-3xl font-extrabold text-amber-400">
                    {result.currency || currency} {result.total_budget?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Items Breakdown (Page 35) */}
            <div className="space-y-4">
              {result.budget_breakdown?.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 p-5 shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <div className="flex items-center gap-2 font-bold text-white text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span>{cat.category}</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-300">
                      {result.currency || currency} {cat.allocation?.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cat.items?.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                            {item.quantity > 1 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                Qty: {item.quantity}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                            {item.description}
                          </p>

                          {/* Shopping & booking links as required by PDF page 15 */}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[11px] text-slate-400 font-medium">Shop on:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.shopping_links &&
                                Object.entries(item.shopping_links).map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-700 hover:border-amber-500 transition-colors"
                                  >
                                    <span>{platform}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                  </a>
                                ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <span className="text-sm font-bold text-emerald-400">
                            {result.currency || currency} {item.estimated_price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Calculation Summary (Page 35) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Budget Allocation Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/60">
                  <p className="text-xs text-slate-400">Total Budget</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {result.currency || currency} {result.total_budget?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/60">
                  <p className="text-xs text-slate-400">Allocated</p>
                  <p className="text-xl font-bold text-amber-400 mt-1">
                    {result.currency || currency}{' '}
                    {(result.total_budget - (result.remaining_budget || 0)).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/60">
                  <p className="text-xs text-slate-400">Remaining</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    {result.currency || currency} {(result.remaining_budget || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Suggestions (Page 35) */}
            {result.venue_suggestions && result.venue_suggestions.length > 0 && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Venue Suggestions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.venue_suggestions.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">{v.name}</h4>
                        <span className="text-xs font-bold text-emerald-400">
                          {result.currency || currency} {v.estimated_cost?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Type: {v.type} • Capacity: {v.capacity} guests
                      </p>
                      {v.shopping_links && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {Object.entries(v.shopping_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                            >
                              <span>{platform}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Suggestions List (Page 35) */}
            {result.additional_suggestions && result.additional_suggestions.length > 0 && (
              <div className="bg-slate-800/90 rounded-2xl border border-amber-500/20 p-6 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Additional Event Suggestions
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {result.additional_suggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
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
