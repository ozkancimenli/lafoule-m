# lafoule-m - Professional Portfolio & Blog

A modern, high-performance portfolio and blog website built with Next.js 13, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Modern Tech Stack**: Next.js 13 with App Router, TypeScript, Tailwind CSS
- **Content Management**: MDX-based blog with Contentlayer
- **Performance**: Optimized images, lazy loading, and advanced caching
- **SEO**: Comprehensive meta tags, sitemap, and structured data
- **PWA**: Progressive Web App with offline support
- **Dark/Light Mode**: Theme switching with system preference detection

### Advanced Features
- **TypeScript**: Full type safety and better developer experience
- **Testing**: Jest and Testing Library for comprehensive testing
- **Security**: Input validation, rate limiting, and security headers
- **Monitoring**: Error tracking and performance monitoring
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Code Quality**: Prettier, ESLint, and Husky for consistent code
- **Admin Panel**: Content preview, draft mode, and scheduling

### Performance Optimizations
- **Image Optimization**: Next.js Image with lazy loading and WebP/AVIF support
- **Bundle Optimization**: Tree shaking and code splitting
- **Caching**: Advanced caching strategies for better performance
- **Core Web Vitals**: Optimized for Google's Core Web Vitals

## 🛠️ Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX with Contentlayer
- **Database**: Supabase
- **Deployment**: Vercel
- **Testing**: Jest, Testing Library
- **Code Quality**: ESLint, Prettier, Husky
- **CI/CD**: GitHub Actions

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ozkancimenli/lafoule-m.git
cd lafoule-m
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GA_ID=your_google_analytics_id
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
HF_ACCESS_TOKEN=your_huggingface_access_token
```

5. Run the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Content Management

### Adding Blog Posts
1. Create a new folder in `content/` with your post slug
2. Add an `index.mdx` file with frontmatter
3. The post will automatically appear in your blog

### Auto Blog Generation
```bash
npm run generate:auto-blog
```

This will generate a new blog post using AI and Unsplash images.

## 🔧 Development

### Code Quality
```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Pre-commit Hooks
Husky is configured to run linting and formatting before each commit.

## 📊 Performance

The project is optimized for performance with:
- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: Optimized for Google's metrics
- **Bundle Size**: Minimized with tree shaking and code splitting
- **Image Optimization**: Next.js Image with modern formats

## 🔒 Security

- **Input Validation**: Zod schemas for all user inputs
- **Rate Limiting**: API endpoint protection
- **Security Headers**: Comprehensive security headers
- **Content Security Policy**: Strict CSP implementation

## 📈 Monitoring

- **Error Tracking**: Built-in error reporting system
- **Performance Monitoring**: Core Web Vitals tracking
- **Analytics**: Google Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ozkan Cimenli**
- Website: [ozkancimenli.com](https://ozkancimenli.com)
- GitHub: [@ozkancimenli](https://github.com/ozkancimenli)
- LinkedIn: [ozkancimenli](https://linkedin.com/in/ozkancimenli)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Contentlayer](https://contentlayer.dev/) for content management
- [Supabase](https://supabase.com/) for the backend services