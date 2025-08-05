# Gomma 

A web application that removes backgrounds from images using AI technology. Built with Next.js.

## Features

- **AI-Powered Background Removal** - Remove backgrounds instantly with high precision
- **Drag & Drop Interface** - Simply drag your images or click to upload
- **Real-time Preview** - See your original and processed images side by side
- **Modern UI** - Clean, minimalist design with glassmorphism effects
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **High Quality Output** - Download processed images in PNG format

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API**: Remove.bg API
- **Language**: TypeScript

## Project Structure

```
gomma/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── spinner.tsx
├── lib/
│   └── utils.ts             # Utility functions
├── public/
│   └── logo.png             # Application logo
└── tailwind.config.ts       # Tailwind configuration
```

### Supported Image Formats

- JPG/JPEG
- PNG
- WebP
- Maximum file size: 10MB

## Usage

1. **Upload an Image**
   - Drag and drop an image onto the upload area
   - Or click to browse and select a file

2. **Remove Background**
   - Click the "Remove Background" button
   - Wait for AI processing (usually 2-5 seconds)

3. **Download Result**
   - Preview the before/after comparison
   - Click "Download Your Image" to save the result

