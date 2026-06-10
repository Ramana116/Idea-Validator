// Action Item & Task Generator

import type { AnalysisResult } from './mockData';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Validation' | 'Product' | 'Marketing' | 'Fundraising' | 'Operations' | 'Legal';
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  dueInDays: number;
  completed: boolean;
  dependencies: string[];
}

export interface ActionPlan {
  week1: Task[];
  week2to4: Task[];
  month2to3: Task[];
  month4to6: Task[];
  totalTasks: number;
  totalHours: number;
  criticalPath: string[];
}

export function generateActionPlan(analysis: AnalysisResult): ActionPlan {
  const tasks: Task[] = [];
  const { idea, validationScore, market, gaps, risks } = analysis;

  // Week 1: Immediate Validation Tasks
  if (validationScore < 70) {
    tasks.push(
      {
        id: 't1',
        title: 'Conduct 10 Customer Interviews',
        description: 'Use the Mom Test framework. Focus on understanding the problem, not pitching your solution.',
        category: 'Validation',
        priority: 'High',
        estimatedHours: 10,
        dueInDays: 7,
        completed: false,
        dependencies: [],
      },
      {
        id: 't2',
        title: 'Create Landing Page',
        description: 'Build a simple landing page describing the problem and solution. Include email capture.',
        category: 'Validation',
        priority: 'High',
        estimatedHours: 8,
        dueInDays: 5,
        completed: false,
        dependencies: [],
      },
      {
        id: 't3',
        title: 'Run Problem Validation Survey',
        description: 'Share survey with 50+ target customers. Aim for 20+ responses.',
        category: 'Validation',
        priority: 'High',
        estimatedHours: 5,
        dueInDays: 7,
        completed: false,
        dependencies: ['t2'],
      }
    );
  }

  // Product Tasks
  tasks.push(
    {
      id: 't4',
      title: 'Define MVP Scope',
      description: `Focus on solving the core problem: ${gaps[0]?.area || idea.description.substring(0, 50)}...`,
      category: 'Product',
      priority: 'High',
      estimatedHours: 4,
      dueInDays: 10,
      completed: false,
      dependencies: ['t1'],
    },
    {
      id: 't5',
      title: 'Create Wireframes',
      description: 'Map out user flows for core features. Use Figma or similar tool.',
      category: 'Product',
      priority: 'Medium',
      estimatedHours: 8,
      dueInDays: 14,
      completed: false,
      dependencies: ['t4'],
    },
    {
      id: 't6',
      title: 'Build MVP Prototype',
      description: 'Create clickable prototype or basic functional MVP.',
      category: 'Product',
      priority: 'High',
      estimatedHours: 40,
      dueInDays: 30,
      completed: false,
      dependencies: ['t5'],
    }
  );

  // Marketing Tasks
  tasks.push(
    {
      id: 't7',
      title: 'Set Up Social Media Presence',
      description: 'Create profiles on LinkedIn, Twitter, and relevant platforms for your audience.',
      category: 'Marketing',
      priority: 'Medium',
      estimatedHours: 3,
      dueInDays: 7,
      completed: false,
      dependencies: [],
    },
    {
      id: 't8',
      title: 'Start Content Marketing',
      description: 'Write 2-3 articles about the problem space. Share on LinkedIn and relevant communities.',
      category: 'Marketing',
      priority: 'Medium',
      estimatedHours: 6,
      dueInDays: 14,
      completed: false,
      dependencies: [],
    },
    {
      id: 't9',
      title: 'Build Waitlist',
      description: 'Aim for 100+ emails before launch. Use Product Hunt, Twitter, and direct outreach.',
      category: 'Marketing',
      priority: 'High',
      estimatedHours: 10,
      dueInDays: 30,
      completed: false,
      dependencies: ['t2'],
    }
  );

  // Fundraising Tasks (if score is good)
  if (validationScore >= 70) {
    tasks.push(
      {
        id: 't10',
        title: 'Create Investor Deck',
        description: 'Use the generated pitch deck. Customize with real traction data.',
        category: 'Fundraising',
        priority: 'Medium',
        estimatedHours: 8,
        dueInDays: 21,
        completed: false,
        dependencies: ['t6'],
      },
      {
        id: 't11',
        title: 'Research Investors',
        description: `Focus on ${market.tam} market investors. Look for those who invest in ${analysis.industry.industry}.`,
        category: 'Fundraising',
        priority: 'Medium',
        estimatedHours: 5,
        dueInDays: 28,
        completed: false,
        dependencies: [],
      }
    );
  }

  // Risk Mitigation Tasks
  risks.filter(r => r.severity === 'High').forEach((risk, i) => {
    tasks.push({
      id: `t${20 + i}`,
      title: `Address Risk: ${risk.title}`,
      description: risk.solution,
      category: 'Operations',
      priority: 'High',
      estimatedHours: 8,
      dueInDays: 21,
      completed: false,
      dependencies: [],
    });
  });

  // Month 2-3 Tasks
  const month2to3: Task[] = [
    {
      id: 't30',
      title: 'Launch Beta to Waitlist',
      description: 'Invite 50-100 users from waitlist. Gather feedback aggressively.',
      category: 'Product',
      priority: 'High',
      estimatedHours: 20,
      dueInDays: 60,
      completed: false,
      dependencies: ['t6', 't9'],
    },
    {
      id: 't31',
      title: 'Implement Feedback Loop',
      description: 'Set up regular user interviews. Aim for 5 interviews per week.',
      category: 'Validation',
      priority: 'High',
      estimatedHours: 10,
      dueInDays: 45,
      completed: false,
      dependencies: ['t30'],
    },
    {
      id: 't32',
      title: 'Define Key Metrics',
      description: 'Set up analytics. Track activation, retention, and referral metrics.',
      category: 'Operations',
      priority: 'High',
      estimatedHours: 5,
      dueInDays: 50,
      completed: false,
      dependencies: ['t30'],
    },
  ];

  // Month 4-6 Tasks
  const month4to6: Task[] = [
    {
      id: 't40',
      title: 'Achieve Product-Market Fit Signals',
      description: 'Target: 40%+ users would be "very disappointed" without your product.',
      category: 'Validation',
      priority: 'High',
      estimatedHours: 30,
      dueInDays: 120,
      completed: false,
      dependencies: ['t31'],
    },
    {
      id: 't41',
      title: 'Launch Publicly',
      description: 'Product Hunt launch, press outreach, social media push.',
      category: 'Marketing',
      priority: 'High',
      estimatedHours: 20,
      dueInDays: 90,
      completed: false,
      dependencies: ['t30', 't32'],
    },
    {
      id: 't42',
      title: 'Raise Pre-Seed/Seed',
      description: 'If traction is good, start fundraising conversations.',
      category: 'Fundraising',
      priority: 'Medium',
      estimatedHours: 40,
      dueInDays: 120,
      completed: false,
      dependencies: ['t40'],
    },
  ];

  // Calculate totals
  const allTasks = [...tasks, ...month2to3, ...month4to6];
  const totalHours = allTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

  // Critical path
  const criticalPath = [
    'Customer Interviews →',
    'MVP Development →',
    'Beta Launch →',
    'Feedback Iteration →',
    'Public Launch',
  ];

  return {
    week1: tasks.filter(t => t.dueInDays <= 7),
    week2to4: tasks.filter(t => t.dueInDays > 7 && t.dueInDays <= 30),
    month2to3,
    month4to6,
    totalTasks: allTasks.length,
    totalHours,
    criticalPath,
  };
}

export function getQuickWins(analysis: AnalysisResult): {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  timeToComplete: string;
}[] {
  const quickWins: any[] = [];

  // Based on gaps
  analysis.gaps.forEach(gap => {
    if (gap.opportunityScore >= 85) {
      quickWins.push({
        title: `Exploit Gap: ${gap.area}`,
        description: gap.description,
        impact: 'High',
        effort: 'Medium',
        timeToComplete: '2-4 weeks',
      });
    }
  });

  // Based on low validation score
  if (analysis.validationScore < 70) {
    quickWins.push({
      title: 'Validate Problem First',
      description: 'Before building, confirm the problem is real and painful through customer interviews.',
      impact: 'High',
      effort: 'Low',
      timeToComplete: '1 week',
    });
  }

  // Based on high risks
  const highRisks = analysis.risks.filter(r => r.severity === 'High');
  if (highRisks.length > 0) {
    quickWins.push({
      title: 'Mitigate Top Risk',
      description: highRisks[0].solution,
      impact: 'High',
      effort: 'Medium',
      timeToComplete: '2-3 weeks',
    });
  }

  // Based on market demand
  if (analysis.market.demandScore >= 80) {
    quickWins.push({
      title: 'Capitalize on High Demand',
      description: 'Market shows strong demand. Focus on rapid MVP and early user acquisition.',
      impact: 'High',
      effort: 'Medium',
      timeToComplete: '4-6 weeks',
    });
  }

  // Always add these
  quickWins.push(
    {
      title: 'Create Landing Page',
      description: 'Simple page with value prop and email capture. Test messaging.',
      impact: 'Medium',
      effort: 'Low',
      timeToComplete: '1-2 days',
    },
    {
      title: 'Talk to 10 Customers',
      description: 'Use Mom Test questions. Record insights. Look for patterns.',
      impact: 'High',
      effort: 'Low',
      timeToComplete: '3-5 days',
    },
    {
      title: 'Set Up Analytics',
      description: 'Google Analytics, Mixpanel, or similar. Track everything from day one.',
      impact: 'Medium',
      effort: 'Low',
      timeToComplete: '1 day',
    }
  );

  return quickWins.slice(0, 5);
}

export function generateChecklist(_analysis: AnalysisResult): {
  category: string;
  items: { text: string; checked: boolean; critical: boolean }[];
}[] {
  return [
    {
      category: 'Problem Validation',
      items: [
        { text: 'Spoke to 10+ potential customers', checked: false, critical: true },
        { text: 'Confirmed problem is painful (8/10+ rating)', checked: false, critical: true },
        { text: 'Customers are actively seeking solutions', checked: false, critical: true },
        { text: 'Validated willingness to pay', checked: false, critical: true },
        { text: 'Collected 50+ survey responses', checked: false, critical: false },
      ],
    },
    {
      category: 'Solution Validation',
      items: [
        { text: 'Created landing page with value prop', checked: false, critical: true },
        { text: 'Got 100+ email signups', checked: false, critical: false },
        { text: 'Built MVP or prototype', checked: false, critical: true },
        { text: 'Got 10+ users actively using MVP', checked: false, critical: true },
        { text: 'Achieved 40%+ "very disappointed" score', checked: false, critical: true },
      ],
    },
    {
      category: 'Market Validation',
      items: [
        { text: 'Calculated TAM/SAM/SOM', checked: false, critical: false },
        { text: 'Identified top 5 competitors', checked: false, critical: true },
        { text: 'Defined unique differentiation', checked: false, critical: true },
        { text: 'Validated market growth trends', checked: false, critical: false },
        { text: 'Confirmed timing is right', checked: false, critical: true },
      ],
    },
    {
      category: 'Business Model',
      items: [
        { text: 'Defined pricing strategy', checked: false, critical: true },
        { text: 'Calculated unit economics', checked: false, critical: true },
        { text: 'LTV:CAC ratio > 3:1 projected', checked: false, critical: false },
        { text: 'Identified primary revenue stream', checked: false, critical: true },
        { text: 'Created financial projections', checked: false, critical: false },
      ],
    },
    {
      category: 'Fundraising Readiness',
      items: [
        { text: 'Created pitch deck', checked: false, critical: true },
        { text: 'Built financial model', checked: false, critical: false },
        { text: 'Identified target investors', checked: false, critical: false },
        { text: 'Has traction metrics to show', checked: false, critical: true },
        { text: 'Legal entity established', checked: false, critical: false },
      ],
    },
  ];
}

export function getTimeToMilestone(analysis: AnalysisResult, milestone: string): {
  estimatedDays: number;
  confidence: 'High' | 'Medium' | 'Low';
  dependencies: string[];
  blockers: string[];
} {
  const baseDays: Record<string, number> = {
    'First 10 Users': 14,
    'First 100 Users': 45,
    'First 1000 Users': 90,
    'First Paying Customer': 30,
    '$1K MRR': 60,
    '$10K MRR': 180,
    'Product-Market Fit': 120,
    'Seed Funding': 150,
  };

  const multiplier = analysis.validationScore >= 80 ? 0.8 : analysis.validationScore >= 60 ? 1 : 1.3;
  const base = baseDays[milestone] || 90;
  const estimatedDays = Math.round(base * multiplier);

  const confidence = analysis.validationScore >= 80 ? 'High' : analysis.validationScore >= 60 ? 'Medium' : 'Low';

  const dependencies = [
    'Complete customer interviews',
    'Build MVP',
    'Launch to early users',
    'Iterate based on feedback',
  ].slice(0, Math.ceil(estimatedDays / 30));

  const blockers = analysis.risks
    .filter(r => r.severity === 'High')
    .map(r => r.title)
    .slice(0, 3);

  return { estimatedDays, confidence, dependencies, blockers };
}
