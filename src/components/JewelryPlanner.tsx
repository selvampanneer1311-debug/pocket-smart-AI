import React, { useState, useRef } from 'react';
import { JewelryPlanResult } from '../types';
import { generateJewelryPlan } from '../services/api';
import {
  Gem,
  Sparkles,
  Printer,
  Bookmark,
  Check,
  RotateCcw,
  ExternalLink,
  Upload,
  X,
  Palette,
  Watch,
  CircleDot,
  Smile,
  DollarSign
} from 'lucide-react';

interface JewelryPlannerProps {
  currency: string;
  onSaveToHistory: (plan: {
    type: 'jewelry';
    total_budget: number;
    currency: string;
    remaining_budget: number;
    input_summary: string;
    summary: string;
    full_result: JewelryPlanResult;
  }) => void;
  onPrint: (title: string, content: any) => void;
  initialResult?: JewelryPlanResult | null;
}

// Sample presets matching real use cases including the blue shirt from PDF page 36
const OUTFIT_PRESETS = [
  {
    name: 'Blue Casual Shirt & Chinos',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    description: 'Casual blue shirt with neutral pants, smart everyday look'
  },
  {
    name: 'Festive Silk Saree / Lehenga',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    description: 'Traditional gold & crimson silk attire with intricate zari work'
  },
  {
    name: 'Black Cocktail Evening Dress',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
    description: 'Elegant monochrome black gown with clean neckline'
  },
  {
    name: 'Modern Pastel Kurta / Linen',
    image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=400&q=80',
    description: 'Subtle ivory & mint pastel ethnic linen blend'
  }
];

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({
  currency,
  onSaveToHistory,
  onPrint,
  initialResult
}) => {
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [occasion, setOccasion] = useState<string>('Birthday');
  const [preferences, setPreferences] = useState<string>(
    'Casual, minimalist silver and leather accents'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(OUTFIT_PRESETS[0].image);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JewelryPlanResult | null>(initialResult || null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const occasions = [
    'Birthday',
    'Wedding / Reception',
    'Festival (Diwali / Eid)',
    'Date Night',
    'Casual Outing',
    'Corporate / Formal',
    'Anniversary'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof OUTFIT_PRESETS[0]) => {
    setImagePreview(preset.image);
    setImageBase64(null); // Backend will recognize the description
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      const plan = await generateJewelryPlan({
        total_budget: totalBudget,
        currency,
        occasion,
        preferences: `${preferences}${imagePreview ? ' [Outfit image provided]' : ''}`,
        image_base64: imageBase64
      });
      setResult(plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate jewelry recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToHistory({
      type: 'jewelry',
      total_budget: result.total_budget,
      currency: result.currency || currency,
      remaining_budget: result.remaining_budget,
      input_summary: `${occasion} (${result.jewelry_recommendations.length} Pieces${
        imagePreview ? ', with outfit photo' : ''
      })`,
      summary: `Style-matched jewelry set for ${occasion} with ${result.jewelry_recommendations
        .map((j) => j.item_type)
        .join(', ')}.`,
      full_result: result
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header (Matches Page 36) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
            <Gem className="w-3.5 h-3.5" /> Scenario 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Jewelry Budget Planner
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Get AI-powered jewelry recommendations within your budget for any occasion with multimodal outfit matching
          </p>
        </div>

        {!result || isLoading ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 1. Budget Details (Page 36) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <DollarSign className="w-5 h-5 text-pink-400" />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base focus:border-pink-500 outline-none"
                    placeholder="5000"
                  />
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[2000, 5000, 10000, 25000, 50000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalBudget(preset)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        totalBudget === preset
                          ? 'bg-pink-600 border-pink-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {currency} {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Occasion & Preferences (Page 36) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700/60 text-white font-bold text-base">
                <Palette className="w-5 h-5 text-pink-400" />
                Occasion & Preferences
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-pink-500 outline-none"
                  >
                    {occasions.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Style Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="Describe your style preferences, materials (silver, gold, titanium), colors, etc."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-pink-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Upload Outfit Image (Page 36) */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2.5 text-white font-bold text-base">
                  <Upload className="w-5 h-5 text-pink-400" />
                  Upload Outfit Image (Optional Multimodal Analysis)
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                  >
                    <X className="w-3.5 h-3.5" /> Remove Image
                  </button>
                )}
              </div>

              {/* Ready Preset Outfits */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Or pick a sample outfit to test multimodal AI:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {OUTFIT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                        imagePreview === preset.image
                          ? 'border-pink-500 bg-pink-500/10 shadow-sm'
                          : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                      }`}
                    >
                      <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-950">
                        <img
                          src={preset.image}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-white truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Drop Area */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-72 flex items-center justify-center p-2">
                    <img
                      src={imagePreview}
                      alt="Outfit Preview"
                      className="max-h-64 object-contain rounded-xl"
                    />
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Outfit Image Ready for AI Styling
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-800/40 transition-all space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Click or drag to upload your outfit image
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Gemini AI will extract color undertones, fabric formality, and silhouette to curate matching jewelry
                      </p>
                    </div>
                  </div>
                )}
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
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:bg-pink-800 text-white font-semibold text-sm shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Curating Jewelry with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Gem className="w-4 h-4 text-white" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Results View (Matches Page 37) */
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
                  onClick={() => onPrint('Jewelry Budget Recommendations', result)}
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
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-600/20'
                  }`}
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Saved to History!' : 'Save Plan'}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-white">
              Your Personalized Jewelry Recommendations
            </h2>

            {/* Budget Summary (Page 37) */}
            <div className="bg-gradient-to-r from-pink-950/40 via-slate-800/90 to-slate-800/90 rounded-2xl border border-pink-500/30 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-base mb-4">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 flex items-center justify-center text-xs">
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
                    {result.currency || currency} {(result.remaining_budget || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Curated Pieces</p>
                  <p className="text-2xl font-extrabold text-pink-400 mt-1">
                    {result.jewelry_recommendations?.length || 3} items
                  </p>
                </div>
              </div>
            </div>

            {/* Outfit Analysis Card (Matches Page 37) */}
            {result.outfit_analysis && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-lg space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-base pb-2 border-b border-slate-700/60">
                  <Palette className="w-5 h-5 text-pink-400" />
                  Outfit Analysis
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Detected Colors
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {result.outfit_analysis.colors?.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Style Profile
                    </span>
                    <p className="text-sm font-semibold text-white pt-1">
                      {result.outfit_analysis.style || 'Casual Chic'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Formality
                    </span>
                    <p className="text-sm font-semibold text-white pt-1">
                      {result.outfit_analysis.formality || 'Smart Informal'}
                    </p>
                  </div>
                </div>

                {result.outfit_analysis.notes && (
                  <p className="text-xs text-slate-300 italic pt-2 border-t border-slate-700/60 leading-relaxed">
                    💡 {result.outfit_analysis.notes}
                  </p>
                )}
              </div>
            )}

            {/* Jewelry Recommendations List (Page 37) */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gem className="w-4 h-4 text-pink-400" />
                Jewelry Recommendations
              </h3>

              {result.jewelry_recommendations?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-md space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                      <h4 className="text-base font-bold text-white capitalize">
                        {item.item_type || item.name}
                      </h4>
                      {item.style && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          Style: {item.style}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-emerald-400">
                      {result.currency || currency} {item.estimated_price?.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Shopping Links for This Item (Page 37) */}
                  <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Shop For This:
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.shopping_links &&
                        Object.entries(item.shopping_links).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white border border-slate-700 hover:border-pink-500 transition-colors"
                          >
                            <span>{platform}</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Styling Tips Card (Page 37) */}
            {result.styling_tips && result.styling_tips.length > 0 && (
              <div className="bg-slate-800/90 rounded-2xl border border-pink-500/20 p-6 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Styling Tips & Coordination
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {result.styling_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0"></div>
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
