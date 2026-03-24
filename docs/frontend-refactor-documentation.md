# Alufas Frontend Refactor Documentation

## Purpose of this document

This document describes the main technical issues that were discovered in the Alufas frontend, the decisions that were made during the cleanup and refactor work, and the reasoning behind those decisions. It is written as implementation documentation that can support a bachelor thesis, especially in sections related to system quality, frontend architecture, maintainability, testing, accessibility, and responsive design.

The goal of the work was not only to make the application function correctly, but also to improve its long-term maintainability. Several problems in the project were not isolated bugs. Instead, they were structural issues that caused repeated manual work, inconsistent behavior, and a higher risk of future errors.

## Project context

The frontend is a React application built with Vite. The project uses Tailwind CSS, React Router, shared UI components, and several page-level form flows for internal documentation and reporting. The application appears to be designed for practical field use, where users move through screens such as project selection, document creation, deviation reporting, image capture, and success confirmation.

Because of that context, the frontend needed to satisfy several requirements at the same time:

- visual consistency
- reliable styling
- mobile and tablet usability
- clear workflows
- accessible forms
- maintainable code
- testable behavior

The work therefore developed from a simple styling bug investigation into a broader frontend stabilization effort.

## 1. Initial problem: Tailwind styling did not apply reliably

### Observed issue

The first major problem was that styling only worked when many values were forced inline. This suggested that the Tailwind setup was not generating the expected utility classes, or that the project depended on design tokens that Tailwind did not understand.

In practice, this created a serious development problem:

- standard Tailwind utility classes appeared broken
- semantic classes looked valid in code but had no visible effect
- inline styles became a fallback, which increased duplication
- the visual system became harder to maintain

### Root cause

The main issue was that the frontend used semantic Tailwind classes such as:

- `bg-primary`
- `text-muted-foreground`
- `bg-card`
- `border-input`
- `ring-ring`

These are common in component systems inspired by shadcn/ui or token-based design systems. However, the corresponding theme tokens were not defined in a way Tailwind v4 could compile.

So the problem was not that Tailwind was completely absent. The problem was that the project expected semantic token utilities, while the Tailwind setup did not expose those tokens to the build system.

### Decision

The chosen fix was to define the semantic design tokens in CSS using Tailwind v4's `@theme inline` mapping, rather than hardcoding colors into each component or forcing more inline styles.

### Why this was the correct decision

This decision was preferred because:

- it matched the design-token style already used by the components
- it kept colors and semantic values centralized
- it aligned with the current Tailwind v4 approach
- it avoided scattering hardcoded replacements throughout the codebase
- it made the existing class names work as intended

### Result

After the token mapping was added, semantic Tailwind utilities were generated correctly and the need to force visual values inline was reduced. This restored the intended relationship between component markup and the styling system.

## 2. Tailwind animation classes were also incomplete

### Observed issue

Some component states depended on classes like:

- `animate-in`
- `fade-in-0`
- `zoom-in-95`

These utilities were not being generated either, which meant state-based transitions such as dialogs or animated component entry effects would not behave correctly.

### Decision

These utilities were added using Tailwind v4 CSS-defined utility patterns in the same styling system cleanup.

### Reasoning

This was a better choice than:

- removing the animation classes entirely
- replacing each animated component by hand
- introducing yet another custom animation system

The goal was to preserve intended component behavior while keeping the styling model consistent.

## 3. General project cleanup after the Tailwind diagnosis

Once the initial styling issue was solved, it became clear that the repository contained older setup leftovers and duplicated scaffolding. These were not always breaking the app directly, but they increased confusion and maintenance cost.

### Problems found

- duplicate package-level setup
- old Vite scaffold files
- outdated Tailwind/PostCSS config remnants
- unused assets and placeholder folders
- custom config dependencies that no longer matched the actual app

### Decision

The cleanup approach was to treat the actual frontend app directory as the source of truth and remove legacy scaffolding that no longer served the running project.

### Result

This reduced ambiguity in the codebase and made it easier to understand which configuration actually mattered.

From a thesis perspective, this is an example of reducing accidental complexity. The codebase becomes easier to reason about when old configuration paths and dead files are removed.

## 4. Testing was missing and needed to be introduced from scratch

### Initial state

The project did not have a proper unit and component testing setup. That meant:

- UI logic could regress without detection
- refactors became riskier
- accessibility and navigation issues were harder to validate
- there was no stable safety net for future changes

### Decision

The testing stack selected for the React + Vite frontend was:

- Vitest
- React Testing Library
- jsdom

### Why this stack was chosen

This combination is well suited for React frontend projects because:

- Vitest integrates naturally with Vite
- React Testing Library encourages testing user behavior rather than implementation details
- jsdom supports browser-like rendering for component tests

The decision was to prioritize component and interaction tests rather than prematurely over-investing in isolated unit testing for every file.

### Testing philosophy used

The implemented approach focused on:

- what the user can see
- what the user can click
- what the user can type
- what route or state changes after interaction

The tests intentionally avoided shallow, low-value assertions such as checking whether a specific Tailwind class name existed on an element.

### Result

A complete test foundation was added and expanded until the suite covered the main screens and flows in the application.

This gave the project:

- regression protection
- confidence for refactors
- better documentation of expected behavior

## 5. Expanded test coverage across the application

After the test system was set up, the next phase was to broaden coverage so the tests reflected the actual product workflow rather than only shared utilities.

### Areas covered

Tests were added for:

- splash screen behavior
- login flow
- project search and archived project switching
- document selection flow
- avvik flow
- success screen behavior
- image draft utilities
- image capture behavior
- checklist and form screens such as KS Verksted, KS Montasje, Profiler mottak, Varer mottak, Glass mottak, and Montasjeplan

### Reasoning

This coverage strategy was important because the application is strongly workflow-based. The primary risk in this kind of frontend is not isolated mathematical logic. It is broken transitions, missing form state, inaccessible controls, and navigation failures.

By testing pages and user interactions, the suite became aligned with how the application is actually used.

## 6. Accessibility issues in the form screens

### Observed issue

Several screens showed visible labels next to inputs, but those labels were not correctly associated with their controls using `htmlFor` and `id`.

This created two problems:

- weaker accessibility for screen readers and assistive technologies
- brittle tests, because elements were not queryable through semantic label-based selectors

### Decision

The forms were updated to use proper label-input associations.

### Reasoning

This decision improved both:

- real user accessibility
- developer ergonomics in testing

It is a good example of how accessibility work and maintainability work often support each other. Once elements are semantically correct, they become easier to test and easier to understand.

### Result

Important form screens, including Avvik and several checklist pages, now expose inputs through proper labels instead of only visual proximity.

## 7. Text encoding and mojibake problems

### Observed issue

A recurring issue in the frontend was corrupted Norwegian text. Examples included broken characters in words such as:

- `Søk`
- `Elkjøp`
- `Dør`
- `Tromsø`
- `Først`

In several files, these characters appeared as mojibake instead of valid UTF-8 text.

### Why this mattered

This was not only cosmetic. It affected:

- professionalism of the interface
- readability
- trust in the product
- usability for Norwegian-speaking users
- maintainability, because corrupted text also made file patching less reliable

### Decision

Where the corruption was limited, text was fixed in place. Where the corruption made patching unreliable, files were replaced with clean UTF-8 versions.

### Why file replacement was sometimes used

In some cases, patching individual lines was difficult because the corrupted text made exact matching unstable. Replacing a full page file was the safest way to:

- preserve the route and behavior
- remove encoding issues consistently
- avoid partial fixes

This is why some edit operations appeared as delete-and-recreate actions in the tool log. The page itself was not removed from the app. The file was rewritten cleanly.

### Result

The project now uses much cleaner visible copy across major screens. This also made later refactors easier because the text content became stable and patchable again.

## 8. Logo integration and design adaptation

### Observed issue

The logo needed to be updated to use an uploaded asset, but it also needed to remain visible and aesthetically suitable on the current background.

### Decision

A shared branded logo wrapper was created, and later updated to use the uploaded `logo.png` from the public assets instead of only styling the older `af-logo.png`.

### Reasoning

This decision separated two concerns:

- the visual container/treatment of the logo
- the asset file itself

That made it possible to:

- switch assets more easily
- preserve contrast and legibility on different backgrounds
- reuse the same logo treatment on multiple screens

### Result

The logo system became more reusable and visually stable, especially on splash and login screens.

## 9. Responsive design improvements

### Initial problem

The frontend was not sufficiently responsive for mobile and tablet use. Screens often behaved like scaled-down desktop layouts instead of layouts intentionally adapted to smaller viewports.

### Risks

For an app likely intended for documentation workflows in practical environments, weak responsiveness is a major usability problem. Users may rely on phones or tablets while moving between sites, inspecting projects, or capturing images.

### Decision

A responsive pass was made across the key screens, including:

- splash
- login
- projects
- new document
- success
- avvik
- KS Verksted
- KS Montasje
- Profiler mottak
- Varer mottak
- Glass mottak
- Image capture
- Montasjeplan

### Main changes

The responsive work focused on:

- scaling text more appropriately
- reducing oversized buttons on small screens
- improving spacing
- making cards and controls collapse more naturally
- using better size patterns such as `clamp(...)`
- reducing hard desktop-style layout assumptions

### Result

The app became more usable on:

- mobile phones
- tablets
- standard desktop screens

This was not only a visual improvement. It improved practical usability in the target use case.

## 10. Removal of dead or placeholder code

### Observed issue

The application contained a `CoreNavigation` placeholder page that did not implement meaningful functionality.

### Decision

The page and route were removed rather than kept as an unused placeholder.

### Reasoning

Keeping dead placeholders in production code increases confusion:

- developers may assume the file matters
- routing becomes harder to understand
- maintenance effort grows around code with no real behavior

Removing it reduced noise and made the routing structure clearer.

## 11. Improving linting quality

### Initial issue

The existing ESLint setup did not properly cover the TypeScript part of the codebase. This meant linting could appear to pass even when important application files were not really being checked.

### Decision

The lint setup was upgraded to support TypeScript-aware linting.

### Reasoning

This was important because the project relies heavily on typed React code. Without TypeScript-aware linting:

- dead code can survive longer
- effect misuse becomes easier to miss
- inconsistent patterns accumulate

### Result

Once linting actually covered the real app code, some cleanup opportunities became visible and were addressed.

This is a good thesis example of how tooling quality directly influences code quality.

## 12. Security and dependency audit cleanup

### Observed issue

`npm audit` reported a high-severity vulnerability in a transitive dependency used by development tooling.

### Analysis

The issue was not in the production bundle itself. It came through the linting dependency chain and therefore affected developer tooling rather than runtime user code.

### Decision

The safest fix was to run `npm audit fix` and then verify that the project still behaved correctly.

### Reasoning

This approach was chosen over manual package deletion because:

- transitive dependencies return on reinstall
- the clean fix should happen at the dependency tree level
- the project should remain reproducible

### Result

The vulnerability count was reduced to zero while preserving the lint and test setup.

## 13. Creating a shared form layout system

### Initial problem

Several form and checklist screens repeated the same inline style systems:

- page shell
- back-header layout
- project summary card
- section card
- input styles
- textarea styles
- action button styles

Although these screens looked similar, each page often redefined the same styling objects independently.

### Why this was a serious maintenance problem

This duplication caused several issues:

- visual changes had to be repeated in many places
- bugs could be fixed on one page and missed on another
- accessibility patterns became inconsistent
- responsive improvements had to be duplicated manually
- reading the code became harder because of repeated low-level styling

### Decision

A shared form layout module was created in:

- [FormLayout.tsx](C:\Users\anjat\OneDrive\Desktop\Alufas Frontend\my-app\src\components\forms\FormLayout.tsx)

### What it centralizes

The shared module now provides reusable patterns for:

- form page shell
- common header layout
- project card
- form section wrapper
- labeled field wrapper
- shared input style
- shared textarea style
- shared action button style

### Why this was the right approach

This was a classic maintainability refactor. The purpose was not to change business behavior. The purpose was to reduce duplication and make future changes cheaper and safer.

Once a shared layout component exists:

- style updates become centralized
- new screens can be built faster
- consistency improves automatically
- accessibility patterns are easier to preserve

### Result

Multiple screens were migrated to the shared layout system, reducing repeated inline styling significantly.

## 14. Why some pages were fully rewritten during refactors

During the refactor process, some files were deleted and recreated instead of being edited in smaller patches.

### Reason

This happened primarily in files affected by text encoding problems or unstable patch matching. The delete-and-recreate approach was used when it was safer than applying many fragile partial edits.

### Important clarification

This does not mean the pages were removed from the application. It means the file contents were rebuilt cleanly while keeping the page, route, and user-facing behavior.

From a thesis perspective, this is a good example of pragmatic engineering. The technically purest edit is not always the safest edit. When tooling and encoding issues make patching unreliable, replacing a file with a clean equivalent can reduce risk.

## 15. Copy and terminology normalization

### Observed issue

The interface had inconsistent naming across screens, such as:

- `Glassmottak` versus `Glass mottak`
- `Varer Mottak` versus `Varer mottak`
- `Registrere avvik` versus `Registrer avvik`

There were also several awkward or inconsistent text phrases.

### Decision

A wording pass was performed across the main non-form and form screens to make naming more consistent and natural.

### Reasoning

Consistent terminology matters because:

- it reduces user confusion
- it improves product professionalism
- it strengthens documentation clarity
- it simplifies testing and maintenance

### Result

The interface now uses more stable wording patterns across navigation, forms, and success states.

## 16. Code comments and documentation inside the codebase

### Decision

Short and limited comments were added in selected places rather than commenting every block of code.

### Why not comment everything

Over-commenting creates noise and can make code harder to read. Comments are most useful when they explain:

- intent
- reasoning
- why something exists

They are less useful when they only repeat what the code already says clearly.

### Comment strategy used

Comments were added mainly in:

- shared structure files
- helper/state functions
- places where the purpose was not immediately obvious

This approach keeps the code readable without turning it into documentation clutter.

## 17. Validation strategy

Throughout the cleanup work, validation was treated as part of the implementation rather than something optional at the end.

### Main validation methods used

- production builds
- ESLint checks
- component and interaction tests
- targeted searches for broken strings and leftover mojibake

### Why this mattered

Because the work touched:

- styling
- routing
- wording
- accessibility
- shared layout logic
- testing infrastructure

there was a high risk that one improvement could accidentally break another area.

The repeated verification process reduced that risk and made the refactor safer.

## 18. Tradeoffs and limitations

Although the frontend is in a much stronger state now, some tradeoffs and limitations remain.

### 1. Some Norwegian text still uses ASCII-safe replacements in places

In a few screens, ASCII-friendly wording was retained in code when patch stability or encoding consistency made full character normalization less safe during that step.

### 2. Backend integration is still partially mocked

Several flows still contain placeholder comments such as future backend submission notes, and image drafts still rely on session storage.

This is acceptable for prototype-stage frontend work, but it should be addressed in a real production integration phase.

### 3. Full end-to-end testing is still a logical next step

Unit and component testing now exist, but browser-level flow testing with a tool like Playwright would be the next natural stage if the project continues.

## 19. Overall impact

The frontend work developed in stages:

1. diagnose Tailwind styling failure
2. repair semantic token generation
3. restore animation utilities
4. clean obsolete project structure
5. add testing infrastructure
6. expand behavior-focused coverage
7. improve accessibility
8. fix corrupted copy and text encoding
9. improve mobile and tablet responsiveness
10. remove dead code
11. strengthen linting
12. resolve dependency audit issues
13. extract a shared form layout system
14. normalize wording and reduce repeated patterns

The result is a frontend that is:

- more stable
- more maintainable
- easier to test
- more accessible
- more responsive
- easier to explain in an academic context

## 20. Suggested thesis framing

If this work is described in a bachelor thesis, it can be presented as a practical case of frontend quality improvement through iterative refactoring.

Possible themes include:

- maintainability as a quality attribute
- design systems and token-based styling
- accessibility as part of frontend quality
- responsive design for field-oriented applications
- testability and regression prevention in React projects
- pragmatic refactoring of a real-world codebase

One useful way to frame the work is:

"The project began as a styling bug investigation, but the root-cause analysis revealed broader structural weaknesses in the frontend. By addressing these through configuration repair, shared component extraction, improved testing, and accessibility-focused cleanup, the application was transformed from a prototype-like codebase into a more maintainable and reliable frontend system."

## 21. Conclusion

The main lesson from this work is that frontend bugs are often symptoms of deeper architectural or maintenance issues. The Tailwind problem initially looked like a styling bug, but it exposed weaknesses in token configuration, project structure, duplication patterns, and testing maturity.

The final solution was therefore not a single bug fix. It was a sequence of connected technical decisions aimed at improving the frontend as a system.

That systems perspective is likely the strongest academic value of this work. It demonstrates how real engineering quality emerges not from one isolated improvement, but from many linked decisions around tooling, architecture, usability, semantics, and maintainability.
