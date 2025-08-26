# ERP Dashboard - The Benchmark Hifz Campus

A modern, responsive ERP (Enterprise Resource Planning) dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This application replicates a professional HR management system interface with a clean, intuitive design.


## 🚀 Features

### Core Functionality
- **Employee Profiling System**
  - Qualification Type & Management
  - Skill Type & Rating System
  - Position Type Configuration
  - Employee Profile Management
  - Employment Records

- **Time & Attendance Management**
  - Holiday Type & Calendar Management
  - Attendance Policies & Groups
  - Shift Management
  - Device Registration
  - Leave Management System
  - Attendance Processing (Daily/Monthly)
  - Bulk Attendance Operations

### Technical Features
- **Responsive Design** - Optimized for desktop and mobile devices
- **Component-Based Architecture** - Scalable and maintainable code structure
- **TypeScript Support** - Full type safety and IntelliSense
- **Modern UI Components** - Professional enterprise-grade interface
- **Custom Styling** - Tailwind CSS with custom color scheme
- **Interactive Elements** - Search functionality, favorites, and navigation

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Font Awesome
- **Development**: ESLint, PostCSS
- **Runtime**: React 19

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── MenuSection.tsx
│   │   └── shared/            # Layout components
│   │       ├── DashboardLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── MainContent.tsx
│   │       └── Footer.tsx
│   ├── lib/                   # Utility functions and data
│   │   └── menuData.ts
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0a74da`
- **Background**: `#f8f9fa`, `#f9fafb`
- **Sidebar**: `#e2e6ea`
- **Header**: `#d0d7de`
- **Borders**: `#a0aec0`
- **Text**: `#333`, `#555`

### Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **Base Size**: 13px
- **Heading Size**: 14px

## 🧩 Component Architecture

### Reusable UI Components (`components/ui/`)
- **Button**: Flexible button with variants (primary/secondary)
- **SearchInput**: Search input with Font Awesome icon
- **MenuSection**: Collapsible menu sections with favorites

### Layout Components (`components/shared/`)
- **DashboardLayout**: Main application wrapper
- **Sidebar**: Navigation with logo and menu items
- **Header**: Top bar with actions and real-time clock
- **Breadcrumb**: Navigation breadcrumbs
- **Footer**: Status bar with user info and branding

## 🔧 Customization

### Adding New Menu Items

1. **Update types** in `src/types/index.ts`
2. **Add data** in `src/lib/menuData.ts`
3. **Use in components** via props

### Styling Customization

- Modify colors in component files
- Update global styles in `src/app/globals.css`
- Extend Tailwind configuration as needed

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
```

Deploy to Vercel with automatic CI/CD integration.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Responsive Design

- **Desktop**: Full sidebar and header layout
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Responsive navigation and content areas

## 🔒 Best Practices

- **Type Safety**: Full TypeScript coverage
- **Component Reusability**: Modular, composable components
- **Performance**: Next.js optimization and lazy loading
- **Accessibility**: ARIA labels and semantic HTML
- **Code Quality**: ESLint configuration and consistent formatting

## 🐛 Troubleshooting

### Common Issues

1. **Font Awesome Icons Not Loading**
   - Ensure `'use client'` directive is added to components using icons
   - Verify Font Awesome packages are installed

2. **Styling Issues**
   - Check Tailwind CSS configuration
   - Ensure global styles are properly imported

3. **Build Errors**
   - Run `npm run lint` to check for linting errors
   - Verify all imports and type definitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

