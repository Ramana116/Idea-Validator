# ❓ Frequently Asked Questions

Everything you need to know about AI Startup Idea Validator.

---

## 📋 Table of Contents

1. [General](#general)
2. [Features](#features)
3. [Pricing](#pricing)
4. [Technical](#technical)
5. [Privacy & Security](#privacy--security)
6. [Business & Enterprise](#business--enterprise)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

---

## General

### What is AI Startup Idea Validator?

AI Startup Idea Validator is an intelligent platform that helps entrepreneurs, students, and founders evaluate whether a startup idea is worth pursuing before investing time and money.

Think of it as a virtual startup consultant that analyzes your idea in 15 minutes instead of 15 months.

### How does it work?

1. Enter your startup idea
2. Our AI analyzes 15+ factors (market, competition, revenue, risks, etc.)
3. Receive a comprehensive validation report
4. Get actionable insights and next steps

### Who is this for?

- **First-time founders** validating their first idea
- **Student entrepreneurs** working on class projects
- **Serial entrepreneurs** testing multiple ideas quickly
- **Startup accelerators** evaluating applications
- **Venture capitalists** screening deals
- **Business students** learning validation
- **Innovation teams** in corporations

### Is it really free?

**Yes!** The core validation features are 100% free forever.

We may introduce a Pro tier in the future with advanced features, but the essential validation tools will always be free.

### How accurate is the analysis?

Our AI is trained on:
- 10,000+ startup case studies
- Industry benchmarks
- Market research data
- Startup failure/success patterns

While no tool can predict the future with 100% accuracy, our validation score correlates strongly with startup success factors identified in research.

**Remember:** This is a decision-support tool, not a crystal ball. Use it alongside customer interviews and market research.

---

## Features

### What does the validation score mean?

The validation score (0-100) represents the overall viability of your startup idea based on:

- **Market Demand** (40% weight)
- **Competition** (20% weight)
- **Revenue Potential** (20% weight)
- **Scalability** (10% weight)
- **Innovation** (10% weight)

**Score Interpretation:**
- **80-100**: Excellent - Recommended for development
- **60-79**: Good - Needs some refinement
- **40-59**: Moderate - Consider pivoting
- **0-39**: Low - Don't build (yet)

### How many ideas can I analyze?

**Free tier:** Unlimited analyses

**Pro tier (coming soon):** Priority processing, advanced features

### Can I save my analyses?

Yes! All analyses are automatically saved to your browser's localStorage.

- Access via History panel (⌘H)
- Search and filter saved analyses
- Export history as JSON
- Maximum 20 items stored locally

### What export formats are available?

| Format | Available For | Quality |
|--------|---------------|---------|
| **PDF** | Pitch Deck, Business Plan, Full Report | High (print-ready) |
| **Word** | Business Plan | High (editable) |
| **PNG** | Individual Slides | High (images) |
| **JSON** | Data & Analytics | Raw data |

### Can I compare multiple ideas?

Yes! Use the History panel to:
1. Save multiple analyses
2. Open them side-by-side
3. Compare scores and metrics
4. Identify the strongest idea

### Does it support all industries?

Currently optimized for:
- EdTech
- FinTech
- HealthTech
- E-Commerce
- SaaS / B2B

Other industries are supported with generalized analysis. Industry-specific models coming soon.

---

## Pricing

### Is it really free?

**Yes!** Core features are 100% free:
- Unlimited analyses
- All 15 AI modules
- Basic exports (PDF, PNG)
- History management
- AI Mentor chatbot

### What's included in Pro? (Coming Soon)

**Pro Tier** ($29/month):
- Priority processing
- Advanced exports (Word, JSON)
- Team collaboration
- Cloud storage
- API access
- Custom branding
- Priority support

### Do you offer discounts?

- **Students**: 50% off with .edu email
- **Non-profits**: 50% off
- **Accelerators**: Custom enterprise pricing
- **Annual billing**: 2 months free

---

## Technical

### What browsers are supported?

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Opera | 76+ | ✅ Supported |
| IE 11 | Any | ❌ Not Supported |

### Do I need to install anything?

**No!** It's a web application. Just visit [startupvalidator.ai](https://startupvalidator.ai) and start analyzing.

For developers who want to self-host:
```bash
git clone https://github.com/startup-validator/startup-validator.git
npm install
npm run build
```

### Can I self-host?

**Yes!** The codebase is open-source under MIT license.

Self-hosting instructions:
1. Clone the repository
2. Install dependencies
3. Build for production
4. Deploy to your hosting

See [Deployment Guide](docs/DEPLOYMENT.md) for details.

### What's the tech stack?

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State**: React Hooks
- **Storage**: LocalStorage + IndexedDB

### Is there an API?

**API v1** coming Q2 2026.

Features will include:
- Programmatic idea analysis
- Batch processing
- Custom integrations
- Webhook support

Join waitlist: [startupvalidator.ai/api](https://startupvalidator.ai/api)

### Can I use this offline?

**Partially.** Service worker support is coming in Q2 2026.

Currently:
- Initial load requires internet
- Saved analyses work offline
- Exports work offline

---

## Privacy & Security

### What data do you collect?

We collect minimal data:
- Your startup idea (for analysis)
- Browser analytics (anonymous)
- Error logs (for debugging)

We do NOT collect:
- Personal information (unless you sign up)
- Payment information (it's free!)
- Browsing history
- Location data

### Where is my data stored?

- **Analyses**: Stored locally in your browser (localStorage)
- **Exports**: Generated client-side, never uploaded
- **Analytics**: Aggregated and anonymized

We do not sell or share your data with third parties.

### Is my idea safe?

**Yes.** Your startup ideas are:
- Stored only in your browser
- Never sent to our servers (current version)
- Not shared with third parties
- Deleted when you clear browser data

For enterprise customers, we offer:
- Private cloud deployment
- Data encryption at rest
- SOC 2 compliance (Q3 2026)

### Do you use my ideas to train AI?

**No.** We do not use your startup ideas to train our AI models.

Each analysis is independent and confidential.

---

## Business & Enterprise

### Do you offer enterprise plans?

**Yes!** Enterprise plans include:
- Private deployment
- Custom integrations
- SSO/SAML authentication
- Dedicated support
- SLA guarantees
- Custom branding

Contact: enterprise@startupvalidator.ai

### Can I white-label this?

**Yes.** White-label solutions available for:
- Universities
- Accelerators
- Venture capital firms
- Corporations

Contact: partnerships@startupvalidator.ai

### Do you offer educational licenses?

**Yes!** Free educational licenses for:
- Universities
- Bootcamps
- High schools
- Online courses

Apply at: education@startupvalidator.ai

### Can I integrate this into my platform?

**API coming Q2 2026.**

Until then, you can:
- Self-host the open-source version
- Embed via iframe (contact us)
- Partner program (coming soon)

---

## Troubleshooting

### Why is my analysis taking so long?

Normal analysis time is 2-3 seconds.

If it's taking longer:
1. Check your internet connection
2. Refresh the page
3. Clear browser cache
4. Try a different browser
5. Disable ad blockers

If problem persists, contact support.

### My export failed. What do I do?

Try these steps:
1. Refresh the page
2. Try a different export format
3. Check browser permissions
4. Clear browser cache
5. Try incognito mode

Still failing? Contact support with:
- Browser name and version
- Error message (if any)
- Screenshot of the issue

### I lost my analysis history. Can you recover it?

History is stored in your browser's localStorage.

If lost:
1. Check if you cleared browser data
2. Try the same browser/device
3. Check for JSON exports you may have saved

**Pro tip:** Export your history regularly as backup.

### The charts aren't loading

Try these solutions:
1. Disable ad blockers
2. Check browser console for errors
3. Try a different browser
4. Clear cache and cookies
5. Check JavaScript is enabled

### Can't login / authentication issues

Currently, the platform doesn't require login.

Cloud storage with authentication coming Q2 2026.

---

## Contributing

### How can I contribute?

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md).

Ways to contribute:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Share with others

### Do you have a bug bounty program?

**Coming Q2 2026.**

Report security issues to: security@startupvalidator.ai

See [Security Policy](SECURITY.md) for details.

### Can I suggest features?

**Yes!** Submit feature requests on GitHub:
[github.com/startup-validator/issues](https://github.com/startup-validator/issues)

Or vote on existing requests to help prioritize.

---

## Still Have Questions?

### Contact Support

- **Email**: support@startupvalidator.ai
- **Twitter**: [@StartupValidator](https://twitter.com/StartupValidator)
- **Discord**: [Join Community](https://discord.gg/yourinvite)
- **Documentation**: [docs.startupvalidator.ai](https://docs.startupvalidator.ai)

### Response Times

| Channel | Response Time |
|---------|---------------|
| Email | 24-48 hours |
| Twitter | 12-24 hours |
| Discord | 1-4 hours |
| GitHub Issues | 24-72 hours |

### Community

Join our community for:
- Tips and tricks
- Feature announcements
- Peer support
- Networking with founders

[Join Discord →](https://discord.gg/yourinvite)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
