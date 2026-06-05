# Project Structure Documentation

## Folder Organization

This project follows a professional, scalable folder structure designed for maintainability and reusability.

### `/app` - Next.js App Router
- `layout.js` - Root layout with global providers
- `page.js` - Homepage
- `globals.css` - Global styles and Tailwind imports
- `/tools` - Tool pages
- `/blog` - Blog pages
- `/admin` - Admin dashboard

### `/components` - React Components
Organized by purpose and complexity:

#### `/components/ui` - Atomic UI Components
Reusable, primitive components used throughout the app:
- `Button.jsx` - All button variants
- `Input.jsx` - Form inputs
- `Card.jsx` - Card containers
- `Modal.jsx` - Modal dialogs
- `Badge.jsx` - Labels and tags
- etc.

#### `/components/layout` - Layout Components
Components that structure pages:
- `Navbar.jsx` - Top navigation
- `Footer.jsx` - Site footer
- `Breadcrumb.jsx` - Navigation breadcrumbs
- `Sidebar.jsx` - Sidebar navigation

#### `/components/sections` - Page Sections
Larger, composed components for specific page sections:
- `Hero.jsx` - Homepage hero
- `ToolGrid.jsx` - Tool listing grid
- `BlogCard.jsx` - Blog post cards
- etc.

### `/lib` - Utility Libraries
Core utilities and configurations:
- `colors.js` - **Global color system** (NEVER use hardcoded Tailwind colors)
- `utils.js` - Helper functions (cn, formatDate, etc.)
- `constants.js` - App-wide constants

### `/hooks` - Custom React Hooks
Reusable stateful logic:
- `useModal.js` - Modal state management
- `useTheme.js` - Dark mode toggle
- etc.

### `/context` - React Context Providers
Global state management:
- `ThemeContext.jsx` - Theme (light/dark) provider
- etc.

---

## Color System Usage

### ❌ NEVER DO THIS:
```jsx
<div className="bg-blue-500 text-white">
```

### ✅ ALWAYS DO THIS:
```jsx
<div className="bg- text-white">
```

All colors are defined in `lib/colors.js` and configured in `tailwind.config.js`.

Available color classes:
- `bg-`, `text-`, `border-`
- `bg-background-light`, `bg-background-dark`
- `text-text--light`, `text-text--dark`
- `bg-success`, `bg-error`, `bg-warning`, `bg-info`

---

## Component Guidelines

### 1. Keep Components Small
- Each component should do ONE thing
- Maximum 200 lines per file
- Extract complex logic into hooks

### 2. Use Composition
```jsx
// ✅ Good
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// ❌ Bad - Monolithic component
<ComplexCard title="Title" content="Content" footer="Footer" />
```

### 3. Props Validation
Always destructure props and provide defaults:
```jsx
export default function Button({ 
  variant = '', 
  size = 'md', 
  children 
}) {
  // ...
}
```

---

## Styling Guidelines

### 1. Use Tailwind Classes
- Leverage Tailwind's utility classes
- Use `@apply` in CSS only for complex, repeated patterns

### 2. Dark Mode
All components must support dark mode:
```jsx
<div className="bg-white dark:bg-gray-800">
```

### 3. Responsive Design
Mobile-first approach:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Import Aliases

Use absolute imports with `@/` prefix:
```jsx
import { colors } from '@/lib/colors'
import Button from '@/components/ui/Button'
import { APP_NAME } from '@/lib/constants'
```

Configured in `jsconfig.json`.

---

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Run linter**: `npm run lint`

---

**Remember**: We're building a million-dollar product. Write code like a 30-year veteran.
