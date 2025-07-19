# ToDo Management System - Frontend

A modern React TypeScript frontend for the ToDo Management System, built with Vite.

## Features

- ✅ Create, edit, and delete tasks
- 📋 Organize tasks with categories
- 🎯 Set priorities (Low, Medium, High, Urgent)
- ⏰ Track task status (Pending, In Progress, Completed, Cancelled)
- 📊 Dashboard with statistics and charts
- 🔍 Filter and search tasks
- 📱 Responsive design
- 🎨 Clean and modern UI

## Tech Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://127.0.0.1:8000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard/      # Dashboard component
│   ├── TodoList/       # Todo list component
│   ├── TodoForm/       # Todo form component
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## API Integration

The frontend communicates with the Django REST API backend through:
- Axios HTTP client with base URL `/api`
- TanStack Query for state management and caching
- TypeScript interfaces for type safety

## Environment Configuration

The application uses Vite's proxy configuration to route API calls to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## Contributing

1. Follow TypeScript best practices
2. Use the existing component structure
3. Maintain consistent styling patterns
4. Ensure proper error handling
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
