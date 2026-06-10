// Customer Discovery & Validation Tools

export interface CustomerPersona {
  name: string;
  demographics: string[];
  psychographics: string[];
  painPoints: string[];
  goals: string[];
  behaviors: string[];
  preferredChannels: string[];
  quote: string;
}

export interface InterviewQuestion {
  category: 'Problem' | 'Solution' | 'Pricing' | 'Competition' | 'Behavior';
  question: string;
  followUp: string[];
  whatToListenFor: string;
}

export interface SurveyTemplate {
  title: string;
  description: string;
  questions: {
    type: 'multiple_choice' | 'rating' | 'open_ended' | 'scale';
    question: string;
    options?: string[];
    required: boolean;
  }[];
}

export function generateCustomerPersona(industry: string, _targetAudience: string): CustomerPersona {
  const personas: Record<string, CustomerPersona> = {
    edtech: {
      name: 'Aspiring Engineer Arjun',
      demographics: ['Age 20-25', 'Engineering student or recent graduate', 'Tier 2/3 city in India', 'Middle-income family'],
      psychographics: ['Career-focused', 'Anxious about job market', 'Willing to invest in self-improvement', 'Tech-savvy'],
      painPoints: ['Fear of failing technical interviews', 'Lack of structured preparation', 'No personalized feedback', 'Can\'t afford expensive coaching'],
      goals: ['Land first tech job', 'Build confidence', 'Learn industry-relevant skills', 'Get mentorship'],
      behaviors: ['Spends 3-4 hours daily on LeetCode', 'Watches YouTube tutorials', 'Active on LinkedIn', 'Joins Discord communities'],
      preferredChannels: ['YouTube', 'Instagram', 'LinkedIn', 'College WhatsApp groups'],
      quote: 'I\'ve been preparing for 6 months but still don\'t know if I\'m ready. I need someone to tell me what I\'m missing.',
    },
    fintech: {
      name: 'Freelancer Priya',
      demographics: ['Age 25-35', 'Digital nomad or remote worker', 'Urban metro city', '₹5-15 Lakh annual income'],
      psychographics: ['Values flexibility', 'Financially conscious', 'Early tech adopter', 'Overwhelmed by complexity'],
      painPoints: ['Irregular income makes planning hard', 'Tax compliance is confusing', 'No employee benefits', 'Banking is not freelancer-friendly'],
      goals: ['Stable cash flow', 'Tax optimization', 'Build emergency fund', 'Access credit easily'],
      behaviors: ['Uses multiple payment apps', 'Tracks expenses in spreadsheets', 'Researches financial products online', 'Asks peers for recommendations'],
      preferredChannels: ['Twitter', 'LinkedIn', 'Finance blogs', 'Podcast recommendations'],
      quote: 'I make good money but have no idea if I\'m saving enough or paying the right taxes. I need simplicity.',
    },
    healthtech: {
      name: 'Health-Conscious Rohan',
      demographics: ['Age 30-45', 'Working professional', 'Urban area', 'Upper-middle income'],
      psychographics: ['Proactive about health', 'Busy schedule', 'Skeptical of quick fixes', 'Data-driven decisions'],
      painPoints: ['No time for regular checkups', 'Conflicting health information online', 'Expensive healthcare', 'Reactive not preventive care'],
      goals: ['Prevent chronic diseases', 'Manage stress', 'Stay fit despite busy schedule', 'Reduce healthcare costs'],
      behaviors: ['Uses fitness trackers', 'Reads health articles', 'Orders medicines online', 'Consults Dr. Google before doctors'],
      preferredChannels: ['Google Search', 'Health apps', 'Doctor recommendations', 'Family WhatsApp forwards'],
      quote: 'I know I should take care of my health but between work and family, it always gets pushed to tomorrow.',
    },
    saas: {
      name: 'Startup Founder Meera',
      demographics: ['Age 28-40', 'B2B SaaS founder', 'Bangalore/Gurgaon/Pune', 'Seed to Series A stage'],
      psychographics: ['Growth-obsessed', 'Resource-constrained', 'Data-driven', 'Network-oriented'],
      painPoints: ['Too many tools, not enough time', 'Hard to measure ROI', 'Team adoption challenges', 'Budget constraints'],
      goals: ['Scale efficiently', 'Improve team productivity', 'Reduce tool sprawl', 'Get actionable insights'],
      behaviors: ['Reads Product Hunt daily', 'Active on Twitter startup community', 'Attends founder meetups', 'Experiments with new tools'],
      preferredChannels: ['Twitter', 'Product Hunt', 'Founder communities', 'SaaS review sites'],
      quote: 'I need tools that solve real problems, not add to my notification fatigue. Show me ROI in week one.',
    },
  };

  const key = Object.keys(personas).find(k => industry.toLowerCase().includes(k)) || 'saas';
  return personas[key];
}

export function generateInterviewQuestions(stage: 'problem' | 'solution' | 'pricing'): InterviewQuestion[] {
  const problemQuestions: InterviewQuestion[] = [
    {
      category: 'Problem',
      question: 'Tell me about the last time you encountered [problem].',
      followUp: ['What were you trying to accomplish?', 'How did you solve it?', 'How much did that solution cost?'],
      whatToListenFor: 'Specific examples, not hypotheticals. Emotional language indicates real pain.',
    },
    {
      category: 'Problem',
      question: 'How do you currently handle [problem] today?',
      followUp: ['What do you like about your current approach?', 'What frustrates you?', 'How much time does it take?'],
      whatToListenFor: 'Workarounds indicate pain. If no current solution, problem may not be urgent.',
    },
    {
      category: 'Problem',
      question: 'On a scale of 1-10, how painful is this problem for you?',
      followUp: ['Why not lower?', 'What would make it a 10?', 'Have you tried to solve it before?'],
      whatToListenFor: '8+ indicates must-have. Below 6 is nice-to-have.',
    },
    {
      category: 'Behavior',
      question: 'What other solutions have you tried?',
      followUp: ['Why did you stop using them?', 'What did you like/dislike?', 'How much did you pay?'],
      whatToListenFor: 'Willingness to pay for solutions. Specific complaints about competitors.',
    },
  ];

  const solutionQuestions: InterviewQuestion[] = [
    {
      category: 'Solution',
      question: 'If you had a magic wand, what would the perfect solution look like?',
      followUp: ['What\'s the most important feature?', 'What would you not pay for?', 'How would you discover it?'],
      whatToListenFor: 'Must-have vs nice-to-have features. Discovery channels.',
    },
    {
      category: 'Solution',
      question: 'Here\'s what we\'re building [describe]. What\'s your immediate reaction?',
      followUp: ['What excites you?', 'What concerns you?', 'What\'s missing?'],
      whatToListenFor: 'Genuine excitement vs polite interest. Specific concerns to address.',
    },
    {
      category: 'Solution',
      question: 'Would you be willing to try a beta version?',
      followUp: ['What would you need to see first?', 'Can I have your email?', 'Would you pay for early access?'],
      whatToListenFor: 'Commitment signals. Email = real interest. Payment = very real interest.',
    },
  ];

  const pricingQuestions: InterviewQuestion[] = [
    {
      category: 'Pricing',
      question: 'What do you currently spend on solving this problem?',
      followUp: ['Is that expensive or reasonable?', 'What would you pay to eliminate it entirely?', 'What\'s your budget for this?'],
      whatToListenFor: 'Anchor prices. Budget constraints. Value perception.',
    },
    {
      category: 'Pricing',
      question: 'At what price would this be too expensive?',
      followUp: ['Why?', 'What would make it worth that price?', 'Have you paid that for similar solutions?'],
      whatToListenFor: 'Price ceiling. Value drivers.',
    },
    {
      category: 'Pricing',
      question: 'At what price would this be such a good deal you\'d buy immediately?',
      followUp: ['Why that price?', 'What assumptions are you making?', 'How does that compare to alternatives?'],
      whatToListenFor: 'Price floor. Perceived value baseline.',
    },
    {
      category: 'Pricing',
      question: 'Would you prefer monthly or annual billing?',
      followUp: ['Why?', 'What discount would make annual attractive?', 'What payment methods do you prefer?'],
      whatToListenFor: 'Cash flow preferences. Discount sensitivity.',
    },
  ];

  if (stage === 'problem') return problemQuestions;
  if (stage === 'solution') return [...problemQuestions, ...solutionQuestions];
  return [...problemQuestions, ...solutionQuestions, ...pricingQuestions];
}

export function generateSurveyTemplate(industry: string): SurveyTemplate {
  return {
    title: `${industry} Problem Validation Survey`,
    description: 'Help us understand if we\'re solving a real problem. Takes 3 minutes.',
    questions: [
      {
        type: 'multiple_choice',
        question: 'How do you currently handle [core problem]?',
        options: ['I have a systematic approach', 'I deal with it ad-hoc', 'I ignore it mostly', 'I pay someone to handle it', 'Other'],
        required: true,
      },
      {
        type: 'scale',
        question: 'How painful is this problem for you?',
        options: ['1 (Not painful)', '2', '3', '4', '5 (Very painful)'],
        required: true,
      },
      {
        type: 'multiple_choice',
        question: 'How much have you spent trying to solve this in the past year?',
        options: ['Nothing', '₹1,000-5,000', '₹5,000-20,000', '₹20,000-50,000', '₹50,000+'],
        required: true,
      },
      {
        type: 'rating',
        question: 'How satisfied are you with current solutions?',
        options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
        required: true,
      },
      {
        type: 'open_ended',
        question: 'What\'s the biggest frustration with how you handle this today?',
        required: true,
      },
      {
        type: 'multiple_choice',
        question: 'If a solution existed that [value proposition], how likely would you be to try it?',
        options: ['Definitely would not try', 'Probably would not try', 'Might try', 'Probably would try', 'Definitely would try'],
        required: true,
      },
      {
        type: 'open_ended',
        question: 'What would your ideal solution look like?',
        required: false,
      },
      {
        type: 'multiple_choice',
        question: 'What\'s a reasonable monthly price for a solution that solves this?',
        options: ['₹0-299', '₹300-599', '₹600-999', '₹1,000-2,000', '₹2,000+'],
        required: true,
      },
      {
        type: 'open_ended',
        question: 'Anything else you\'d like to share about this problem?',
        required: false,
      },
    ],
  };
}

export function generateLandingPageCopy(idea: { name: string; description: string; targetAudience: string }): {
  headline: string;
  subheadline: string;
  valueProps: string[];
  cta: string;
  socialProof: string;
} {
  return {
    headline: `Stop ${idea.name.includes('Interview') ? 'Struggling with Interviews' : 'Wasting Time on Ineffective Solutions'}`,
    subheadline: idea.description,
    valueProps: [
      'Save 10+ hours per week',
      'Get personalized, AI-powered guidance',
      'Join 10,000+ early access users',
      '30-day money-back guarantee',
    ],
    cta: 'Join Waitlist - Get Early Access',
    socialProof: 'Trusted by students from IITs, NITs, and leading companies',
  };
}

export function calculateValidationScore(responses: {
  problemSeverity: number; // 1-5
  currentSpend: number; // 0-4 scale
  satisfaction: number; // 1-5 (inverted - lower is better)
  interest: number; // 1-5
  willingnessToPay: number; // 0-4 scale
}): {
  score: number;
  verdict: string;
  nextSteps: string[];
} {
  const maxScore = 25;
  const score = 
    responses.problemSeverity +
    responses.currentSpend +
    (6 - responses.satisfaction) + // Invert satisfaction
    responses.interest +
    responses.willingnessToPay;

  const percentage = (score / maxScore) * 100;

  let verdict = '';
  const nextSteps: string[] = [];

  if (percentage >= 80) {
    verdict = '🚀 Strong Validation - Build It!';
    nextSteps.push('Start building MVP immediately', 'Collect emails from interested users', 'Consider pre-selling to validate willingness to pay', 'Document all customer interviews for investor deck');
  } else if (percentage >= 60) {
    verdict = '⚠️ Moderate Validation - Iterate First';
    nextSteps.push('Conduct 10 more interviews to confirm patterns', 'Refine value proposition based on feedback', 'Test different pricing points', 'Build landing page to gauge interest');
  } else if (percentage >= 40) {
    verdict = '❓ Weak Validation - Pivot or Persevere';
    nextSteps.push('Problem may not be painful enough', 'Consider targeting different customer segment', 'Reframe the problem or solution', 'Consider pivoting to adjacent problem');
  } else {
    verdict = '🛑 No Validation - Don\'t Build';
    nextSteps.push('This problem isn\'t painful enough', 'Look for problems people are already paying to solve', 'Talk to 20 more potential customers', 'Consider a completely different idea');
  }

  return { score: Math.round(percentage), verdict, nextSteps };
}

export const MOM_TEST_PRINCIPLES = [
  {
    principle: 'Talk about their life, not your idea',
    explanation: 'The goal is to learn about their problems, not pitch your solution.',
  },
  {
    principle: 'Ask about specific past behavior, not hypothetical future',
    explanation: '"Tell me about the last time..." not "Would you ever..."',
  },
  {
    principle: 'Listen more than you talk',
    explanation: 'Aim for 80/20 split - they talk 80% of the time.',
  },
  {
    principle: 'Avoid leading questions',
    explanation: 'Don\'t ask "Don\'t you think this is a problem?" - it invites agreement.',
  },
  {
    principle: 'Seek truth, not validation',
    explanation: 'It\'s better to learn your idea is bad now than after building it.',
  },
];
