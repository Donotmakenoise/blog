
# Full-Stack Blog Application

A modern, full-stack blog application built with React, Express.js, and PostgreSQL. Features a clean UI with shadcn/ui components, markdown-based content management, admin panel, and contact form functionality.

## 🚀 Features

### Frontend
- **React 18** with TypeScript and Vite
- **shadcn/ui** component library with dark/light theme support
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Tailwind CSS** for styling
- **Responsive design** with mobile-first approach
- **Markdown rendering** with syntax highlighting
- **Form validation** with React Hook Form and Zod

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with Drizzle ORM
- **RESTful API** design
- **Environment-based configuration**
- **Error handling** and logging middleware
- **Session management**

### Content Management
- **Admin panel** for CRUD operations
- **Markdown support** for blog posts
- **Contact form** with database persistence
- **Post categorization** and tagging
- **Search functionality**
- **View tracking**

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── layout.tsx  # Layout component
│   │   │   ├── navigation.tsx
│   │   │   ├── post-modal.tsx
│   │   │   └── tinymce-editor.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Express.js backend
│   ├── db.ts              # Database configuration
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Vite development integration
├── shared/                # Shared TypeScript schemas
│   └── schema.ts          # Zod validation schemas
├── posts/                 # Markdown blog posts
├── migrations/            # Database migration files
├── package.json           # Dependencies and scripts
├── drizzle.config.ts      # Database configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite build configuration
```

## 🛠 Technology Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and TypeScript
- **Vite**: Fast build tool and development server
- **Wouter**: Lightweight client-side router
- **TanStack Query**: Powerful data fetching and caching
- **shadcn/ui**: High-quality, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Performant forms with validation
- **Zod**: TypeScript-first schema validation
- **Framer Motion**: Animation library
- **TinyMCE**: Rich text editor for admin panel

### Backend Technologies
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **Drizzle ORM**: Type-safe database toolkit
- **PostgreSQL**: Robust relational database
- **Neon Database**: Serverless PostgreSQL
- **Zod**: Runtime type validation
- **Express Session**: Session middleware

### Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database migration tool

## 🗄 Database Schema

### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  read_time VARCHAR(50),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon Database recommended)
- Basic knowledge of React and Express.js

### Environment Setup

1. **Database Configuration**
   - Set up a PostgreSQL database (Neon Database recommended for Replit)
   - Get your database connection string

2. **Environment Variables**
   ```bash
   # Set in Replit Secrets or .env file
   DATABASE_URL=your_postgresql_connection_string
   ADMIN_PASSWORD=your_admin_password  # Default: admin123
   NODE_ENV=development
   ```

### Installation & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📋 API Documentation

### Public Endpoints

#### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:slug` - Get post by slug
- `GET /api/posts/search/:query` - Search posts
- `GET /api/posts/tag/:tag` - Get posts by tag

#### Contact
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/admin/login` - Admin login

#### Posts Management
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post
- `GET /api/admin/stats` - Get blog statistics

#### Contact Management
- `GET /api/admin/contact-submissions` - Get all submissions
- `PATCH /api/admin/contact-submissions/:id/read` - Mark as read
- `DELETE /api/admin/contact-submissions/:id` - Delete submission
- `GET /api/admin/contact-submissions/unread-count` - Get unread count

## 🎨 Component Architecture

### UI Components (shadcn/ui)
The application uses a comprehensive set of UI components including:
- Navigation components (breadcrumb, menubar, navigation-menu)
- Form components (input, textarea, select, checkbox, radio-group)
- Layout components (card, sheet, dialog, drawer)
- Display components (badge, avatar, skeleton, toast)
- Interactive components (button, dropdown-menu, context-menu)

### Custom Components
- **Layout**: Main application layout with navigation
- **Navigation**: Responsive navigation with mobile support
- **PostModal**: Modal for creating/editing posts
- **TinyMCE Editor**: Rich text editor integration
- **NotificationBox**: Toast notification system

## 🔧 Configuration Files

### Tailwind CSS (`tailwind.config.ts`)
- Custom color scheme
- Typography plugin
- Animation utilities
- Responsive design utilities

### Vite (`vite.config.ts`)
- React plugin configuration
- Replit-specific plugins
- Proxy configuration for development
- Build optimization

### Drizzle (`drizzle.config.ts`)
- Database connection configuration
- Migration settings
- Schema paths

## 📝 Content Management

### Blog Posts
- Written in Markdown with frontmatter
- Stored in `/posts` directory
- Automatically synced with database
- Support for categories, tags, and metadata

### Admin Panel Features
- Rich text editor (TinyMCE)
- Post preview functionality
- Draft/published status management
- SEO-friendly slug generation
- Category and tag management

### Contact Form
- Validation with Zod schemas
- Email notifications
- Admin dashboard for managing submissions
- Read/unread status tracking

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Protection**: Drizzle ORM prepared statements
- **Admin Authentication**: Password-based admin access
- **Error Handling**: Structured error responses
- **CORS Configuration**: Proper cross-origin settings

## 🚀 Deployment on Replit

### Replit Configuration
The application is optimized for Replit deployment:
- Automatic dependency installation
- Environment variable management through Secrets
- Port 5000 configuration for web access
- Development and production build support

### Environment Setup
1. Fork or import the repository to Replit
2. Set environment variables in Secrets:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ADMIN_PASSWORD`: Admin panel password
3. Run the application using the Run button

### Database Migration
```bash
# Apply database migrations
npm run db:push
```

## 🔄 Development Workflow

### Adding New Features
1. Create feature branch or fork (if using Replit Projects)
2. Implement changes with proper TypeScript types
3. Update database schema if needed
4. Test thoroughly in development
5. Merge changes to main branch

### Database Changes
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Test with sample data

### UI Components
1. Use existing shadcn/ui components when possible
2. Follow Tailwind CSS utility patterns
3. Ensure responsive design
4. Test with both light and dark themes

## 📊 Performance Considerations

- **Database**: Indexed queries for fast post retrieval
- **Caching**: TanStack Query for client-side caching
- **Bundle Size**: Code splitting with Vite
- **Images**: Optimized loading and responsive images
- **SEO**: Proper meta tags and structured data

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is set correctly
   - Check database service status
   - Ensure network connectivity

2. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript compilation errors
   - Verify all imports are correct

3. **Development Server Issues**
   - Ensure port 5000 is available
   - Check for conflicting processes
   - Restart the development server

### Database Issues
- **Table doesn't exist**: Run `npm run db:push`
- **Migration errors**: Check migration files in `/migrations`
- **Connection timeout**: Verify database URL and credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request with detailed description

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Drizzle** for the excellent TypeScript ORM
- **Replit** for the hosting platform
- **Neon** for serverless PostgreSQL

---

For questions or support, please check the code documentation or create an issue in the repository.
