import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const AI_RESPONSES: Record<string, string> = {
  default: "That's a great question! Based on my analysis of your startup idea, I'd recommend focusing on finding product-market fit first. Start with a small target audience, gather feedback, and iterate quickly. The market data shows strong potential in your chosen space.",
  pricing: "For pricing, I recommend starting with a freemium model. Offer a free tier to build your user base, then charge ₹299-499/month for premium features. Research shows that B2C startups in this space see 3-5% conversion from free to paid. Consider annual plans at a 30% discount to improve cash flow.",
  improve: "Here are 3 key improvements I'd suggest: 1) Focus on a single, unique feature that competitors don't offer - this becomes your moat. 2) Build a community around your product early for viral growth. 3) Implement AI personalization to increase user engagement and retention.",
  students: "Targeting students first is a smart strategy. Students are early adopters, spread quickly through campus networks, and have clear pain points. Start with engineering students at top colleges, then expand to other disciplines. Consider campus ambassador programs for growth.",
  marketing: "For a lean marketing strategy: 1) Content marketing through technical blogs and YouTube tutorials. 2) Partner with coding bootcamps and colleges. 3) Build a referral program with incentives. 4) Leverage LinkedIn for B2B and Instagram/Twitter for B2C. 5) Host free webinars and hackathons.",
  competition: "Competition is healthy - it validates market demand. Your strategy should be: 1) Find an underserved niche within the market. 2) Offer something unique that incumbents can't easily copy. 3) Build superior user experience. 4) Focus on customer service. 5) Iterate faster than competitors.",
  funding: "For early-stage funding: 1) Start with bootstrapping to validate the idea. 2) Apply to accelerators like Y Combinator or Techstars. 3) Pitch angel investors through AngelList. 4) Once you have traction (1000+ users), approach VCs. Your validation score shows strong investor potential.",
  team: "For your founding team, aim for: 1) A technical co-founder who can build the product. 2) Someone with domain expertise in your industry. 3) A growth-focused co-founder for marketing and user acquisition. If you're solo, consider joining a co-founder matching platform.",
  mvp: "For your MVP, focus on the core value proposition only. Build the minimum feature set that solves the primary user problem. Don't worry about scaling, fancy UI, or extra features. Launch quickly, get user feedback, and iterate. Your MVP should be ready in 4-8 weeks.",
  revenue: "Your revenue model should prioritize: 1) Recurring revenue (subscriptions) over one-time payments. 2) Multiple revenue streams for diversification. 3) Annual plans for better cash flow. 4) Enterprise deals for larger contract values. Based on market analysis, expect ₹10-25 Lakhs in Year 1 with proper execution.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (/price|pricing|cost|charge|money|revenue/.test(lower)) return AI_RESPONSES.pricing;
  if (/improve|better|suggestion|advice|recommend/.test(lower)) return AI_RESPONSES.improve;
  if (/student|campus|college|university/.test(lower)) return AI_RESPONSES.students;
  if (/market|growth|user|acquire|marketing|promote/.test(lower)) return AI_RESPONSES.marketing;
  if (/competit|rival|compare|different/.test(lower)) return AI_RESPONSES.competition;
  if (/fund|invest|vc|angel|seed|series|raise/.test(lower)) return AI_RESPONSES.funding;
  if (/team|co-founder|cofounder|hire|founder/.test(lower)) return AI_RESPONSES.team;
  if (/mvp|minimum|product|build|develop|launch/.test(lower)) return AI_RESPONSES.mvp;
  if (/revenue|income|earn|profit|business model/.test(lower)) return AI_RESPONSES.revenue;
  return AI_RESPONSES.default;
}

export default function MentorChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', content: "Hello! I'm your AI Startup Mentor. I've analyzed your startup idea and I'm ready to help you refine it. Ask me anything about your business strategy, pricing, marketing, team building, or funding!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userMsg.content);
      const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const quickQuestions = [
    "How can I improve my startup?",
    "What pricing should I use?",
    "Should I target students first?",
    "How do I handle competition?",
    "What funding should I seek?",
    "How should I build my MVP?",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Startup Mentor</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Online — Ready to help</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' 
                  ? 'bg-gradient-to-br from-violet-600 to-emerald-600' 
                  : 'bg-surface-600'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-300" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'assistant' 
                  ? 'bg-surface-800 text-gray-200' 
                  : 'bg-violet-600/30 text-white border border-violet-500/30'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface-800 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-800 border border-surface-600 text-xs text-gray-400 hover:border-violet-500/50 hover:text-violet-300 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about your startup..."
            className="flex-1 px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="px-4 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 text-white disabled:opacity-50 hover:shadow-lg hover:shadow-violet-500/25 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
