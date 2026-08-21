# Fin Browser

A modern, calm, fast desktop browser with a subtle aquatic identity.

![Fin Browser](src/assets/icons/icon.png)

## About

Fin is a desktop web browser built with Electron that prioritizes:

- **Functional browsing engine** - Real web browsing using Chromium webviews
- **Clean design** - Dark-first UI with calm, technical aesthetics
- **Tab management** - Full tab support with groups (coming soon)
- **Navigation** - Back, forward, reload, home
- **Search/Address bar** - Combined URL input and search with shortcuts
- **History** - Visit history with search and grouping
- **Bookmarks** - Save and organize your favorite pages
- **Downloads** - Download manager (foundation laid)
- **Settings** - Comprehensive settings organization
- **Browser profiles** - Multiple user profiles
- **Visual identity** - Subtle fish-inspired design elements
- **Clean architecture** - Modular codebase for future expansion

## Design Philosophy

Fin follows these principles:

- **Technology first, aquatic identity second** - The fish concept is subtle
- **Intentional > Decorative** - Every element has a purpose
- **Usable > Flashy** - Functionality over visual impressiveness
- **Recognizable > Trendy** - Classic browser patterns with Fin personality

### What Fin Is NOT

- NOT an AI-generated UI with excessive gradients and glassmorphism
- NOT a children's fish app with cartoon illustrations
- NOT a dashboard pretending to be a browser
- NOT a mockup - this is a functional browser

## Project Structure

```
fin-browser/
├── src/
│   ├── main/           # Main process (Electron)
│   │   └── main.js     # Entry point, window management, IPC
│   ├── preload/        # Preload scripts
│   │   └── preload.js  # Secure bridge between main and renderer
│   ├── renderer/       # Renderer process (UI)
│   │   ├── index.html  # Main HTML
│   │   ├── renderer.js # UI logic, tabs, navigation
│   └── styles/         # CSS stylesheets
│       └── main.css    # Main stylesheet with design tokens
├── services/           # Backend services
│   ├── storage.js      # SQLite database operations
│   └── theme.js        # Theme management
├── assets/             # Static assets
│   ├── icons/          # Application icons
│   └── images/         # Images and illustrations
├── package.json        # Node.js dependencies
├── forge.config.js     # Electron Forge configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fin-browser
```

2. Install dependencies:
```bash
npm install
```

3. Start the development version:
```bash
npm start
```

### Building for Production

Package the application:
```bash
npm run package
```

Create distributable installers:
```bash
npm run make
```

## Features

### Phase 1 (Implemented)

- ✅ Browser shell with custom chrome
- ✅ Chromium webview engine
- ✅ URL navigation
- ✅ Back/forward/reload/home
- ✅ Tab system (create, close, switch)
- ✅ New tab page
- ✅ Basic settings

### Phase 2 (In Progress)

- 🔄 Bookmarks system
- 🔄 History tracking
- 🔄 Downloads foundation
- 🔄 Keyboard shortcuts
- 🔄 Sidebar navigation
- 🔄 Theme system (6 themes included)

### Phase 3 (Planned)

- ⬜ Profiles management
- ⬜ Private windows
- ⬜ Site permissions
- ⬜ Privacy center
- ⬜ Tab search
- ⬜ Command palette

### Phase 4 (Future)

- ⬜ Workspaces
- ⬜ Resource center
- ⬜ Tab sleeping
- ⬜ Reading list
- ⬜ AI tools

### Phase 5 (Later)

- ⬜ Extensions support
- ⬜ Sync functionality
- ⬜ Advanced privacy features
- ⬜ Experimental flags

## Themes

Fin includes 6 built-in themes:

1. **Deep Sea** - Dark navy + cyan (default)
2. **Abyss** - Near-black + blue-gray
3. **Reef** - Dark teal + green
4. **Arctic** - Light gray + icy blue
5. **Sunset** - Dark navy + muted orange
6. **Monochrome** - Black + white + gray

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+T` | New tab |
| `Ctrl+W` | Close tab |
| `Ctrl+L` | Focus address bar |
| `Ctrl+Tab` | Next tab |
| `Ctrl+Shift+Tab` | Previous tab |
| `Alt+Left` | Go back |
| `Alt+Right` | Go forward |
| `F5` or `Ctrl+R` | Reload |
| `Ctrl+K` | Command palette |
| `Escape` | Hide overlays |

## Search Shortcuts

Type these in the address bar followed by a space:

- `g` - Google search
- `yt` - YouTube search
- `gh` - GitHub search
- `r` - Reddit search

Example: `yt cats` searches YouTube for "cats"

## Internal Pages

Fin has several internal pages accessible via `fin://` URLs:

- `fin://home` - Start page
- `fin://settings` - Settings
- `fin://bookmarks` - Bookmarks manager
- `fin://history` - Browsing history
- `fin://downloads` - Download manager
- `fin://reading-list` - Reading list
- `fin://privacy` - Privacy center

## Architecture

### Main Process

The main process handles:
- Window creation and management
- IPC communication
- Database operations (SQLite)
- Native dialogs
- Session management

### Renderer Process

The renderer process handles:
- UI rendering
- Tab management
- Navigation logic
- User interactions
- Webview embedding

### Storage

Data is stored in SQLite database:
- Profiles
- Bookmarks
- History
- Downloads
- Settings
- Reading list

## Security Considerations

- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC boundaries
- Webview partitioning for sessions
- Input validation on IPC handlers

## Development Guidelines

1. **Do not fake functionality** - If something isn't implemented, mark it as experimental
2. **Maintain design consistency** - Follow the established design tokens
3. **Keep the aquatic theme subtle** - Technology first, fish second
4. **Test across window sizes** - Support 1280x720 to 2560x1440
5. **Respect accessibility** - Keyboard navigation, focus states, ARIA labels

## License

MIT License

---

Built with ❤️ and Electron
