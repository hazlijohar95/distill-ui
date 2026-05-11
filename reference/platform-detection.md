# Platform Detection Guide

How to identify the UI platform and adapt extraction strategy accordingly.

## Detection Signals

### Web Frontend
**Look for:** package.json with React/Vue/Svelte/Angular, .tsx/.jsx/.vue/.svelte files, CSS/SCSS files, tailwind.config.*
**Token sources:** CSS custom properties, Tailwind config, theme files, styled-components ThemeProvider
**Components:** Exported functions/classes with JSX/template return, .vue SFC, .svelte files

### Native Desktop (Rust/C++/Swift)
**Look for:** Cargo.toml with UI crates (gpui, iced, egui), theme/*.rs, appearance.rs, .swift with View protocol
**Token sources:** Rust structs/enums for colors, trait-based theming, YAML/TOML theme files, Swift Color extensions
**Components:** Structs implementing View/Widget/Element traits, view builder functions

### Mobile
**Look for:** .swift with SwiftUI View, @Composable functions, .dart Widget classes, React Native StyleSheet
**Token sources:** SwiftUI modifiers, XML themes, Dart ThemeData, StyleSheet.create constants
**Components:** View-conforming structs, Composable functions, Widget subclasses

### Terminal UI
**Look for:** TUI crate deps (ratatui, crossterm), blessed/ink in package.json, terminal color constants
**Token sources:** Color enums, style structs, ANSI color constants, border character definitions
**Components:** Widget/Component implementations rendering to terminal cells

## Multi-Surface Detection

Some codebases have multiple UI surfaces (e.g., web dashboard + CLI tool, or desktop app + marketing site). When detected:

1. Identify each surface and its platform
2. Determine which shares tokens/components with which
3. Extract the shared design system core
4. Document surface-specific adaptations
5. The production showcase should demonstrate the PRIMARY surface (usually the richest one)

## Adaptation Per Platform

### Token Format
| Platform | Native format | Example |
|----------|--------------|---------|
| Web | CSS custom properties | `--color-primary: #8838ff` |
| Rust | const/struct | `pub const PRIMARY: ColorU = ColorU::rgba(136, 56, 255, 255)` |
| Swift | extension | `static let primary = Color(hex: 0x8838FF)` |
| Flutter | ThemeData | `primaryColor: Color(0xFF8838FF)` |
| Terminal | enum/const | `const PRIMARY: Color = Color::Rgb(136, 56, 255)` |

### Component Documentation
- Web: Props interface, className patterns, variants via CVA/styled
- Rust: Trait implementations, builder pattern, configuration structs
- Swift: ViewModifier, Environment values, preference keys
- Flutter: Widget parameters, ThemeData consumers, InheritedWidget

### Layout Systems
- Web: CSS Grid/Flexbox, media queries, container queries
- Rust: Custom layout engines, constraint-based, flex-like traits
- Swift: VStack/HStack/ZStack, GeometryReader, LazyGrid
- Flutter: Column/Row/Stack, LayoutBuilder, Slivers
- Terminal: Fixed grid cells, box-drawing, percentage widths

## Grep Patterns Per Platform

### Colors
```bash
# Web
grep -rn "var(--\|#[0-9a-fA-F]\{3,8\}\|rgb\|hsl" --include="*.{ts,tsx,css,scss}"

# Rust
grep -rn "ColorU\|Color::\|color(\|rgba\|rgb(" --include="*.rs"

# Swift
grep -rn "Color(\|\.foregroundColor\|\.background\|UIColor" --include="*.swift"

# Flutter
grep -rn "Color(0x\|Colors\.\|ColorScheme" --include="*.dart"
```

### Typography
```bash
# Web
grep -rn "font-family\|font-size\|font-weight\|line-height" --include="*.{css,scss,ts,tsx}"

# Rust
grep -rn "font_size\|font_weight\|font_family\|line_height" --include="*.rs"

# Swift
grep -rn "\.font(\|Font\.\|UIFont" --include="*.swift"
```

### Spacing
```bash
# Web
grep -rn "padding\|margin\|gap\|space-" --include="*.{css,scss}"

# Rust
grep -rn "padding\|margin\|spacing\|gap\|inset" --include="*.rs"

# Swift
grep -rn "\.padding\|\.frame\|\.spacing\|EdgeInsets" --include="*.swift"
```
