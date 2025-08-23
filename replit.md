# Eclipse AI Dashboard

## Overview

This is a full-stack AI dashboard application built for RE/MAX Eclipse, featuring a cosmic-themed UI with glassmorphism design. The application provides a comprehensive platform for managing leads, agents, calls, and analytics with a mystical moon/eclipse aesthetic.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom cosmic theme variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL session store
- **API**: RESTful API endpoints for CRUD operations

### Design System
- **Theme**: Cosmic Eclipse with custom CSS variables
- **Color Palette**: Deep night backgrounds, lunar glass panels, eclipse glows
- **Components**: Glassmorphism cards, cosmic buttons, animated star fields
- **Typography**: Custom font stack with cosmic styling

## Key Components

### Data Models
- **Users**: Authentication and profile management
- **Agents**: AI agents with voice, phone, and configuration settings
- **Leads**: Customer leads with sentiment analysis and quality scoring
- **Calls**: Call records with session tracking and analytics

### UI Components
- **StarField**: Animated background with twinkling stars
- **GlassmorphicCard**: Frosted glass effect containers
- **CosmicButton**: Themed buttons with glow effects
- **Sidebar**: Fixed navigation with cosmic styling

### Pages
- **Login**: Authentication with magic link option
- **Dashboard**: Main overview with cosmic stats and quick actions
- **Leads**: Lead management with sentiment indicators
- **All Agents**: Agent configuration and management
- **Batch Calls**: Mass calling campaign management
- **Call History**: Historical call data and analytics
- **Analytics**: Performance metrics and insights
- **Numbers**: Phone number management
- **Settings**: User preferences and configuration

## Data Flow

1. **Authentication**: Simple session-based authentication with redirect flow
2. **API Requests**: TanStack Query handles server state with automatic caching
3. **Database Operations**: Drizzle ORM provides type-safe database interactions
4. **Real-time Updates**: Query invalidation for fresh data after mutations
5. **Error Handling**: Comprehensive error boundaries and user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production builds
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle pushes schema changes to PostgreSQL

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Production Deployment
- Single Node.js process serving both API and static files
- PostgreSQL database with session storage
- Static file serving from `dist/public`

## Changelog

```
Changelog:
- August 23, 2025. Major UI/UX Enhancement - Implemented Framer-style advanced interactions:
  * Enhanced glassmorphism effects with multiple intensity levels
  * Advanced scroll animations and text reveal effects
  * Micro-interactions throughout the interface
  * 3D card tilt effects with mouse tracking
  * Interactive parallax starfield with mouse responsiveness
  * Morphing gradient animations and aurora effects
  * Custom cursor with hover states and trail effects
  * Progressive entrance animations with staggered timing
  * Enhanced hover states with sophisticated transforms
  * Dynamic glow overlays and floating particle effects
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```