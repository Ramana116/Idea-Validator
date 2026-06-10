# 🚀 Getting Started with AI Startup Idea Validator

Welcome! This guide will help you get up and running with the AI Startup Idea Validator in minutes.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [First Analysis](#first-analysis)
4. [Understanding Results](#understanding-results)
5. [Exporting Reports](#exporting-reports)
6. [Tips & Best Practices](#tips--best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Optional
- **VS Code**: Recommended code editor
- **Git**: For cloning the repository

### Check Your Setup

```bash
# Check Node.js version
node --version  # Should be v18.x or higher

# Check npm version
npm --version   # Should be v9.x or higher
```

---

## Installation

### Option 1: Use Live Demo (Recommended for First-Time Users)

Visit [startupvalidator.ai](https://startupvalidator.ai) and start analyzing immediately!

**No installation required. No signup. 100% free.**

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/startup-validator/startup-validator.git
cd startup-validator

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Option 3: Production Build

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview

# 4. Deploy dist/ folder to your hosting
```

---

## First Analysis

### Step 1: Enter Your Idea

Navigate to the landing page and fill in:

1. **Startup Name**: Your startup's name
2. **Industry**: Select from dropdown (EdTech, FinTech, HealthTech, etc.)
3. **Description**: Describe your idea in 1-2 sentences
4. **Target Audience**: Who will use your product?

**Example:**
```
Name: AI Interview Coach
Industry: EdTech
Description: An AI-powered platform that automatically prepares 
students for technical interviews with personalized mock interviews.
Target Audience: Students, Fresh Graduates, Job Seekers
```

### Step 2: Click "Analyze My Startup Idea"

The AI will analyze your idea in 15 minutes. You'll see:

- 6-step loading animation
- Multi-agent architecture visualization
- Real-time progress updates

### Step 3: Review Your Dashboard

After analysis, you'll see 12 tabs:

1. **Overview** - Validation scores and insights
2. **Market** - TAM/SAM/SOM, demand score
3. **Competitors** - Competitor analysis
4. **Revenue** - Financial projections
5. **Financial Model** - Detailed financials
6. **Customer Discovery** - Personas & interviews
7. **Task Planner** - Action plans
8. **Business** - SWOT, funding
9. **Risks** - Risk assessment
10. **Business Plan** - Complete plan
11. **Pitch Deck** - 11-slide deck
12. **AI Mentor** - Chat for Q&A

---

## Understanding Results

### Validation Score (0-100)

| Score | Meaning | Recommendation |
|-------|---------|----------------|
| **80-100** | Excellent | ✅ Recommended for development |
| **60-79** | Good | ⚠️ Needs refinement |
| **40-59** | Moderate | ❓ Pivot or persevere |
| **0-39** | Low | 🛑 Don't build (yet) |

### Market Metrics

- **TAM (Total Addressable Market)**: Total market demand
- **SAM (Serviceable Addressable Market)**: Your target segment
- **SOM (Serviceable Obtainable Market)**: Realistic first target

### Revenue Projections

Three scenarios provided:
- **Conservative**: Worst-case scenario
- **Expected**: Most likely scenario
- **Optimistic**: Best-case scenario

### Risk Assessment

Risks categorized by:
- 🔴 **High**: Address immediately
- 🟡 **Medium**: Plan to address
- 🟢 **Low**: Monitor

---

## Exporting Reports

### Export Pitch Deck

1. Navigate to **Pitch Deck** tab
2. Click **Download PDF** button
3. Or export individual slides as PNG

### Export Business Plan

1. Navigate to **Business Plan** tab
2. Choose **Export PDF** or **Export Word**
3. Download your document

### Export Analytics

1. Click **Analytics** button (top right)
2. Click **Export Analytics**
3. Download JSON file

### Export History

1. Open **History Panel** (⌘H)
2. Click **Export All**
3. Download JSON file

---

## Tips & Best Practices

### Writing Good Ideas

✅ **Do:**
- Be specific about the problem
- Include target audience
- Mention unique value proposition
- Keep it concise (2-3 sentences)

❌ **Don't:**
- Be too vague ("Uber for X")
- Skip target audience
- Write essays
- Use jargon

### Interpreting Results

1. **Look at all tabs**: Don't just focus on validation score
2. **Read the gaps**: These are your opportunities
3. **Review risks**: Plan mitigation strategies
4. **Compare scenarios**: Understand revenue range
5. **Use AI Mentor**: Ask questions about results

### Iterating on Ideas

1. Run initial analysis
2. Review gaps and risks
3. Refine your idea
4. Run analysis again
5. Compare results (use History)
6. Repeat until satisfied

### Using Financial Model

1. Adjust assumptions (price, conversion, churn)
2. Watch metrics update in real-time
3. Test different scenarios
4. Export for investor meetings

---

## Troubleshooting

### Common Issues

#### "Analysis is taking too long"
- **Solution**: Normal processing time is 2-3 seconds
- If > 10 seconds, refresh and try again

#### "Export failed"
- **Solution**: Check browser permissions
- Try a different browser
- Clear browser cache

#### "Can't save history"
- **Solution**: Check localStorage quota
- Clear old history items
- Use export to backup

#### "Charts not loading"
- **Solution**: Disable ad blockers
- Check browser console for errors
- Try incognito mode

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Supported |
| IE 11 | Any | ❌ Not Supported |

### Performance Tips

1. **Use modern browser**: Chrome/Firefox recommended
2. **Clear cache**: If experiencing slowness
3. **Disable extensions**: Some may interfere
4. **Check internet**: Required for initial load
5. **Use desktop**: Best experience on desktop/laptop

---

## Next Steps

### After Your First Analysis

1. ✅ **Review all 12 tabs** thoroughly
2. ✅ **Export pitch deck** for feedback
3. ✅ **Share with mentors** for input
4. ✅ **Run competitor ideas** for comparison
5. ✅ **Use task planner** to start execution

### Advanced Features

1. **Compare Ideas**: Analyze 2-3 variations
2. **Use Financial Model**: Test different assumptions
3. **Customer Discovery**: Generate interview questions
4. **AI Mentor**: Ask specific questions
5. **Track Progress**: Use history to track iterations

### Getting Help

- **Documentation**: [docs/startupvalidator.ai](https://docs.startupvalidator.ai)
- **Community**: [Discord](https://discord.gg/yourinvite)
- **Email**: support@startupvalidator.ai
- **Twitter**: [@StartupValidator](https://twitter.com/StartupValidator)

---

## Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **⌘H** | Open History |
| **⌘B** | Toggle Theme |
| **⌘K** | Search (coming soon) |
| **Esc** | Close modals |

### Key Metrics

| Metric | Target |
|--------|--------|
| Validation Score | 80+ |
| Market Demand | 70+ |
| LTV:CAC Ratio | 3:1+ |
| Runway | 18+ months |
| Success Probability | 70%+ |

---

**Ready to validate your idea?** [Start Now →](https://startupvalidator.ai)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
