# Overview

This is a Solo Leveling-inspired task management and experience point (XP) tracking system. The application gamifies personal development by organizing tasks across different realms (Scholar, Technomancer, Entrepreneur, etc.) and tracking progress through three core attributes: Abilities, Skills, and Physical. Users can create tasks with varying difficulty levels, track completion progress, and earn XP to level up their character. The system includes features like deadline notifications, caution alerts for approaching deadlines, task archiving, and a comprehensive dashboard showing overall progression.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom gaming-themed design system featuring cyberpunk colors and animations
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API with JSON responses
- **Database Integration**: Drizzle ORM with PostgreSQL dialect
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Middleware**: Express middleware for JSON parsing, CORS, logging, and error handling

## Data Storage Solutions
- **Database**: PostgreSQL (configured for production deployment)
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Schema Design**: Three main entities - Tasks, User Progress, and XP Entries
- **Development Storage**: In-memory storage implementation for local development

## Authentication and Authorization
- Currently implements basic session handling through Express middleware
- No explicit authentication system implemented yet - appears to be designed for single-user experience

## Key Features Architecture
- **XP Calculation System**: Complex leveling algorithm with exponential growth and difficulty-based XP rewards
- **Task Management**: CRUD operations with status tracking (not_started, in_progress, completed)
- **Real-time Updates**: Live clock component and progress tracking
- **Gamification Elements**: Level progression, realm-based organization, and achievement-style notifications
- **Responsive Design**: Mobile-first approach with custom breakpoints and gaming aesthetics

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query for state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tools**: Vite with TypeScript support, PostCSS, and Tailwind CSS

## UI and Styling
- **Component Library**: Shadcn/ui built on Radix UI primitives
- **Icons**: Heroicons for React, Font Awesome (via CSS classes)
- **Fonts**: Google Fonts (Orbitron and Inter) for gaming aesthetics
- **Styling**: Tailwind CSS with custom gaming theme configuration

## Database and Backend
- **Database**: Neon Database (PostgreSQL serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Backend Framework**: Express.js with TypeScript support
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## Form and Validation
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod schema validation integrated with Drizzle
- **UI Components**: Form components from Shadcn/ui

## Development and Build
- **Development**: TSX for TypeScript execution, ESBuild for production builds
- **Development Experience**: Replit-specific plugins for runtime error handling and debugging
- **Type Safety**: Full TypeScript integration across frontend, backend, and shared schemas

## Utilities and Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Styling Utilities**: clsx and tailwind-merge for conditional classes
- **Utility Libraries**: class-variance-authority for component variants