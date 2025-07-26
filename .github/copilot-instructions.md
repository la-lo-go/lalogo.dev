# Copilot Instructions for lalogo.dev

## Project Overview
Personal portfolio website built with **Astro** and **TypeScript**, integrated with **Manfred CV** data via Azure Functions relay. Uses **TailwindCSS** with custom color scheme and **astro-og-canvas** for dynamic OpenGraph images.

## Architecture Patterns

### Data-Driven Content via Manfred Integration
- **Data Source**: `src/data/manfred/CV/MAC.json` - CV data updated via webhook from [lalogo.dev-relay](https://github.com/la-lo-go/lalogo.dev-relay)
- **Type System**: `src/lib/Manfred.ts` defines complete data model (`Job`, `Project`, `Organization`, `Role`, etc.)
- **Processing Libraries**: 
  - `ProjectPortfolio.ts` - Splits projects into "main" vs "other" using `.env` config
  - `JobPortfolio.ts` - Transforms job data for display
  - `Utils.ts` - Shared utilities (slugify, link extraction, date formatting)

### Environment-Based Project Filtering
```env
MAIN_PROJECTS = "mangateca-mango;qbittelegram;the-phpoly;shingeki-no-infinite"
```
Projects are categorized by slugified names in semicolon-separated string.

### Component Structure
- **Landing Page**: Composed of 5 main sections in `src/pages/index.astro`
- **Layout Pattern**: `src/layouts/Layout.astro` handles meta tags, OG images, and transitions
- **Data Flow**: Components import data processors, not raw JSON

## Key Development Workflows

### Local Development
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build locally
```

### Content Updates
Content updates via external Manfred integration - modify `MAC.json` triggers rebuild through Azure Functions.

### Project Categorization
Modify `.env` `MAIN_PROJECTS` to change which projects appear in main vs other sections. Use `SlugName()` utility to get correct slugified format.

## Component Conventions

### Interactive Elements
- **Modal Pattern**: `MainProjectsItem.astro` uses `Modal.astro` with `triggerId` for project details
- **Hover Effects**: Custom CSS transitions on `.group` containers with `group-hover:` variants
- **Grid Layouts**: Responsive grids (`sm:grid-cols-2 lg:grid-cols-4`) for project listings

### TypeScript Interfaces
- **Template Pattern**: All components use `*Template` interfaces (e.g., `ProjectTemplate`, `JobTemplate`)
- **Props Pattern**: Explicit `Props` interface export in each component

### Styling System
- **Custom Colors**: `secondary: "#232727"`, `primary: "#ccece9"`, `gray: "#e5fffd"`
- **Typography**: IBM Plex Sans font family loaded via `src/fonts/`
- **Layout**: Uses CSS Grid with dividers (`divide-y-2 divide-primary`)

## Integration Points

### OpenGraph Image Generation
- **Dynamic OG**: `src/pages/og/[...route].ts` generates blog post images
- **Fonts**: Uses local IBM Plex Sans files in OG canvas
- **Fallback**: Static image at `/opengraph/openGraphMiniature.png`

### External Dependencies
- **Manfred Sync**: Data updates via Azure Functions webhook (separate repo)
- **Blog Content**: Markdown files in `src/pages/blog/` (future Notion integration planned)

## File Naming Conventions
- **Components**: PascalCase (`MainProjectsItem.astro`)
- **Libraries**: PascalCase (`ProjectPortfolio.ts`)
- **Pages**: lowercase (`index.astro`, `blog.astro`)
- **Data**: lowercase with hyphens for multi-word

## Common Tasks

### Adding New Project
1. Update Manfred CV data (external)
2. Add slugified name to `.env` `MAIN_PROJECTS` if main project
3. Rebuild will automatically include it

### Styling Updates
- Modify `tailwind.config.cjs` for theme changes
- Component styles use TailwindCSS utility classes
- Custom hover effects follow `group/group-hover` pattern

### New Components
- Follow `Props` interface pattern with explicit exports
- Import utilities from `@lib/Utils` for common operations
- Use `@components/`, `@lib/`, `@layouts/` path aliases
