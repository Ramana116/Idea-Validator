export interface StartupIdea {
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
}

export interface AnalysisResult {
  idea: StartupIdea;
  timestamp: Date;
  industry: IndustryAnalysis;
  market: MarketAnalysis;
  competitors: Competitor[];
  gaps: Gap[];
  validationScore: number;
  validationBreakdown: ValidationBreakdown;
  revenue: RevenuePrediction;
  businessModel: BusinessModel;
  swot: SWOT;
  investorReadiness: number;
  risks: Risk[];
  businessPlan: BusinessPlan;
  funding: FundingRecommendation;
  successProbability: number;
}

export interface IndustryAnalysis {
  industry: string;
  category: string;
  targetAudience: string[];
  businessType: string;
  potentialMarkets: string[];
}

export interface MarketAnalysis {
  demandScore: number;
  tam: string;
  sam: string;
  som: string;
  growthRate: string;
  trends: string[];
  marketStatus: 'Excellent' | 'Good' | 'Moderate' | 'Low';
}

export interface Competitor {
  name: string;
  pricing: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
}

export interface Gap {
  area: string;
  description: string;
  opportunityScore: number;
  competitors: string[];
}

export interface ValidationBreakdown {
  marketDemand: number;
  competition: number;
  revenuePotential: number;
  scalability: number;
  innovation: number;
}

export interface RevenuePrediction {
  conservative: RevenueTimeline;
  expected: RevenueTimeline;
  optimistic: RevenueTimeline;
  currency: string;
  monthlySubPrice: string;
}

export interface RevenueTimeline {
  year1: string;
  year3: string;
  year5: string;
}

export interface BusinessModel {
  recommended: string;
  pricing: string;
  models: { name: string; description: string; suitability: number }[];
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Risk {
  category: 'Technical' | 'Financial' | 'Legal' | 'Market' | 'Operational';
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  solution: string;
}

export interface BusinessPlan {
  executiveSummary: string;
  marketAnalysis: string;
  customerSegments: string[];
  revenueStreams: string[];
  costStructure: string[];
  marketingPlan: string;
  growthStrategy: string;
  milestones: string[];
}

export interface FundingRecommendation {
  stage: string;
  recommendations: {
    type: string;
    name: string;
    description: string;
    fit: number;
  }[];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const INDUSTRIES: Record<string, {
  industry: string;
  category: string;
  targetAudience: string[];
  businessType: string;
  potentialMarkets: string[];
  competitors: Competitor[];
  gaps: Gap[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  risks: Risk[];
  customerSegments: string[];
  revenueStreams: string[];
  costStructure: string[];
  trends: string[];
  tam: string;
  sam: string;
  som: string;
  growthRate: string;
  businessModel: string;
  monthlyPrice: string;
  fundingStage: string;
  milestones: string[];
}> = {
  edtech: {
    industry: 'EdTech',
    category: 'AI SaaS',
    targetAudience: ['Students', 'Fresh Graduates', 'Job Seekers', 'Professionals'],
    businessType: 'B2C',
    potentialMarkets: ['India', 'USA', 'Southeast Asia', 'Europe'],
    competitors: [
      { name: 'Interviewing.io', pricing: '$40/session', features: ['Mock Interviews', 'Code Review'], strengths: ['Expert Interviewers', 'Real Practice'], weaknesses: ['Expensive', 'Limited Availability'], marketShare: '8%' },
      { name: 'Pramp', pricing: 'Free', features: ['Peer Interviews', 'All Levels'], strengths: ['Free', 'Community'], weaknesses: ['Quality Inconsistent', 'No AI'], marketShare: '15%' },
      { name: 'LeetCode', pricing: '$35/month', features: ['Coding Problems', 'Interview Prep'], strengths: ['Large Question Bank', 'Well-known'], weaknesses: ['No Mock Interviews', 'No Personalization'], marketShare: '25%' },
    ],
    gaps: [
      { area: 'Emotional Confidence Coaching', description: 'No platform provides AI-driven confidence building for interview anxiety', opportunityScore: 92, competitors: ['Interviewing.io', 'Pramp'] },
      { area: 'Regional Language Interviews', description: 'Platforms only offer English - miss huge regional markets', opportunityScore: 88, competitors: ['LeetCode', 'Pramp'] },
      { area: 'AI Career Roadmaps', description: 'Personalized career path generation based on interview performance', opportunityScore: 85, competitors: ['All'] },
    ],
    strengths: ['AI-driven personalized learning', 'Large and growing target audience', 'Scalable SaaS model', 'Growing tech job market'],
    weaknesses: ['High competition in EdTech', 'Requires continuous AI model updates', 'User acquisition costs may be high'],
    opportunities: ['Growing AI adoption in education', 'Remote interview trend post-pandemic', 'Expansion into corporate training', 'Government education initiatives'],
    threats: ['Large tech companies entering EdTech', 'Economic downturns affecting student spending', 'Free alternatives gaining traction'],
    risks: [
      { category: 'Technical', title: 'AI Model Accuracy', description: 'AI interview evaluation may not match human accuracy', severity: 'High', solution: 'Use hybrid approach with human-in-the-loop validation' },
      { category: 'Market', title: 'Competition Saturation', description: 'Many players already in the interview prep space', severity: 'High', solution: 'Differentiate with unique AI features and regional focus' },
      { category: 'Financial', title: 'Customer Acquisition Cost', description: 'High CAC in competitive EdTech market', severity: 'Medium', solution: 'Focus on viral growth through student referrals and campus programs' },
      { category: 'Legal', title: 'Data Privacy', description: 'Student data handling requires compliance', severity: 'Medium', solution: 'Implement GDPR/FERPA compliance from day one' },
      { category: 'Operational', title: 'Content Updates', description: 'Interview questions change rapidly with tech trends', severity: 'Low', solution: 'Automated content pipeline with industry expert review' },
    ],
    customerSegments: ['Engineering Students', 'Career Switchers', 'Bootcamp Graduates', 'Experienced Developers', 'Non-IT Graduates'],
    revenueStreams: ['Monthly Subscription (₹299)', 'Annual Plan (₹2,999)', 'Premium Coaching (₹999/month)', 'Corporate B2B Licenses', 'University Partnerships'],
    costStructure: ['AI Infrastructure (40%)', 'Development Team (25%)', 'Marketing (20%)', 'Operations (10%)', 'Legal & Compliance (5%)'],
    trends: ['Remote-first hiring', 'AI-powered assessments', 'Personalized learning paths', 'Micro-certifications'],
    tam: '$340 Billion',
    sam: '$45 Billion',
    som: '$2.5 Billion',
    growthRate: '16.3% CAGR',
    businessModel: 'SaaS Subscription',
    monthlyPrice: '₹299/month',
    fundingStage: 'Seed Stage',
    milestones: ['MVP Launch - Month 3', 'First 1000 Users - Month 6', 'Revenue Positive - Month 12', 'Series A - Month 18', 'International Expansion - Month 24'],
  },
  fintech: {
    industry: 'FinTech',
    category: 'Financial Technology',
    targetAudience: ['Young Professionals', 'Small Business Owners', 'Freelancers', 'Gen-Z Investors'],
    businessType: 'B2B2C',
    potentialMarkets: ['India', 'USA', 'UK', 'Middle East'],
    competitors: [
      { name: 'Stripe', pricing: '2.9% + $0.30/txn', features: ['Payment Processing', 'Developer APIs'], strengths: ['Market Leader', 'Excellent APIs'], weaknesses: ['Complex for SMBs', 'High fees for small players'], marketShare: '22%' },
      { name: 'Razorpay', pricing: '2% per txn', features: ['Payment Gateway', 'Neobanking'], strengths: ['India-focused', 'Full-stack'], weaknesses: ['Limited global reach', 'Support issues'], marketShare: '18%' },
      { name: 'Square', pricing: '2.6% + $0.10/txn', features: ['POS Systems', 'Business Tools'], strengths: ['Easy to use', 'Ecosystem'], weaknesses: ['US-only', 'Hardware dependent'], marketShare: '14%' },
    ],
    gaps: [
      { area: 'AI-Powered Financial Planning', description: 'No integrated platform combining payments with AI financial advice', opportunityScore: 95, competitors: ['Stripe', 'Razorpay'] },
      { area: 'Micro-Business Financial Health', description: 'Tools for very small businesses and solopreneurs are lacking', opportunityScore: 87, competitors: ['Square', 'Razorpay'] },
      { area: 'Cross-Border Simplification', description: 'Simplified international payments for freelancers', opportunityScore: 82, competitors: ['All'] },
    ],
    strengths: ['Huge and growing market', 'Recurring revenue model', 'Network effects potential', 'Data-driven insights'],
    weaknesses: ['Regulatory complexity', 'High trust barrier', 'Requires significant security investment'],
    opportunities: ['Open banking regulations', 'Embedded finance trend', 'Web3 integration potential', 'Underbanked populations'],
    threats: ['Banking regulation changes', 'Established players expanding', 'Cybersecurity threats', 'Economic recession impact'],
    risks: [
      { category: 'Legal', title: 'Regulatory Compliance', description: 'Multiple jurisdictions with varying fintech regulations', severity: 'High', solution: 'Hire regulatory experts and use compliance-as-a-service platforms' },
      { category: 'Technical', title: 'Security Breaches', description: 'Financial data is a prime target for cyberattacks', severity: 'High', solution: 'Zero-trust architecture, regular penetration testing, insurance' },
      { category: 'Market', title: 'Trust Building', description: 'Users are hesitant to trust new financial platforms', severity: 'Medium', solution: 'Transparent security practices, certifications, gradual trust building' },
      { category: 'Financial', title: 'Cash Flow Management', description: 'Long sales cycles and regulatory approval delays', severity: 'Medium', solution: 'Adequate runway, phased rollout, early revenue from MVP features' },
      { category: 'Operational', title: 'Bank Partnerships', description: 'Dependency on banking infrastructure providers', severity: 'Low', solution: 'Multiple banking partners, direct integrations where possible' },
    ],
    customerSegments: ['Freelancers', 'Small Business Owners', 'E-commerce Merchants', 'Content Creators', 'Gig Workers'],
    revenueStreams: ['Transaction Fees', 'Monthly Subscriptions', 'Premium Features', 'B2B API Access', 'Interest on Float'],
    costStructure: ['Infrastructure & Security (35%)', 'Compliance & Legal (20%)', 'Development (25%)', 'Marketing (15%)', 'Operations (5%)'],
    trends: ['Embedded finance', 'Buy now pay later', 'Crypto integration', 'AI fraud detection'],
    tam: '$15.6 Trillion',
    sam: '$850 Billion',
    som: '$12 Billion',
    growthRate: '23.4% CAGR',
    businessModel: 'Transaction-based + SaaS',
    monthlyPrice: '₹499/month + 1.5%',
    fundingStage: 'Seed to Series A',
    milestones: ['License Acquisition - Month 6', 'MVP Launch - Month 9', 'First 10K Users - Month 15', 'Series A - Month 20', 'Cross-border Launch - Month 28'],
  },
  healthtech: {
    industry: 'HealthTech',
    category: 'Digital Health & Wellness',
    targetAudience: ['Patients', 'Healthcare Providers', 'Wellness Enthusiasts', 'Chronic Disease Patients'],
    businessType: 'B2C',
    potentialMarkets: ['India', 'USA', 'Europe', 'Australia'],
    competitors: [
      { name: 'Practo', pricing: 'Free consultation', features: ['Doctor Booking', 'Online Consult'], strengths: ['Large network', 'Brand trust'], weaknesses: ['Limited AI', 'No continuous care'], marketShare: '30%' },
      { name: 'Teladoc', pricing: '$75/visit', features: ['Telemedicine', 'Mental Health'], strengths: ['Insurance coverage', 'Comprehensive'], weaknesses: ['Expensive', 'US-centric'], marketShare: '20%' },
      { name: 'Babylon Health', pricing: '$25/month', features: ['AI Symptom Checker', 'Video Consult'], strengths: ['AI-first approach', 'Subscription model'], weaknesses: ['Accuracy concerns', 'Regulatory issues'], marketShare: '8%' },
    ],
    gaps: [
      { area: 'Continuous Health Monitoring', description: 'No platform provides 24/7 AI health monitoring with proactive alerts', opportunityScore: 94, competitors: ['Practo', 'Teladoc'] },
      { area: 'Mental Health Integration', description: 'Holistic approach combining physical and mental health AI', opportunityScore: 90, competitors: ['All'] },
      { area: 'Regional Language Health Support', description: 'Health information and consultations in regional languages', opportunityScore: 86, competitors: ['Teladoc', 'Babylon'] },
    ],
    strengths: ['Growing health awareness', 'AI diagnostic accuracy improving', 'Large addressable market', 'Recurring engagement'],
    weaknesses: ['Regulatory hurdles', 'Medical liability concerns', 'Requires clinical validation'],
    opportunities: ['Post-pandemic telehealth adoption', 'Wearable integration', 'Preventive healthcare trend', 'Aging population'],
    threats: ['Regulatory changes', 'Big tech entering health', 'Medical malpractice risks', 'Data privacy regulations'],
    risks: [
      { category: 'Legal', title: 'Medical Regulations', description: 'HealthTech requires FDA/CDSCO approvals for diagnostic features', severity: 'High', solution: 'Start with wellness features, pursue regulatory approval gradually' },
      { category: 'Technical', title: 'AI Diagnostic Accuracy', description: 'Incorrect health recommendations could cause harm', severity: 'High', solution: 'Human doctor review, clear disclaimers, conservative recommendations' },
      { category: 'Market', title: 'User Trust', description: 'Health decisions require high trust in the platform', severity: 'Medium', solution: 'Medical advisory board, transparent AI explanations, clinical trials' },
      { category: 'Financial', title: 'Insurance Integration', description: 'Complex insurance reimbursement processes', severity: 'Medium', solution: 'Direct-to-consumer initially, add insurance integration later' },
      { category: 'Operational', title: 'Doctor Network', description: 'Building and maintaining a quality doctor network', severity: 'Low', solution: 'Start with teleconsultation partners, grow organically' },
    ],
    customerSegments: ['Urban Professionals', 'Chronic Disease Patients', 'Elderly Care', 'Fitness Enthusiasts', 'Mental Health Seekers'],
    revenueStreams: ['Subscription Plans', 'Consultation Commission', 'Premium Diagnostics', 'Corporate Wellness Programs', 'Pharmacy Partnerships'],
    costStructure: ['Medical Staff (30%)', 'AI Development (25%)', 'Compliance & Legal (15%)', 'Marketing (20%)', 'Infrastructure (10%)'],
    trends: ['Telemedicine growth', 'Wearable health tech', 'AI diagnostics', 'Personalized medicine'],
    tam: '$660 Billion',
    sam: '$80 Billion',
    som: '$5 Billion',
    growthRate: '26.1% CAGR',
    businessModel: 'Freemium Subscription',
    monthlyPrice: '₹399/month',
    fundingStage: 'Seed Stage',
    milestones: ['Medical Board Setup - Month 3', 'MVP Launch - Month 8', '10K Active Users - Month 14', 'Regulatory Approval - Month 18', 'Insurance Partnerships - Month 24'],
  },
  ecommerce: {
    industry: 'E-Commerce',
    category: 'Retail Technology',
    targetAudience: ['Online Shoppers', 'Small Retailers', 'D2C Brands', 'Artisans'],
    businessType: 'B2C',
    potentialMarkets: ['India', 'Southeast Asia', 'Middle East', 'Africa'],
    competitors: [
      { name: 'Shopify', pricing: '$29/month', features: ['Store Builder', 'Payment Integration'], strengths: ['Easy setup', 'Huge ecosystem'], weaknesses: ['Transaction fees', 'Theme limitations'], marketShare: '30%' },
      { name: 'WooCommerce', pricing: 'Free (Hosting extra)', features: ['WordPress Integration', 'Plugins'], strengths: ['Free', 'Flexible'], weaknesses: ['Technical setup', 'Security management'], marketShare: '22%' },
      { name: 'Dukaan', pricing: '₹599/month', features: ['Quick Store Setup', 'WhatsApp Selling'], strengths: ['India-focused', 'Simple'], weaknesses: ['Limited features', 'Basic customization'], marketShare: '5%' },
    ],
    gaps: [
      { area: 'AI-Powered Product Discovery', description: 'Smart product recommendation based on social media behavior', opportunityScore: 89, competitors: ['Shopify', 'WooCommerce'] },
      { area: 'Social Commerce Integration', description: 'Seamless Instagram/TikTok to checkout integration', opportunityScore: 93, competitors: ['All'] },
      { area: 'Hyperlocal Delivery Optimization', description: 'AI-driven last-mile delivery for small businesses', opportunityScore: 84, competitors: ['Dukaan', 'WooCommerce'] },
    ],
    strengths: ['Massive market', 'Proven business models', 'Network effects possible', 'Data-rich environment'],
    weaknesses: ['Intense competition', 'Low margins initially', 'Logistics complexity'],
    opportunities: ['Social commerce boom', 'D2C brand growth', 'Tier-2/3 city penetration', 'Voice commerce'],
    threats: ['Amazon/Walmart dominance', 'Shipping cost increases', 'Changing privacy regulations', 'Economic downturns'],
    risks: [
      { category: 'Market', title: 'Competition from Giants', description: 'Amazon and large platforms dominate the market', severity: 'High', solution: 'Focus on niche markets and provide unique value propositions' },
      { category: 'Financial', title: 'Customer Acquisition', description: 'Rising digital ad costs make CAC expensive', severity: 'Medium', solution: 'Focus on organic growth, referrals, and community building' },
      { category: 'Operational', title: 'Supply Chain', description: 'Managing inventory and logistics at scale', severity: 'Medium', solution: 'Start with dropshipping, add inventory management gradually' },
      { category: 'Technical', title: 'Platform Scalability', description: 'Handling traffic spikes during sales events', severity: 'Low', solution: 'Cloud-native architecture with auto-scaling from day one' },
      { category: 'Legal', title: 'Consumer Protection', description: 'Return policies and consumer rights compliance', severity: 'Low', solution: 'Clear policies, automated compliance checks' },
    ],
    customerSegments: ['D2C Brands', 'Artisans & Crafters', 'Small Retailers', 'Fashion Brands', 'Food & Beverage'],
    revenueStreams: ['Platform Subscription', 'Transaction Commission', 'Premium Features', 'Advertising', 'Logistics Services'],
    costStructure: ['Platform Development (30%)', 'Marketing (25%)', 'Infrastructure (20%)', 'Support Team (15%)', 'Legal (10%)'],
    trends: ['Social commerce', 'Voice shopping', 'AR try-before-buy', 'Sustainable commerce'],
    tam: '$6.2 Trillion',
    sam: '$500 Billion',
    som: '$25 Billion',
    growthRate: '14.7% CAGR',
    businessModel: 'SaaS + Commission',
    monthlyPrice: '₹499/month + 3%',
    fundingStage: 'Seed to Series A',
    milestones: ['Platform MVP - Month 4', 'First 100 Sellers - Month 7', 'GMV Milestone - Month 12', 'Series A - Month 18', 'Multi-country Launch - Month 24'],
  },
  saas: {
    industry: 'SaaS / B2B Technology',
    category: 'Enterprise Software',
    targetAudience: ['Startups', 'SMEs', 'Enterprises', 'Remote Teams'],
    businessType: 'B2B',
    potentialMarkets: ['Global', 'USA', 'Europe', 'India'],
    competitors: [
      { name: 'Notion', pricing: '$8/user/month', features: ['Workspace', 'AI Assistant'], strengths: ['Flexible', 'Growing ecosystem'], weaknesses: ['Learning curve', 'Can be slow'], marketShare: '18%' },
      { name: 'Monday.com', pricing: '$8/user/month', features: ['Project Management', 'Automation'], strengths: ['Visual', 'Easy to use'], weaknesses: ['Pricing for teams', 'Limited customization'], marketShare: '12%' },
      { name: 'Asana', pricing: '$10.99/user/month', features: ['Task Management', 'Portfolio View'], strengths: ['Well-established', 'Integrations'], weaknesses: ['Complex pricing', 'Feature bloat'], marketShare: '15%' },
    ],
    gaps: [
      { area: 'AI-First Workflow Automation', description: 'True AI-native workflow that learns and adapts', opportunityScore: 91, competitors: ['Notion', 'Monday.com'] },
      { area: 'Industry-Specific Solutions', description: 'Pre-built templates for specific industries', opportunityScore: 86, competitors: ['All'] },
      { area: 'Offline-First Collaboration', description: 'Full functionality without internet connectivity', opportunityScore: 78, competitors: ['Notion', 'Asana'] },
    ],
    strengths: ['Recurring revenue', 'High margins at scale', 'Global addressable market', 'Product-led growth potential'],
    weaknesses: ['Long sales cycles for B2B', 'High churn risk', 'Feature parity pressure'],
    opportunities: ['AI productivity tools trend', 'Remote work permanence', 'SME digitalization', 'Vertical SaaS expansion'],
    threats: ['Microsoft/Google bundling', 'Economic downturns', 'Open-source alternatives', 'Platform dependency risks'],
    risks: [
      { category: 'Market', title: 'Churn Rate', description: 'SaaS businesses lose 5-7% annually to churn', severity: 'High', solution: 'Focus on product stickiness, customer success programs, annual plans' },
      { category: 'Technical', title: 'Platform Reliability', description: 'Downtime directly impacts customer trust', severity: 'High', solution: '99.9% SLA target, multi-region deployment, robust monitoring' },
      { category: 'Financial', title: 'CAC Payback Period', description: 'Long time to recover customer acquisition costs', severity: 'Medium', solution: 'Product-led growth, freemium model, referral programs' },
      { category: 'Operational', title: 'Feature Prioritization', description: 'Balancing feature requests with product vision', severity: 'Medium', solution: 'Data-driven roadmap, customer advisory board' },
      { category: 'Legal', title: 'Data Residency', description: 'Enterprise customers require data to stay in specific regions', severity: 'Low', solution: 'Multi-region architecture, data localization options' },
    ],
    customerSegments: ['Tech Startups', 'Marketing Agencies', 'Consulting Firms', 'Remote Teams', 'SMEs'],
    revenueStreams: ['Per-User Subscription', 'Enterprise Plans', 'API Access', 'Add-on Modules', 'Professional Services'],
    costStructure: ['Engineering (35%)', 'Sales & Marketing (30%)', 'Infrastructure (15%)', 'Customer Success (12%)', 'G&A (8%)'],
    trends: ['AI-first tools', 'Vertical SaaS', 'Composable architecture', 'Usage-based pricing'],
    tam: '$720 Billion',
    sam: '$120 Billion',
    som: '$8 Billion',
    growthRate: '18.2% CAGR',
    businessModel: 'B2B SaaS',
    monthlyPrice: '$15/user/month',
    fundingStage: 'Seed Stage',
    milestones: ['MVP Launch - Month 4', '100 Paying Customers - Month 8', '$10K MRR - Month 12', 'Series A - Month 16', 'Enterprise Tier - Month 20'],
  },
};

function detectIndustry(description: string, industry: string): string {
  const text = (description + ' ' + industry).toLowerCase();
  if (/educ|learn|teach|student|tutor|course|interview|exam|skill|train/.test(text)) return 'edtech';
  if (/financ|pay|bank|invest|money|crypto|wallet|insurance|lending|tax/.test(text)) return 'fintech';
  if (/health|medical|doctor|patient|wellness|fitness|mental|diet|hospital|pharma/.test(text)) return 'healthtech';
  if (/shop|store|ecommerce|retail|marketplace|product|delivery|order|seller/.test(text)) return 'ecommerce';
  return 'saas';
}

function generateScore(input: string, base: number, variance: number): number {
  const hash = hashString(input);
  return Math.min(98, Math.max(55, base + (hash % variance) - Math.floor(variance / 2)));
}

export function generateAnalysis(idea: StartupIdea): AnalysisResult {
  const industryKey = detectIndustry(idea.description, idea.industry);
  const data = INDUSTRIES[industryKey];
  const inputKey = idea.description + idea.name;

  const demandScore = generateScore(inputKey, 82, 16);
  const validationScore = generateScore(inputKey + 'val', 85, 18);
  const investorReadiness = generateScore(inputKey + 'inv', 78, 20);
  const successProbability = generateScore(inputKey + 'succ', 72, 22);

  return {
    idea,
    timestamp: new Date(),
    industry: {
      industry: data.industry,
      category: data.category,
      targetAudience: data.targetAudience,
      businessType: data.businessType,
      potentialMarkets: data.potentialMarkets,
    },
    market: {
      demandScore,
      tam: data.tam,
      sam: data.sam,
      som: data.som,
      growthRate: data.growthRate,
      trends: data.trends,
      marketStatus: demandScore > 85 ? 'Excellent' : demandScore > 70 ? 'Good' : demandScore > 55 ? 'Moderate' : 'Low',
    },
    competitors: data.competitors,
    gaps: data.gaps.map(g => ({
      ...g,
      opportunityScore: generateScore(inputKey + g.area, g.opportunityScore, 8),
    })),
    validationScore,
    validationBreakdown: {
      marketDemand: generateScore(inputKey + 'md', demandScore, 10),
      competition: generateScore(inputKey + 'comp', 75, 20),
      revenuePotential: generateScore(inputKey + 'rev', 80, 18),
      scalability: generateScore(inputKey + 'scal', 82, 16),
      innovation: generateScore(inputKey + 'inn', 85, 14),
    },
    revenue: {
      currency: '₹',
      monthlySubPrice: data.monthlyPrice,
      conservative: { year1: '₹10 Lakhs', year3: '₹45 Lakhs', year5: '₹1.5 Crores' },
      expected: { year1: '₹25 Lakhs', year3: '₹1.2 Crores', year5: '₹4 Crores' },
      optimistic: { year1: '₹50 Lakhs', year3: '₹3 Crores', year5: '₹10 Crores' },
    },
    businessModel: {
      recommended: data.businessModel,
      pricing: data.monthlyPrice,
      models: [
        { name: data.businessModel, description: `Primary ${data.businessModel} with recurring revenue`, suitability: 95 },
        { name: 'Freemium', description: 'Free tier to acquire users, premium for advanced features', suitability: 88 },
        { name: 'Commission-Based', description: 'Take a percentage of transactions processed through the platform', suitability: 72 },
        { name: 'Enterprise Licensing', description: 'Annual contracts for large organizations', suitability: 65 },
      ],
    },
    swot: {
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      opportunities: data.opportunities,
      threats: data.threats,
    },
    investorReadiness,
    risks: data.risks.map(r => ({
      ...r,
      severity: r.severity,
    })),
    businessPlan: {
      executiveSummary: `${idea.name} is an innovative ${data.industry} startup targeting ${data.targetAudience.slice(0, 2).join(' and ')}. With a ${data.growthRate} growing market and a clear differentiation strategy, this startup addresses a significant gap in the current landscape. The AI-powered platform provides unique value through personalized solutions that competitors lack.`,
      marketAnalysis: `The ${data.industry} market is valued at ${data.tam} (TAM) with a ${data.growthRate} growth rate. Our addressable market (SAM) is ${data.sam}, and our realistic first target (SOM) is ${data.som}. Key trends include: ${data.trends.join(', ')}.`,
      customerSegments: data.customerSegments,
      revenueStreams: data.revenueStreams,
      costStructure: data.costStructure,
      marketingPlan: 'Launch with a product-led growth strategy targeting early adopters. Leverage content marketing, social media presence, and strategic partnerships with industry influencers. Implement referral programs and campus/enterprise outreach programs for rapid user acquisition.',
      growthStrategy: 'Phase 1: Achieve product-market fit with MVP and iterate based on user feedback. Phase 2: Scale user base through viral growth and partnerships. Phase 3: Expand geographically and add enterprise features. Phase 4: Build ecosystem and platform integrations.',
      milestones: data.milestones,
    },
    funding: {
      stage: data.fundingStage,
      recommendations: [
        { type: 'Angel Investors', name: 'AngelList, Indian Angel Network', description: 'Best for early-stage validation and seed funding. Angels bring industry expertise and connections.', fit: 92 },
        { type: 'Accelerator', name: 'Y Combinator, Techstars', description: '3-month intensive program with mentorship, seed funding, and Demo Day exposure.', fit: 88 },
        { type: 'Venture Capital', name: 'Sequoia, Accel, Blume', description: 'For scaling after achieving product-market fit and early traction metrics.', fit: 72 },
        { type: 'Government Grants', name: 'Startup India, BIRAC', description: 'Non-dilutive funding for innovative startups in priority sectors.', fit: 65 },
      ],
    },
    successProbability,
  };
}

export const EXAMPLE_IDEAS = [
  {
    name: 'AI Interview Coach',
    description: 'An AI-powered platform that automatically prepares students for technical interviews with personalized mock interviews, real-time feedback, and career roadmaps.',
    industry: 'EdTech',
    targetAudience: 'Students & Job Seekers',
  },
  {
    name: 'SmartPay India',
    description: 'A unified payment and financial planning platform for freelancers and small businesses with AI-powered expense tracking and tax optimization.',
    industry: 'FinTech',
    targetAudience: 'Freelancers & Small Businesses',
  },
  {
    name: 'HealthSync AI',
    description: 'An AI health companion that provides continuous health monitoring, personalized wellness plans, and connects users with doctors for teleconsultations.',
    industry: 'HealthTech',
    targetAudience: 'Health-conscious Individuals',
  },
  {
    name: 'D2C Launchpad',
    description: 'An AI-powered social commerce platform that helps small businesses and artisans launch online stores with automated marketing and social media integration.',
    industry: 'E-Commerce',
    targetAudience: 'Small Businesses & Artisans',
  },
  {
    name: 'FlowAI Workspace',
    description: 'An AI-first project management and team collaboration tool that learns team workflows and automatically suggests optimizations.',
    industry: 'SaaS',
    targetAudience: 'Remote Teams & Startups',
  },
];
