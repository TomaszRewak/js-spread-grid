# Copilot Instructions for js-spread-grid

## Project Overview
SpreadGrid is a high-performance JavaScript grid library for data-dense applications. It prioritizes speed over visual waterfalls. The library uses canvas-based rendering with 9 canvas sections for pinned rows/columns support.

## Monorepo Structure
- **lib/** - Core vanilla JS library (`js-spread-grid`). All other packages depend on this.
- **react/** - Thin React wrapper (`react-spread-grid`) - just passes props to the core library.
- **dash/** - Plotly Dash wrapper (`dash_spread_grid`) - converts Python-serializable props (strings) to JS functions via `eval()`.
- **docs/** - Documentation site (React app).
- **tests/** - Visual regression tests using Puppeteer + jest-image-snapshot. DO NOT RUN (needs to be fixed).
- **example/** - Development playground.

## Architecture: Core Library (lib/)
The core follows a state → render pipeline:
1. **`index.js`** - Entry point, creates DOM with 9 canvases + input + tooltip, handles all events.
2. **`core/state.js`** - Memoized state computation using `cache()` helper. Tracks `visuallyImportantFields` to trigger re-renders. Is the heart of the library.
3. **`core/render.js`** - Canvas rendering. Draws cells section-by-section for pinning support.
4. **`state-utils/`** - Pure functions computing derived state (e.g., `getFiltered.js`, `getSorted.js`, `getPlaced.js`).
5. **`types/`** - Classes like `FormatResolver`, `FormattingRules`, `Selection` for complex state logic.
6. **`typings.js`** - JSDoc type definitions. Use `/** @import * as Types from "../typings.js"; */` pattern.

## Key Conventions
### TypeScript via JSDoc
The project uses vanilla JavaScript with JSDoc for types. TypeScript compiler validates via `jsconfig.json`:
```javascript
/** @import * as Types from "../typings.js"; */
/** @param {Types.Context} context */
function updateGrid(context) { ... }
```

### Formatting Rules Pattern
Cell styling uses cascading rules applied in order. Each rule can have `column`, `row`, `condition`, `value`, `text`, `style`, `edit`, etc:
```javascript
formatting: [
  { column: 'price', style: { backgroundColor: '#eee' } },
  { condition: ({value}) => value < 0, style: { color: 'red' } }
]
```

### Dash Wrapper Convention
The Dash component converts string expressions to functions using `eval()`. Property names use snake_case (Python) → camelCase (JS):
- `data_selector` → `dataSelector`
- `pinned_top` → `pinnedTop`

## Developer Workflow
### Validation
```bash
cd lib && tsc -p jsconfig.json    # Type checking
```

### Testing
```bash
cd lib && npm test           # Unit tests (Jest)
```
Tests use custom `describe`/`it` wrappers in [tests/src/test-utils/puppeteerTesting.js](tests/src/test-utils/puppeteerTesting.js) that spawn a dev server per worker.

## Common Patterns
- **Adding state computation**: Create function in `state-utils/`, use `cache()` in `state.js` for memoization.
- **Adding formatting option**: Update `FormattingRules.js` and `typings.js` types.
- **Canvas sections**: 9-grid layout (top/middle/bottom × left/center/right) enables sticky pinned areas.

## Documentation Site (docs/)
The docs site is a React app showcasing the library with live examples.

### Structure
- **`App.js`** - Route definitions with chapters: basics, columns-and-rows, formatting, data-shaping, events, editing, error-handling, examples...
- **`pages/`** - One folder per chapter, each page is a React component.
- **`components/`** - Reusable doc components: `Example`, `CodeBlock`, `Paragraph`, `Section`, `SubHeader`.

### Page Pattern
Each doc page combines prose with live examples:
```javascript
import SpreadGrid from "react-spread-gird";
import Example from "../../components/Example";
import CodeBlock from "../../components/CodeBlock";
import Paragraph from "../../components/Paragraph";

export default function MyPage() {
    return (
        <>
            <SubHeader>Feature Title</SubHeader>
            <Section>
                <Paragraph>Explanation text...</Paragraph>
                <CodeBlock options={[
                    { framework: 'jsx', code: require('!!raw-loader!./snippets/my-snippet.jsx').default },
                    { framework: 'js', code: require('!!raw-loader!./snippets/my-snippet.js').default },
                    { framework: 'py', code: require('!!raw-loader!./snippets/my-snippet.py').default }
                ]} />
                <Example>
                    <SpreadGrid data={...} formatting={[...]} />
                </Example>
            </Section>
        </>
    );
}
```

### Code Snippets
- Located in `pages/<chapter>/snippets/<feature>/` with `.jsx`, `.js`, `.py` variants.
- Use `// collapse: true` / `// collapse: false` comments to hide boilerplate sections.
- Snippets are loaded via `raw-loader` and displayed with syntax highlighting (Prism.js).

### Adding a New Page
1. Create page component in `pages/<chapter>/`.
2. Create snippets folder with `.jsx`, `.js`, `.py` examples.
3. Add route entry to `routes` array in `App.js`.
4. Mark with `wip: true` if incomplete.

## Meta: Maintaining These Instructions
**Update .github/copilot-instructions.md** when you encounter during agentic work:
- Patterns or conventions that took multiple attempts to discover
- Commands or workflows that failed unexpectedly
- File locations or naming conventions that weren't obvious
- Dependencies between packages that caused issues
- Any "I wish I knew this earlier" moments

Add learnings to the appropriate section or create new sections as needed. Keep instructions concise and actionable.
