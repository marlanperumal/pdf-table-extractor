# PDF Table Extractor

A React-based web application for extracting tabular data from PDF documents with a user-friendly interface for defining and configuring table columns.

## Features

- 📄 PDF file upload and viewing
- 🔍 Interactive area selection
- 📏 Precise coordinate-based selection
- 📊 Column management system
- 💾 Configuration save/load functionality
- 📤 CSV export capability
- 📱 Responsive split-panel layout

## Tech Stack

- **Framework**: React 18
- **Package Manager**: pnpm
  - (npm or other package manager may be used instead but only the pnpm lock file is maintained)
- **Build Tool**: Vite
- **Language**: TypeScript
- **PDF Processing**: react-pdf
- **State Management**: Zustand
- **UI Components**: 
  - Radix UI primitives
  - Tailwind CSS
  - Lucide React icons
- **Development Tools**:
  - ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-table-extractor.git
cd pdf-table-extractor
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Upload a PDF file by dragging and dropping or using the file selector
2. Use the selection tools to define table areas
3. Configure columns using the side panel
4. Export the extracted data as CSV

## Project Structure 