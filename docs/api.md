# TanStack Query React Documentation Style Guide

## Document Purpose
This guide captures the patterns, conventions, and best practices observed across the TanStack Query React documentation to ensure consistency when writing new documentation.

### How to Use This Guide
1. **Before Writing**: Review the relevant sections for your document type
2. **While Writing**: Reference the patterns and examples
3. **After Writing**: Use the checklist to verify compliance
4. **Quick Lookup**: Use section headers to find specific formatting rules

---

## 📁 Document Structure Patterns

### File Naming
- **Pattern**: `kebab-case.md` for all files
- **Examples**: `quick-start.md`, `window-focus-refetching.md`, `advanced-ssr.md`
- **Migration docs**: Use versioning in ID like `migrating-to-v5.md`

### Directory Organization
- **guides/** - Conceptual how-to content, implementation patterns
- **reference/** - API documentation for hooks and components
- **plugins/** - Plugin-specific documentation (persister, storage)
- **community/** - External resources and projects

---

## 📝 Document Header Conventions

### Title Format
- **Pattern**: YAML frontmatter with `id` and `title` fields
- **Format**: 
  ```yaml
  ---
  id: kebab-case-matching-filename
  title: Human Readable Title
  ---
  ```
- **Examples**: 
  - `id: overview` / `title: Overview`
  - `id: useQuery` / `title: useQuery`
  - `id: migrating-to-tanstack-query-5` / `title: Migrating to TanStack Query v5`

### Metadata/Frontmatter
- **Pattern**: Minimal frontmatter - only `id` and `title`
- **No dates, authors, or tags** in standard docs 

---

## 🔗 Link Formatting

### Internal Links
- **Pattern**: Relative markdown paths from current location
- **Format**: `[Link Text](../path/to/file.md)` or `[Link Text](./guides/queries.md)`
- **Examples**: 
  - `[Mutations](./mutations.md)` - Same directory
  - `[Query Keys](../guides/query-keys.md)` - Parent directory
  - `[useQuery](../reference/useQuery.md)` - Cross-section

### External Links
- **Pattern**: Full URLs with descriptive text
- **Examples**: 
  - `[TanStack Query Course](https://query.gg?s=tanstack)`
  - `[React event pooling](https://reactjs.org/docs/legacy-event-pooling.html)`
  - `[typescript playground](https://www.typescriptlang.org/play?#code/...)`

### API Reference Links
- **Pattern**: Link to specific methods with full path
- **Format**: `[QueryClient's method](../../../reference/QueryClient.md#queryclientmethod)`
- **Examples**: 
  - `[Query Client's invalidateQueries method](../../../reference/QueryClient.md#queryclientinvalidatequeries)` 

---

## 💻 Code Examples

### Inline Code
- **Pattern**: Backticks for method names, properties, values
- **Usage**: Variables, function names, property names, string values
- **Examples**: 
  - `useQuery`
  - `queryKey`
  - `'pending'`
  - `staleTime`

### Code Blocks
- **Pattern**: Triple backticks with language identifier
- **Common languages**: `tsx`, `ts`, `jsx`, `js`, `bash`, `html`
- **Structure**: 
  - Start with imports
  - Show complete, runnable examples
  - Include type annotations in TypeScript examples

### Code Comments for Examples
- **Pattern**: Use `[//]: # 'ExampleName'` markers before and after code blocks
- **Purpose**: Allows code extraction and referencing
- **Example**:
  ```
  [//]: # 'Example'
  ```tsx
  // code here
  ```
  [//]: # 'Example'
  ```

### Import Statements
- **Pattern**: Always show necessary imports at the top
- **Format**: Named imports from `@tanstack/react-query`
- **Examples**: 
  ```tsx
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
  ``` 

---

## 📚 Content Organization

### Section Headers
- **Pattern**: Use `##` for main sections, `###` for subsections
- **Hierarchy**: Never skip levels (don't go from `#` to `###`)
- **Examples**: 
  - `## Query Basics`
  - `### Updating a list of todos`
  - `## Breaking Changes`

### Paragraph Length
- **Pattern**: 2-4 sentences per paragraph
- **Style**: Break complex explanations into digestible chunks
- **Lead with key information**: State the main point first

### Lists and Bullets
- **Pattern**: Use `-` for bullet points (not `*` or `+`)
- **Indentation**: 2 spaces for nested items
- **Format for parameters**: 
  - Parameter name with type as bullet
  - Indented description
  - Further indented sub-properties 

---

## 🎯 Writing Style

### Voice and Tone
- **Pattern**: Direct, informative, slightly conversational
- **Perspective**: Second person ("you") for instructions
- **Examples**: 
  - "You can install React Query via NPM"
  - "Keep them in mind as you continue to learn"
  - "If you're not overwhelmed by that list..."

### Technical Terms
- **Pattern**: Bold for first introduction of key concepts
- **Format**: `**term**` on first use
- **Examples**: 
  - "**fetching, caching, synchronizing and updating server state**"
  - "**unique key**"
  - "**structurally shared**"

### Explanation Depth
- **Pattern**: Progressive disclosure - simple first, then detailed
- **Structure**: 
  1. Brief concept introduction
  2. Basic usage example
  3. Detailed explanation
  4. Advanced patterns 

---

## ⚠️ Warning and Note Formatting

### Important Information
- **Pattern**: Use blockquotes with `>` for important notes
- **Format**: Start with "IMPORTANT:" or "Note:"
- **Examples**: 
  ```
  > IMPORTANT: The `mutate` function is an asynchronous function...
  > Note that since version 5, the dev tools support observing mutations
  ```

### Deprecation Notices
- **Pattern**: Inline comments or dedicated sections
- **Migration guides**: Show old vs new with strike-through
- **Example**: 
  ```tsx
  useQuery(key, fn, options) // [!code --]
  useQuery({ queryKey, queryFn, ...options }) // [!code ++]
  ```

### Tips and Best Practices
- **Pattern**: Blockquotes for tips, inline for context
- **Examples**: 
  ```
  > To change this behavior, you can configure your queries
  ``` 

---

## 📊 API Documentation Patterns

### Hook Documentation
- **Pattern**: Start with complete type signature code block
- **Structure**: 
  1. Full TypeScript interface showing all options
  2. Parameter descriptions with types
  3. Return value descriptions
  4. Usage examples

### Parameter Documentation
- **Pattern**: Bulleted list with nested descriptions
- **Format**: 
  - `parameterName: Type`
    - **Required** or Optional notation
    - Description
    - Default value if applicable
    - Sub-properties indented further
- **Example**:
  ```
  - `queryKey: unknown[]`
    - **Required**
    - The query key to use for this query
  ```

### Return Value Documentation
- **Pattern**: Grouped by related properties
- **Format**: Description followed by property list
- **Categories**: Status flags, data properties, utility functions 

---

## 🔄 Migration and Version-Specific Content

### Breaking Changes
- **Pattern**: Clear before/after comparisons
- **Format**: Use `[!code --]` and `[!code ++]` for diffs
- **Structure**: 
  1. Section header describing the change
  2. Code showing old approach with `[!code --]`
  3. Code showing new approach with `[!code ++]`

### Version Comparisons
- **Pattern**: Side-by-side or sequential code blocks
- **Include**: 
  - Clear version numbers
  - Migration path
  - Codemods when available 

---

## 📐 Formatting Conventions

### Emphasis
- **Pattern**: 
  - **Bold** for important concepts and warnings
  - _Italics_ for subtle emphasis (used sparingly)
  - `backticks` for code elements

### Technical Keywords
- **Pattern**: Backticks for all code-related terms
- **Examples**: 
  - Hook names: `useQuery`, `useMutation`
  - Properties: `data`, `error`, `isLoading`
  - Values: `'pending'`, `true`, `false`
  - Types: `Promise<TData>`

### File References
- **Pattern**: Backticks or inline code style
- **Examples**: 
  - `package.json`
  - `tsconfig.json`
  - In paths: `/api/data` 

---

## 🎓 Educational Patterns

### Progressive Disclosure
- **Pattern**: Simple → Intermediate → Advanced
- **Structure**: 
  1. Basic concept with minimal example
  2. Common use cases
  3. Advanced patterns
  4. Edge cases and gotchas

### Concept Introduction
- **Pattern**: What → Why → How
- **Example Structure**: 
  1. One-sentence definition
  2. Problem it solves
  3. Basic implementation
  4. Detailed explanation

### Real-World Examples
- **Pattern**: Practical, relatable scenarios
- **Common Examples**: 
  - Todo lists for CRUD operations
  - User authentication for async state
  - GitHub API for real API calls
  - Form submissions for mutations 

---

## 📋 Common Sections

### Prerequisites
- **Pattern**: Brief statement of requirements
- **Format**: Often included in installation section
- **Examples**: 
  - "React Query is compatible with React v18+"
  - "Types currently require using TypeScript v4.7 or greater"

### Installation
- **Pattern**: All package managers shown
- **Order**: npm, pnpm, yarn, bun
- **Format**: 
  ```bash
  npm i @tanstack/react-query
  ```
  or
  ```bash
  pnpm add @tanstack/react-query
  ```

### Basic Usage
- **Pattern**: Minimal working example
- **Structure**: 
  1. Required imports
  2. Setup (QueryClient, Provider)
  3. Simple component implementation
  4. Key concepts highlighted

### Advanced Usage
- **Pattern**: Build on basic example
- **Include**: 
  - Error handling
  - Loading states
  - Options and configuration
  - Performance optimizations 

---

## 🎬 Special Document Types

### Migration Guides
- **Structure**: Breaking changes → Codemods → Migration path
- **Code Comparison**: Show before/after clearly
- **Version Numbers**: Explicit in title and content
- **Upgrade Path**: Step-by-step instructions

### API Reference
- **Structure**: Type signature → Parameters → Returns → Examples
- **Completeness**: All props/options documented
- **Types**: Full TypeScript definitions
- **Defaults**: Clearly stated for all optional parameters

### Platform-Specific Docs
- **Structure**: Compatibility → Setup → Platform features
- **Examples**: Platform-specific code snippets
- **Dependencies**: List required packages
- **Gotchas**: Platform-specific issues and solutions

### Community Resources
- **Format**: Title with link → Brief summary → "Read more..."
- **Attribution**: Author name and platform
- **Summaries**: 2-3 sentences describing content
- **Organization**: Numbered or categorized list

---

## 🔍 Cross-References

### See Also Sections
- **Pattern**: "Further Reading" or inline references
- **Format**: Links to related guides and concepts
- **Example**: 
  ```markdown
  ## Further Reading
  
  Have a look at the following articles:
  - [Practical React Query](../community/tkdodos-blog.md#1-practical-react-query)
  ```

### Related Concepts
- **Pattern**: Inline links when mentioning related features
- **Examples**: 
  - "See [Query Keys](../guides/query-keys.md) for more information"
  - "This is similar to [Optimistic Updates](./optimistic-updates.md)" 

---

## 📝 Notes and Observations

### Recurring Patterns
- **StackBlitz Examples**: Many docs link to interactive examples
- **TypeScript First**: Examples primarily use TypeScript
- **Practical Focus**: Emphasis on real-world usage over theory
- **State Categories**: Consistent use of pending/error/success states
- **Custom Hooks Examples**: Show wrapper patterns around library hooks
- **Platform-Specific Sections**: React Native gets dedicated documentation

### Unique Conventions
- **Query vs Mutation**: Clear distinction in documentation
- **"TanStack Query" branding**: Consistent use (formerly React Query)
- **Emoji Usage**: Minimal, only in specific contexts (devtools "🥳")
- **Code Comment Markers**: `[//]: # 'Example'` for code extraction
- **Blog Post References**: Community content linked with summaries
- **Third-Party Tools**: Listed with brief descriptions and links

### Style Consistencies
- **No unnecessary complexity**: Examples start simple
- **Consistent hook naming**: `useQuery`, `useMutation`, etc.
- **Options object pattern**: Single object parameter for all hooks
- **Practical defaults**: Always mention default behaviors
- **Testing Guidance**: Includes test setup and configuration
- **Performance Notes**: Explicit about optimization implications

---

## 📋 Quick Start Templates

### Basic Guide Document
```markdown
---
id: your-feature-name
title: Your Feature Name
---

Brief introduction explaining what this feature does and why it's useful.

## Basic Usage

Simple example showing the most common use case:

[//]: # 'BasicExample'
```tsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, error, isPending } = useQuery({
    queryKey: ['example'],
    queryFn: fetchData,
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error occurred'
  
  return <div>{data}</div>
}
```
[//]: # 'BasicExample'

## Advanced Usage

More complex patterns and configurations...

## Options

- `optionName: Type`
  - Description of what this option does
  - Default: `defaultValue`

## Further Reading

- [Related Guide](./related-guide.md)
- [API Reference](../reference/api.md)
```

### API Reference Document
```markdown
---
id: useYourHook
title: useYourHook
---

```tsx
const {
  returnValue1,
  returnValue2,
} = useYourHook({
  param1,
  param2,
})
```

**Parameters**

- `param1: Type`
  - **Required**
  - Description of parameter
- `param2: Type`
  - Optional
  - Description
  - Default: `value`

**Returns**

- `returnValue1: Type`
  - Description of return value
- `returnValue2: Type`
  - Description of return value

**Example**

[//]: # 'Example'
```tsx
// Example usage
```
[//]: # 'Example'
```

---

## 🎯 Quick Reference Checklist

When writing new documentation:

### Structure & Formatting
- [ ] File naming follows kebab-case
- [ ] YAML frontmatter with `id` and `title`
- [ ] Headers follow ## → ### hierarchy
- [ ] Use `-` for bullet points (not `*` or `+`)

### Code & Examples
- [ ] TypeScript examples with proper imports
- [ ] Code blocks use language identifiers (tsx, ts, bash)
- [ ] Show complete, runnable examples
- [ ] Examples progress from simple to complex
- [ ] Use `[//]: # 'Example'` markers for code blocks
- [ ] Include all necessary imports at the top

### Links & References
- [ ] Links use relative paths for internal docs
- [ ] External links use full URLs with descriptive text
- [ ] Include "Further Reading" section for complex topics
- [ ] Cross-reference related concepts inline

### Technical Content
- [ ] Bold for key concept introduction
- [ ] Backticks for all code elements
- [ ] API docs start with type signature
- [ ] Parameters documented with type and description
- [ ] Document default values and behaviors
- [ ] Include platform-specific considerations when relevant

### Special Formats
- [ ] Show all package manager options (npm, pnpm, yarn, bun)
- [ ] Migration guides use `[!code --]` and `[!code ++]`
- [ ] Use blockquotes (>) for important notes
- [ ] Include practical, real-world examples