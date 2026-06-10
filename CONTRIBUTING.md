# 🤝 Contributing to AI Startup Idea Validator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to creating a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- The use of sexualized language or imagery and unwelcome sexual attention
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/startup-validator.git
cd startup-validator
```

### 3. Set Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/startup-validator.git
git remote -v
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

---

## 💻 Development Setup

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version

### Recommended Tools

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
- **Chrome DevTools** for debugging
- **React Developer Tools** browser extension

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_EXPORT=true
```

---

## 🎯 How to Contribute

### Types of Contributions We Welcome

#### 1. **Bug Fixes** 🔧
- Fix issues listed in the [Issues](https://github.com/startup-validator/issues) page
- Look for labels: `bug`, `good first issue`, `help wanted`

#### 2. **New Features** ✨
- Propose features via GitHub Issues before starting
- Look for labels: `enhancement`, `feature request`

#### 3. **Documentation** 📚
- Improve README, guides, or code comments
- Fix typos or clarify instructions
- Add examples or tutorials

#### 4. **Performance Improvements** ⚡
- Optimize rendering
- Reduce bundle size
- Improve load times

#### 5. **Tests** ✅
- Write unit tests
- Add integration tests
- Improve test coverage

#### 6. **Design & UX** 🎨
- Improve UI components
- Enhance accessibility
- Better responsive design

---

## 📝 Pull Request Guidelines

### Before Submitting

1. **Check Existing PRs**: Make sure someone isn't already working on it
2. **Create an Issue**: For features, discuss before coding
3. **Update Documentation**: Reflect changes in docs
4. **Write Tests**: Ensure code is tested
5. **Run Linters**: `npm run lint`
6. **Test Locally**: `npm run dev` and test thoroughly

### PR Title Format

```
type(scope): description

Examples:
feat(dashboard): add financial modeling tab
fix(export): resolve PDF generation error
docs(readme): update installation instructions
perf(bundle): reduce initial load time by 40%
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Related Issue
Closes #ISSUE_NUMBER

## Testing Done
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Tested on mobile
- [ ] Tested accessibility

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests passing
```

---

## 💎 Coding Standards

### TypeScript

```typescript
// ✅ Good: Typed interfaces
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// ✅ Good: Proper error handling
async function fetchData(): Promise<Data> {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

// ❌ Bad: Any type
function processData(data: any) {
  // ...
}
```

### React Components

```typescript
// ✅ Good: Memoized component with proper types
interface Props {
  title: string;
  score: number;
}

export const ScoreCard = memo(function ScoreCard({ title, score }: Props) {
  return (
    <div className="score-card">
      <h3>{title}</h3>
      <p>{score}/100</p>
    </div>
  );
});

// ✅ Good: Custom hooks
function useAnalysis(id: string) {
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logic
  }, [id]);

  return { data, loading };
}
```

### CSS/Tailwind

```tsx
// ✅ Good: Consistent class ordering
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
  {/* content */}
</div>

// Order: layout → spacing → visual → interactive
```

### File Organization

```
components/
├── Feature/
│   ├── Feature.tsx          # Main component
│   ├── Feature.test.tsx     # Tests
│   ├── Feature.styles.ts    # Styles (if needed)
│   └── index.ts             # Exports
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- filename.test.tsx

# Watch mode
npm run test:watch
```

### Writing Tests

```typescript
// ✅ Good: Comprehensive test
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreCard } from './ScoreCard';

describe('ScoreCard', () => {
  it('renders title and score correctly', () => {
    render(<ScoreCard title="Test" score={85} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('85/100')).toBeInTheDocument();
  });

  it('applies correct color based on score', () => {
    const { container } = render(<ScoreCard title="Test" score={90} />);
    
    expect(container.firstChild).toHaveClass('text-emerald-400');
  });
});
```

### Test Coverage Goals

- **Components**: > 80%
- **Utils**: > 90%
- **Services**: > 85%
- **Overall**: > 85%

---

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates the validation score based on multiple factors
 * @param market - Market demand score (0-100)
 * @param competition - Competition analysis score (0-100)
 * @param revenue - Revenue potential score (0-100)
 * @returns Overall validation score (0-100)
 */
function calculateValidationScore(
  market: number,
  competition: number,
  revenue: number
): number {
  // Weighted average calculation
  return (market * 0.4 + competition * 0.3 + revenue * 0.3);
}
```

### README Updates

When adding features, update:
- Feature list in README
- Screenshots if UI changed
- API documentation if endpoints changed
- Changelog

---

## 🌟 Recognition

Contributors will be recognized in:

1. **README.md** - Contributors section
2. **Release Notes** - Mentioned in changelog
3. **Website** - Contributors page (coming soon)
4. **Social Media** - Shout-outs for major contributions

---

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **Discord**: [Join our community](https://discord.gg/yourinvite)
- **Email**: contributors@startupvalidator.ai
- **Discussions**: [GitHub Discussions](https://github.com/startup-validator/discussions)

### Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🎯 Areas Needing Contributions

### High Priority

- [ ] **Accessibility** - WCAG 2.1 AA compliance
- [ ] **Mobile Optimization** - Better mobile UX
- [ ] **Tests** - Increase test coverage to 90%
- [ ] **Documentation** - More examples and tutorials
- [ ] **Performance** - Further optimize bundle size

### Good First Issues

Look for issues labeled:
- 🟢 `good first issue`
- 🔵 `help wanted`
- 🟡 `beginner friendly`

---

## 📈 Contribution Stats

[![Contributors](https://img.shields.io/github/contributors/yourusername/startup-validator)](https://github.com/yourusername/startup-validator/graphs/contributors)
[![Last Commit](https://img.shields.io/github/last-commit/yourusername/startup-validator)](https://github.com/yourusername/startup-validator/commits/main)
[![Pull Requests](https://img.shields.io/github/issues-pr/yourusername/startup-validator)](https://github.com/yourusername/startup-validator/pulls)

---

## 🏆 Top Contributors

<!-- Would be auto-populated by GitHub API or manually updated -->
1. [@contributor1](https://github.com/contributor1) - 50+ contributions
2. [@contributor2](https://github.com/contributor2) - 30+ contributions
3. [@contributor3](https://github.com/contributor3) - 20+ contributions

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

<div align="center">

### Thank you for contributing! 🎉

Together, we're building the best startup validation tool for entrepreneurs worldwide.

[Back to README](README.md)

</div>
