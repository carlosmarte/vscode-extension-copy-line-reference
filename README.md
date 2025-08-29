# VSCode Extension Line

A VSCode extension for copying relative file paths with line numbers.

## Features

- **Copy Relative File Path + Line**: Right-click on any line number in the editor to copy the relative file path with the current line number
- **Multi-line Selection**: When multiple lines are selected, it copies the range (e.g., `file.ts:10-15`)
- **Workspace Relative**: Automatically calculates the path relative to your workspace root
- **Cross-platform**: Works on Windows, macOS, and Linux

## Usage

1. **Single Line**: Right-click on any line number in the editor
2. **Multiple Lines**: Select multiple lines, then right-click on the line numbers
3. **Context Menu**: Select "Copy Relative File Path + Line" from the context menu
4. **Clipboard**: The path is automatically copied to your clipboard

### Examples

- Single line: `src/components/Button.tsx:42`
- Multiple lines: `src/components/Button.tsx:42-45`

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- VSCode

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Commands

- **Compile**: `npm run compile`
- **Watch**: `npm run watch` (automatically recompiles on changes)
- **Lint**: `npm run lint`
- **Test**: `npm test`

### Running the Extension

1. Open the project in VSCode
2. Press `F5` to start debugging
3. A new VSCode window will open with your extension loaded
4. Right-click on any line number in the editor
5. Select "Copy Relative File Path + Line" from the context menu

### Testing

Run the test suite:

```bash
npm test
```

### Building for Production

To create a VSIX package for distribution:

```bash
./scripts/package.sh
```

Or manually:

```bash
npm install -g @vscode/vsce
vsce package
```

## Project Structure

```
vscode-ext-line/
├── src/                    # Source code
│   ├── extension.ts       # Main extension entry point
│   └── test/              # Test files
│       ├── runTest.ts     # Test runner
│       └── suite/         # Test suites
├── .vscode/               # VSCode configuration
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.json         # ESLint configuration
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT
