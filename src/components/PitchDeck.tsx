import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Download, Presentation,
  Share2, Copy, Image as ImageIcon, Mail, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { AnalysisResult } from '../utils/mockData';
import { 
  exportPitchDeckToPDF, 
  exportToImage, 
  copyToClipboard,
  shareReport 
} from '../utils/pdfExport';

interface PitchDeckProps {
  analysis: AnalysisResult;
}

const SLIDES = [
  'Title', 'Problem', 'Solution', 'Market', 'Competition',
  'Product', 'Revenue Model', 'Business Plan', 'Traction', 'Team', 'Funding Ask'
];

export default function PitchDeck({ analysis }: PitchDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportPitchDeckToPDF('pitch-deck-content', `${analysis.idea.name.replace(/\s+/g, '_')}_PitchDeck`);
      toast.success('Pitch deck PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export PDF. Please try again.');
    }
    setIsExporting(false);
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportToImage('pitch-deck-content', `${analysis.idea.name.replace(/\s+/g, '_')}_Slide_${currentSlide + 1}`);
      toast.success(`Slide ${currentSlide + 1} exported as image!`);
    } catch (error) {
      toast.error('Failed to export image. Please try again.');
    }
    setIsExporting(false);
  };

  const handleShare = async () => {
    try {
      await shareReport(analysis);
      toast.success('Report shared successfully!');
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    const link = `Check out my startup validation for ${analysis.idea.name} - Score: ${analysis.validationScore}/100`;
    const success = await copyToClipboard(link);
    toast.success(success ? 'Link copied to clipboard!' : 'Failed to copy');
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent(`${analysis.idea.name} - Startup Validation Report`);
    const body = encodeURIComponent(`
Hi,

I've analyzed a startup idea using StartupValidator.ai and wanted to share the results with you.

Startup: ${analysis.idea.name}
Validation Score: ${analysis.validationScore}/100
Industry: ${analysis.industry.industry}
Market Demand: ${analysis.market.demandScore}/100

Key Highlights:
- TAM: ${analysis.market.tam}
- Growth Rate: ${analysis.market.growthRate}
- Success Probability: ${analysis.successProbability}%

View the full report at: StartupValidator.ai

Best regards,
    `);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success('Opening email client...');
  };

  const renderSlide = () => {
    const { idea, industry, market, competitors, validationScore, revenue, businessModel, businessPlan } = analysis;

    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center mb-8 animate-pulse-glow">
              <Presentation className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">{idea.name}</h1>
            <p className="text-xl text-gray-400 mb-2">{industry.industry} • {industry.category}</p>
            <p className="text-gray-500 text-sm">Investor Pitch Deck</p>
            <div className="mt-8 px-6 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm">
              Validation Score: {validationScore}/100
            </div>
          </div>
        );
      case 1:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">The Problem</h2>
            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border-l-4 border-red-500">
                <p className="text-lg text-gray-300 leading-relaxed">{idea.description}</p>
                <p className="text-sm text-gray-500 mt-3">This represents a significant gap in the {industry.industry} market</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">90%</div>
                  <div className="text-xs text-gray-500 mt-1">Startups Fail</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">63%</div>
                  <div className="text-xs text-gray-500 mt-1">No Market Need</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">₹2.5L</div>
                  <div className="text-xs text-gray-500 mt-1">Avg. Wasted Cost</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Our Solution</h2>
            <div className="glass rounded-xl p-8">
              <p className="text-lg text-gray-200 leading-relaxed mb-6">{idea.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {industry.targetAudience.map((aud, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-sm text-gray-300">{aud}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-sm font-medium">{industry.businessType}</div>
              <div className="px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-300 text-sm font-medium">{industry.industry}</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Market Opportunity</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-xs text-gray-500 mb-2">TAM</div>
                <div className="text-2xl font-bold text-violet-400">{market.tam}</div>
                <div className="text-xs text-gray-500 mt-1">Total Addressable</div>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-xs text-gray-500 mb-2">SAM</div>
                <div className="text-2xl font-bold text-emerald-400">{market.sam}</div>
                <div className="text-xs text-gray-500 mt-1">Serviceable</div>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-xs text-gray-500 mb-2">SOM</div>
                <div className="text-2xl font-bold text-amber-400">{market.som}</div>
                <div className="text-xs text-gray-500 mt-1">Obtainable</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-400">Market Growth:</span>
              <span className="text-lg font-bold text-emerald-400">{market.growthRate}</span>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-400">Demand:</span>
              <span className="text-lg font-bold text-violet-400">{market.demandScore}/100</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Competitive Landscape</h2>
            <div className="space-y-3">
              {competitors.map((comp, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{comp.name}</span>
                    <span className="text-xs text-gray-500">{comp.marketShare} market share</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span className="text-emerald-400">+ {comp.strengths[0]}</span>
                    <span className="text-red-400">- {comp.weaknesses[0]}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{comp.pricing}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Product Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {['AI-Powered Analysis', 'Real-time Feedback', 'Personalized Learning', 'Career Roadmaps', 'Progress Tracking', 'Community Support'].map((feature, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 px-4 py-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-300 text-sm">
              ✨ Key Differentiator: {analysis.gaps[0]?.area || 'Unique AI-driven approach'}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Revenue Model</h2>
            <div className="glass rounded-xl p-6 mb-6">
              <div className="text-sm text-gray-500 mb-1">Recommended Model</div>
              <div className="text-xl font-bold text-gradient">{businessModel.recommended}</div>
              <div className="text-emerald-400 font-medium">{businessModel.pricing}</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Year 1</div>
                <div className="text-lg font-bold text-amber-400">{revenue.expected.year1}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Year 3</div>
                <div className="text-lg font-bold text-emerald-400">{revenue.expected.year3}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Year 5</div>
                <div className="text-lg font-bold text-violet-400">{revenue.expected.year5}</div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Business Plan</h2>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-violet-400 font-semibold mb-1">EXECUTIVE SUMMARY</div>
                <p className="text-sm text-gray-300 leading-relaxed">{businessPlan.executiveSummary}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-emerald-400 font-semibold mb-1">GROWTH STRATEGY</div>
                <p className="text-sm text-gray-300 leading-relaxed">{businessPlan.growthStrategy}</p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Milestones & Traction</h2>
            <div className="space-y-4">
              {businessPlan.milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < 2 ? 'bg-emerald-600/30 text-emerald-400' : 'bg-violet-600/30 text-violet-400'
                  }`}>
                    {i < 2 ? '✓' : (i + 1)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{milestone}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Target Milestone</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">The Team</h2>
            <div className="space-y-4">
              {[
                { role: 'CEO & Founder', desc: 'Domain expert with industry experience', icon: '👤' },
                { role: 'CTO & Co-Founder', desc: 'Technical lead with AI/ML expertise', icon: '👨‍💻' },
                { role: 'Head of Growth', desc: 'Marketing & user acquisition specialist', icon: '📈' },
                { role: 'Advisory Board', desc: 'Industry veterans and angel investors', icon: '🏆' },
              ].map((member, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="text-3xl">{member.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-200">{member.role}</div>
                    <div className="text-xs text-gray-500">{member.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="h-full flex flex-col justify-center text-center">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Funding Ask</h2>
            <div className="glass rounded-2xl p-8 mb-6 gradient-border">
              <div className="text-5xl font-black text-gradient mb-2">₹50 Lakhs</div>
              <div className="text-sm text-gray-400">Seed Round</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Product Development</div>
                <div className="text-lg font-bold text-violet-400">40%</div>
                <div className="w-full bg-surface-700 rounded-full h-1.5 mt-2">
                  <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Marketing</div>
                <div className="text-lg font-bold text-emerald-400">25%</div>
                <div className="w-full bg-surface-700 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Operations</div>
                <div className="text-lg font-bold text-amber-400">20%</div>
                <div className="w-full bg-surface-700 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Reserve</div>
                <div className="text-lg font-bold text-blue-400">15%</div>
                <div className="w-full bg-surface-700 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Export Options */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700">
        <div className="flex items-center gap-3">
          <Presentation className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-sm">Investor Pitch Deck</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="p-2 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 transition-colors disabled:opacity-50"
            title="Download Full Deck as PDF"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExportImage}
            disabled={isExporting}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Export Current Slide as Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white transition-colors"
            title="Share Report"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white transition-colors"
            title="Copy Summary"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleEmailReport}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white transition-colors"
            title="Email Report"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div ref={deckRef} id="pitch-deck-content" className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-4 py-3 border-t border-surface-700">
        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-violet-500 w-6' : 'bg-surface-600 hover:bg-surface-500'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            disabled={currentSlide === SLIDES.length - 1}
            className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">Slide {currentSlide + 1} of {SLIDES.length}</span>
        </div>
      </div>
    </div>
  );
}
