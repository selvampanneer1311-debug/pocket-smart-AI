import React from 'react';
import { Printer, X, Download, Wallet, Sparkles } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  title,
  data
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    const textData = JSON.stringify(data, null, 2);
    const blob = new Blob([textData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_budget_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Print / Save Budget Report</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div
          id="printable-report"
          className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl space-y-8 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  PS
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  PocketSmart AI
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your Smart Budget & Recommendation Assistant
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Official Budget Report
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>
          </div>

          {/* Title & Overview Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                AI Sourcing: Amazon, Flipkart, IKEA, Swiggy, Zomato, Tanishq
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400">Total Budget</p>
                <p className="text-xl font-black text-slate-900">
                  {data.currency || '₹'} {data.total_budget?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-400">Remaining</p>
                <p className="text-xl font-black text-emerald-600">
                  {data.currency || '₹'} {(data.remaining_budget || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Outfit Analysis if Jewelry */}
          {data.outfit_analysis && (
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-pink-50/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-700">
                Visual Outfit Analysis
              </h3>
              <p className="text-xs text-slate-700">
                <strong>Palette:</strong> {data.outfit_analysis.colors?.join(', ')} •{' '}
                <strong>Style:</strong> {data.outfit_analysis.style} •{' '}
                <strong>Formality:</strong> {data.outfit_analysis.formality}
              </p>
              {data.outfit_analysis.notes && (
                <p className="text-xs text-slate-600 italic">{data.outfit_analysis.notes}</p>
              )}
            </div>
          )}

          {/* Breakdown for Home & Party */}
          {data.budget_breakdown && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Itemized Budget Allocations
              </h3>
              {data.budget_breakdown.map((cat: any, idx: number) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-800">{cat.category}</span>
                    <span className="font-semibold text-xs text-blue-700">
                      Allocation: {data.currency || '₹'} {cat.allocation?.toLocaleString()}
                    </span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="py-2 px-3">Item</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Qty</th>
                        <th className="py-2 px-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cat.items?.map((item: any, iIdx: number) => (
                        <tr key={iIdx}>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-sm">{item.description}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {data.currency || '₹'} {item.estimated_price?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations for Jewelry */}
          {data.jewelry_recommendations && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Curated Jewelry Suggestions
              </h3>
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Item Name</th>
                    <th className="py-2 px-3">Style & Match</th>
                    <th className="py-2 px-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.jewelry_recommendations.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{item.item_type}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs">{item.description}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {data.currency || '₹'} {item.estimated_price?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tips */}
          {(data.additional_suggestions || data.styling_tips) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Smart Suggestions & Tips
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                {(data.additional_suggestions || data.styling_tips).map(
                  (tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Generated by PocketSmart AI • All rights reserved</span>
            <span>https://pocketsmart.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
};
