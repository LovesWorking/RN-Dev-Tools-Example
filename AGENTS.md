# Codex Development Guidelines

## Permissions and Autonomy

Codex has full permission to:

- Read any file in the codebase
- Modify any file in the codebase
- Create new files and directories as needed
- Run any commands for development, testing, and debugging
- Install dependencies and packages
- Execute build and test scripts
- Take screenshots and verify UI changes
- Use all available tools without asking for permission

Codex must NOT without explicit user permission:

- Create git commits (NEVER use `git commit` unless explicitly asked by the user)
- Push commits to remote repositories
- Create or merge pull requests
- Deploy to production environments
- Delete entire directories or critical files
- Modify git configuration or user settings
- Execute destructive database operations
- Share code or data externally

IMPORTANT Git Commit Rules:

- NEVER commit changes unless the user explicitly asks you to
- When asked to commit, always run lint and typecheck commands first
- If lint/typecheck commands are unknown, ask the user and suggest saving them to CODEX.md
- Only commit when explicitly requested with phrases like "commit this", "create a commit", etc.

Codex should work autonomously and efficiently, making all necessary changes to complete tasks without constantly asking for permission. Only pause for user input when the task requirements are unclear or when about to perform restricted actions listed above.

## Code Quality

- Always use descriptive variable names
- Every variable name should clearly communicate its purpose and content
- Prefer longer, descriptive names over abbreviated ones (e.g., `userAuthenticationToken` over `authTok`)
- Use consistent naming conventions throughout the codebase
- **NEVER use default exports** - Always use named exports (e.g., `export const ComponentName`)
  - Exception: Only use default exports for route files (e.g., app routes in Next.js or file-based routing)
  - This improves refactoring, tree-shaking, and IDE support

## Development Environment

### React Native App Management

- **ALWAYS CHECK if the app is already running before attempting to build/run it again**
- The user typically has the app running in their main terminal
- Check for running processes or ask the user before running `npm run ios` or `npm run android`
- If the app is already running, proceed directly with testing/debugging

## React Component Composition Principles

### Core Principles

- **Decompose by Responsibility**: Break down large, complex components into smaller, single-purpose components. A component should either handle business logic/state OR render UI, never both simultaneously
- **Prefer Composition over Configuration**: Instead of using numerous boolean flags, props, or conditional rendering to configure a single component, create multiple specialized components and compose them together
- **Extract Reusable Logic**: Move reusable state management and logic into dedicated custom hooks or pure functions to reduce complexity and promote separation of concerns
- **Utilize Render Props**: For advanced customization, use "component as a prop" or "render prop" patterns to allow parent components to control rendering logic without child components knowing parent implementation details

### Implementation Requirements

- **Rigorous Justification**: Every design choice and code implementation must be logically sound with clear explanations rooted in component composition principles
- **Complete Solutions Only**: Never guess or create solutions that appear correct but contain hidden flaws. Present only rigorously justified implementations or significant partial results with clear reasoning
- **Technical Documentation**: Include high-level strategy narratives and precise technical statements for key implementation steps
- **Design Decision Documentation**: Explicitly describe key decisions like extracting custom hooks or creating wrapper components

## React Performance Optimization

### Memoization Guidelines

- **Default to Plain Functions**: Avoid premature optimization. Don't wrap every handler or value in `useCallback`/`useMemo` unless there's a proven bottleneck
- **Composition Over Memo**: Leverage React's natural component composition (lift state, split components, pass stable `children`) instead of wrapping subtrees in fragile `React.memo`

### Specific Patterns

- **Avoid Inline Props**: Never pass newly created objects, arrays, or functions as props to memoized children. Instead:
  - Move them outside render (module-scope or custom hooks)
  - Co-locate handlers in child components via context or event patterns
- **UseMemo for Heavy Computations Only**: Wrap expensive calculations in `useMemo` only when profiling confirms CPU time exceeds memoization overhead
- **Limit React.memo to Leaf Nodes**: Reserve `React.memo` for leaf components with demonstrable render cost
- **Latest Ref Pattern for Effects**: Store user-provided props in refs updated on every render instead of adding them to effect dependencies
- **External State Management**: For global state causing full-app re-renders, use external solutions (Zustand, React Query) for targeted re-renders

### Documentation Requirements

- **Justify Every Optimization**: Each use of `useCallback`, `useMemo`, or `React.memo` must include an inline comment with:
  - Link to profiling output or ticket demonstrating measurable benefit
  - Clear rationale based on performance metrics
  - Explanation of why composition patterns weren't sufficient

## Code Implementation Standards

### TypeScript Requirements

- All code must be properly typed with TypeScript
- Avoid `any` types unless absolutely necessary with justification
- Use proper type inference where possible
- Define explicit return types for complex functions

### Error Handling

- Always handle potential error cases explicitly
- Provide meaningful error messages that help with debugging
- Use proper try-catch blocks for async operations
- Never silently swallow errors

### Testing Considerations

- Write code with testability in mind
- Keep functions pure when possible
- Minimize side effects and isolate them when necessary
- Consider edge cases during implementation

## Project-Specific Patterns

### File Organization

- Follow existing project structure and conventions
- Group related functionality together
- Keep components close to where they're used
- Maintain consistent file naming patterns

### State Management

- Prefer local state when data is component-specific
- Lift state only when necessary for sharing
- Use context sparingly and with clear boundaries
- Document state flow and dependencies

### Code Review Checklist

Before finalizing any implementation:

1. Verify all variable names are descriptive
2. Ensure component composition principles are followed
3. Confirm performance optimizations are justified
4. Check that all code is properly typed
5. Validate error handling is comprehensive
6. Review that existing patterns are followed

## Screenshots

Preferred: use the project scripts to capture simulator screenshots.

### Usage:

- Take iOS screenshot: `npm run screenshot:ios`
- Take Android screenshot: `npm run screenshot:android`
- Generic helper (auto-detect): `npm run screenshot`

These wrap `scripts/screenshot.sh` and save images under `./screenshots/`. The
script automatically runs `npm run reload` (fast mode) before capturing to ensure
UI state is fresh.

### When to use:

- After making UI/styling changes to verify they look correct
- Before completing UI-related tasks to ensure quality
- When debugging visual issues
- To document the current state of the application
- To verify that UI elements are properly positioned and styled

### Requirements:

- iOS: Xcode command-line tools installed (`xcrun` available)
- Android: Platform tools installed (`adb` available) and a device/emulator connected

### Best Practices:

- **ALWAYS reload the app before taking screenshots** using `pnpm reload` or `npm run reload`
- Always take a screenshot after significant UI changes
- Use screenshots to verify responsive design on different devices
- Capture before/after states when refactoring UI components
- Save screenshots with descriptive names for reference

### iOS Simulator Interaction:

- Avoid brittle UI scripting. Prefer small code toggles for deterministic states:
  - Open test modals by default
  - Auto-start flows in `useEffect`
  - Add debug flags (e.g., `AUTO_RUN_TEST`)
  - Use timeouts to sequence actions when needed
