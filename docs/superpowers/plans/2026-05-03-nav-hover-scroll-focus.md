# Navigation Hover and Scroll Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the top navigation so hover/focus states match the language toggle and the current section is highlighted automatically while scrolling.

**Architecture:** Keep the existing React class-based `App` shell, but add a dedicated nav scroll-spy observer that owns `activeSection` state independently from the reveal animation observer. Update nav rendering to use a single data-driven list of links and switch nav styling from underline treatment to pill states that mirror the language toggle.

**Tech Stack:** React 16 class components, Jest + React Testing Library, SCSS, jQuery AJAX bootstrap flow

---

## File Map

- **Modify:** `src/App.js` — add nav item config, `activeSection` state, section observer lifecycle, and active nav classes.
- **Modify:** `src/App.test.js` — add regression coverage for nav active-state updates driven by observer callbacks.
- **Modify:** `src/App.scss` — replace underline hover styling with bordered pill hover/focus and dark filled active state.

### Task 1: Lock the behavior with a failing nav scroll-spy test

**Files:**
- Modify: `src/App.test.js`
- Test: `src/App.test.js`

- [ ] **Step 1: Write the failing test**

Add a dedicated observer mock and a test that proves the nav link for the visible section becomes active.

```js
let intersectionObserverCallback;
let intersectionObserverInstances;

beforeEach(() => {
  intersectionObserverInstances = [];
  window.IntersectionObserver = jest.fn((callback) => {
    intersectionObserverCallback = callback;
    const instance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
    intersectionObserverInstances.push(instance);
    return instance;
  });
});

test("highlights the matching nav link when the section observer marks it active", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  render(<App />);

  await screen.findByText("English hero summary");

  const aboutSection = document.getElementById("about");
  const projectsSection = document.getElementById("projects");

  act(() => {
    intersectionObserverCallback([
      {
        target: aboutSection,
        isIntersecting: false,
        boundingClientRect: { top: -200 },
      },
      {
        target: projectsSection,
        isIntersecting: true,
        boundingClientRect: { top: 120 },
      },
    ]);
  });

  expect(screen.getByRole("link", { name: "Side Projects" })).toHaveClass("active");
  expect(screen.getByRole("link", { name: "About me" })).not.toHaveClass("active");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd /Users/auii/Project/my-portfolio && CI=true npm test -- --watch=false --runInBand --runTestsByPath src/App.test.js`

Expected: **FAIL** because nav links do not yet receive an `active` class and there is no section-tracking observer.

- [ ] **Step 3: Commit the failing test checkpoint**

```bash
cd /Users/auii/Project/my-portfolio
git add src/App.test.js
git commit -m "test: capture nav section highlighting"
```

### Task 2: Implement data-driven nav state and section tracking

**Files:**
- Modify: `src/App.js`
- Test: `src/App.test.js`

- [ ] **Step 1: Write the minimal implementation**

Add nav metadata, `activeSection` state, a dedicated nav observer, and active-class rendering.

```js
const NAV_SECTIONS = [
  { id: "about", labelKey: "about" },
  { id: "experience", labelKey: "experience" },
  { id: "skills", labelKey: "skills" },
  { id: "projects", labelKey: "projects" },
];

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      resumeData: {},
      sharedData: {},
      language: DEFAULT_LANGUAGE,
      activeSection: null,
    };
    this.revealObserver = null;
    this.navSectionObserver = null;
    this.observedRevealElements = new WeakSet();
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.observeRevealElements = this.observeRevealElements.bind(this);
    this.initNavSectionSpy = this.initNavSectionSpy.bind(this);
  }

  componentDidMount() {
    this.setState({ language: readStoredLanguage() });
    this.loadSharedData();
    this.loadResumeData();
    this.initScrollReveal();
    this.initNavSectionSpy();
  }

  componentWillUnmount() {
    if (this.revealObserver) {
      this.revealObserver.disconnect();
    }
    if (this.navSectionObserver) {
      this.navSectionObserver.disconnect();
    }
  }

  initNavSectionSpy() {
    this.navSectionObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

      if (visibleEntries.length > 0) {
        this.setState({ activeSection: visibleEntries[0].target.id });
      }
    }, {
      rootMargin: "-80px 0px -55% 0px",
      threshold: [0, 0.1, 0.25],
    });

    NAV_SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        this.navSectionObserver.observe(element);
      }
    });
  }

  render() {
    const { activeSection, language, resumeData: resumeDataState, sharedData: sharedDataState } = this.state;
    const sharedData = localizeSharedBasicInfo(sharedDataState.basic_info, language);
    const resumeBasicInfo = localizeResumeBasicInfo(resumeDataState.basic_info, language);
    const navItems = resumeBasicInfo?.section_name
      ? NAV_SECTIONS.map(({ id, labelKey }) => ({
          id,
          href: `#${id}`,
          label: resumeBasicInfo.section_name[labelKey],
        }))
      : [];

    return (
      <nav className="nav">
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={activeSection === item.id ? "active" : ""}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }
}
```

- [ ] **Step 2: Run the targeted test to verify it passes**

Run: `cd /Users/auii/Project/my-portfolio && CI=true npm test -- --watch=false --runInBand --runTestsByPath src/App.test.js`

Expected: **PASS** for the new nav active-state test and the existing app tests.

- [ ] **Step 3: Commit the behavior change**

```bash
cd /Users/auii/Project/my-portfolio
git add src/App.js src/App.test.js
git commit -m "feat: sync nav state with scrolling"
```

### Task 3: Apply segmented nav styling and verify the app

**Files:**
- Modify: `src/App.scss`
- Verify: `src/App.test.js`

- [ ] **Step 1: Update nav styles to use bordered hover and dark active pill states**

Replace the underline-specific styles with pill styling that visually matches the language toggle.

```scss
.nav-links {
  display: flex;
  gap: 0.9rem;
  font-weight: 600;
  font-size: 0.95rem;
}

.nav-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.6rem;
  padding: 0.65rem 1rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--text-secondary);
  background: transparent;
  transition: all 0.25s ease;
}

.nav-links a:hover,
.nav-links a:focus-visible {
  border-color: var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
}

.nav-links a.active {
  border-color: var(--text-primary);
  background: var(--text-primary);
  color: var(--bg-primary);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.nav-links a.active:hover,
.nav-links a.active:focus-visible {
  color: var(--bg-primary);
}
```

- [ ] **Step 2: Run the full verification commands**

Run:

```bash
cd /Users/auii/Project/my-portfolio && \
CI=true npm test -- --watch=false --runInBand && \
npm run build
```

Expected:

```text
PASS src/App.test.js
PASS src/components/Projects.test.js
PASS src/components/LanguageToggle.test.js
PASS src/data/localizedPortfolio.test.js
PASS src/data/res_primaryLanguage.test.js
PASS src/utils/language.test.js
Compiled successfully.
```

- [ ] **Step 3: Commit the styling pass**

```bash
cd /Users/auii/Project/my-portfolio
git add src/App.scss
git commit -m "style: polish nav hover and active states"
```
