import React, { useState } from 'react';
import { Sparkles, Bot, FileText, Send, Loader2, Copy, Check } from 'lucide-react';

interface AiGddGeneratorProps {
  currentContext: any;
}

export const AiGddGenerator: React.FC<AiGddGeneratorProps> = ({ currentContext }) => {
  const [prompt, setPrompt] = useState(
    'Create an EA-standard LiveOps Event GDD for a 2-week Apex Titans sci-fi themed battle pass event with high retention hooks.'
  );
  const [type, setType] = useState<'gdd' | 'quests' | 'balance'>('gdd');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/liveops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type, context: currentContext }),
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
      } else {
        setResponse(`Error: ${data.error || 'Failed to generate content.'}`);
      }
    } catch (err: any) {
      setResponse(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
        <div>
          <h3 className="font-extrabold text-base text-white">
            EA AI LiveOps Copilot (Powered by Gemini 2.5 Flash)
          </h3>
          <p className="text-xs text-slate-400">
            Generate industry-standard Game Design Documents (GDD), narrative quest scripts, and balance reports instantly.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setType('gdd')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
              type === 'gdd'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Full LiveOps Event GDD
          </button>
          <button
            type="button"
            onClick={() => setType('quests')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
              type === 'quests'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Quest Proposals & Narrative
          </button>
          <button
            type="button"
            onClick={() => setType('balance')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
              type === 'balance'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            Economy & Monetization Balance
          </button>
        </div>

        <div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
            placeholder="Describe your desired event concept or tuning question..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-slate-950" />
          )}
          <span>{loading ? 'Synthesizing EA LiveOps Document...' : 'GENERATE DESIGN DOCUMENT'}</span>
        </button>
      </form>

      {/* AI Output Console */}
      {response && (
        <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 space-y-3 relative font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              Generated EA LiveOps Game Design Document
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied GDD!' : 'Copy Markdown'}</span>
            </button>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-slate-200 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto p-1">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
