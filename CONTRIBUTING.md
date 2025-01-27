# Contributing to PDF Table Extractor

Thank you for your interest in contributing to PDF Table Extractor! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/pdf-table-extractor.git
cd pdf-table-extractor
```

3. Install dependencies:
```bash
pnpm install
```

4. Create a new branch for your feature/fix:
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

1. Make your changes
2. Run the development server to test:
```bash
pnpm run dev
```

3. Ensure your code follows the project's coding standards:
```bash
pnpm run lint
```

4. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) specification:
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue with PDF rendering"
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure your PR description clearly describes the problem and solution
3. Include screenshots or GIFs for UI changes
4. Link any related issues using GitHub's keywords (Fixes #123)

## Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use proper TypeScript types instead of `any`

## Commit Message Guidelines

Follow the Conventional Commits specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc)
- `refactor:` - Code changes that neither fix a bug nor add a feature
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Changes to build process or auxiliary tools

## Project Structure

```
pdf-table-extractor/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   └── ...
│   ├── lib/           # Utility functions
│   ├── store/         # Zustand store
│   └── ...
├── public/            # Static assets
└── ...
```

## Testing

- Add tests for new features
- Ensure existing tests pass
- Test across different browsers
- Test with different PDF types and sizes

## Questions or Problems?

- Open an issue for bugs
- Use discussions for general questions
- Tag maintainers for urgent issues

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 