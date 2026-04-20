# 🏗️ System Architecture

This document provides a comprehensive overview of Yaqeen's system architecture, design decisions, and technical implementation details.

## 📋 Table of Contents

- [Overview](#overview)
- [System Components](#system-components)
- [Technology Stack](#technology-stack)
- [Data Architecture](#data-architecture)
- [API Design](#api-design)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)
- [Scalability](#scalability)
- [Deployment](#deployment)

---

## 🌟 Overview

### Architecture Principles

Yaqeen follows these core architectural principles:

- **📱 Mobile-First**: Responsive design for all devices
- **⚡ Performance**: Fast loading and smooth interactions
- **🔒 Security**: Secure by default with privacy protection
- **📈 Scalability**: Designed to handle growth
- **🛠️ Maintainability**: Clean, documented, and testable code
- **🌐 Accessibility**: WCAG compliant for all users

### System Goals

- **Reliability**: 99.9% uptime with fault tolerance
- **Performance**: <3 second page loads globally
- **Security**: SOC 2 compliant data protection
- **Scalability**: Support millions of users
- **Maintainability**: Easy to update and extend

---

## 🧩 System Components

### Frontend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  React Components│    │   Tailwind CSS  │
│   (Pages)       │◄──►│   (UI Library)  │◄──►│  (Styling)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Routes    │    │   State Mgmt    │    │   PWA Features  │
│   (Serverless)  │    │   (Context)     │    │   (Offline)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Next.js App Router Structure

```
app/
├── layout.js              # Root layout with providers
├── page.js               # Home page
├── globals.css           # Global styles
├── quran/
│   ├── page.js          # Quran section
│   └── [surah]/
│       └── page.js      # Individual surah pages
├── hadith/
│   ├── page.js          # Hadith collections
│   └── [collection]/
│       └── page.js      # Collection pages
├── tafsir/
│   └── page.js          # Tafsir browser
├── articles/
│   └── page.js          # Islamic articles
└── api/                 # API routes
    ├── quran/
    ├── hadith/
    └── search/
```

### Backend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Serverless    │    │   Database      │
│   (Vercel)      │◄──►│   Functions     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Caching       │    │   CDN           │    │   Search        │
│   (Redis)       │    │   (Vercel)      │    │   (Algolia)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### API Layer

- **RESTful Endpoints**: Standard HTTP methods
- **GraphQL Support**: Flexible queries (planned)
- **Rate Limiting**: Per-user and per-endpoint limits
- **Caching**: Redis for frequently accessed data
- **CDN**: Global content delivery

---

## 🛠️ Technology Stack

### Frontend Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 16.2.4 | React framework with SSR/SSG |
| **UI Library** | React | 19.2.4 | Component-based UI development |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Language** | JavaScript | ES2022 | Core programming language |
| **State Mgmt** | React Context | Built-in | Global state management |
| **Routing** | Next.js Router | Built-in | Client-side routing |
| **Forms** | React Hook Form | Latest | Form handling and validation |

### Backend Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js | Server-side JavaScript execution |
| **API Framework** | Next.js API Routes | Serverless API endpoints |
| **Database** | PostgreSQL | Primary data storage |
| **ORM** | Prisma | Database access and migrations |
| **Caching** | Redis | High-performance caching |
| **Search** | Algolia | Full-text search capabilities |
| **File Storage** | AWS S3 | Static asset storage |

### DevOps & Deployment

| Category | Technology | Purpose |
|----------|------------|---------|
| **Hosting** | Vercel | Global CDN and serverless deployment |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Monitoring** | Vercel Analytics | Performance and usage monitoring |
| **Error Tracking** | Sentry | Error monitoring and reporting |
| **Security** | Vercel Security | Built-in security features |

### Development Tools

| Category | Tool | Purpose |
|----------|------|---------|
| **Code Quality** | ESLint | Code linting and style enforcement |
| **Testing** | Jest + React Testing Library | Unit and integration testing |
| **Type Checking** | TypeScript | Type safety (planned migration) |
| **Documentation** | JSDoc | Code documentation |
| **Version Control** | Git | Source code management |
| **Package Manager** | npm | Dependency management |

---

## 💾 Data Architecture

### Database Schema

#### Core Entities

```sql
-- Quran Tables
CREATE TABLE surahs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  arabic_name VARCHAR(255) NOT NULL,
  verses_count INTEGER NOT NULL,
  revelation_place VARCHAR(50),
  revelation_order INTEGER
);

CREATE TABLE verses (
  id SERIAL PRIMARY KEY,
  surah_id INTEGER REFERENCES surahs(id),
  verse_number INTEGER NOT NULL,
  arabic_text TEXT NOT NULL,
  verse_key VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  verse_id INTEGER REFERENCES verses(id),
  language_code VARCHAR(5) NOT NULL,
  translator_name VARCHAR(255),
  translation_text TEXT NOT NULL
);

-- Hadith Tables
CREATE TABLE hadith_collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  arabic_name VARCHAR(255),
  total_hadiths INTEGER
);

CREATE TABLE hadiths (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES hadith_collections(id),
  hadith_number INTEGER NOT NULL,
  arabic_text TEXT NOT NULL,
  grade VARCHAR(50),
  narrators TEXT[]
);

-- User Tables (Future)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content_type VARCHAR(50),
  content_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Flow

```
User Request → API Route → Database Query → Cache Check → Response
     ↓              ↓             ↓            ↓          ↓
  Browser      Next.js API    PostgreSQL    Redis     JSON
```

### Caching Strategy

#### Multi-Level Caching

1. **Browser Cache**: Static assets and API responses
2. **CDN Cache**: Global content delivery (Vercel Edge)
3. **Application Cache**: Redis for dynamic content
4. **Database Cache**: PostgreSQL query result caching

#### Cache Keys

```javascript
// Quran content
`quran:surah:${surahId}`
`quran:verse:${verseKey}`
`quran:translation:${verseKey}:${lang}`

// Hadith content
`hadith:collection:${collectionName}:${page}`
`hadith:single:${collectionName}:${hadithNumber}`

// Search results
`search:quran:${queryHash}:${page}`
`search:hadith:${queryHash}:${page}`
```

---

## 🔌 API Design

### RESTful API Structure

```
/api/v1/
├── quran/
│   ├── surahs              # GET - List all surahs
│   ├── surahs/[id]         # GET - Get specific surah
│   └── verses/[key]        # GET - Get specific verse
├── hadith/
│   ├── collections         # GET - List collections
│   ├── [collection]/hadiths # GET - Collection hadiths
│   └── [collection]/[number] # GET - Specific hadith
├── tafsir/
│   ├── tafsirs            # GET - Available tafsirs
│   └── [tafsir]/[verse]   # GET - Verse tafsir
├── search/
│   ├── quran              # GET - Search Quran
│   └── hadith             # GET - Search Hadith
└── user/
    ├── bookmarks          # GET/POST - User bookmarks
    └── preferences        # GET/PUT - User preferences
```

### API Response Format

#### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789",
    "version": "v1"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 114,
    "has_more": true
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested surah was not found",
    "details": {
      "resource": "surah",
      "id": 115
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

---

## 🔒 Security Architecture

### Authentication & Authorization

#### API Key System

```javascript
// API Key validation middleware
export function validateAPIKey(req, res, next) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');

  if (!apiKey) {
    return res.status(401).json({
      error: { code: 'AUTHENTICATION_REQUIRED' }
    });
  }

  // Validate API key against database/cache
  const keyData = await validateKey(apiKey);

  if (!keyData) {
    return res.status(401).json({
      error: { code: 'INVALID_API_KEY' }
    });
  }

  req.user = keyData;
  next();
}
```

#### Rate Limiting

```javascript
// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
};
```

### Data Protection

#### Encryption at Rest

- **Database**: PostgreSQL with encryption
- **File Storage**: AWS S3 with server-side encryption
- **Cache**: Redis with encryption in transit

#### HTTPS Everywhere

```javascript
// Next.js configuration for HTTPS
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ]
      }
    ];
  }
};
```

### Input Validation & Sanitization

```javascript
// Input validation schema
const searchSchema = z.object({
  q: z.string().min(1).max(500),
  language: z.enum(['ar', 'en']).optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  page: z.number().min(1).optional().default(1)
});

// Sanitization middleware
export function sanitizeInput(req, res, next) {
  // Sanitize query parameters
  Object.keys(req.query).forEach(key => {
    req.query[key] = sanitize(req.query[key]);
  });

  // Sanitize body data
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
}
```

---

## ⚡ Performance Considerations

### Frontend Optimization

#### Code Splitting

```javascript
// Dynamic imports for large components
const QuranReader = dynamic(() => import('../components/QuranReader'), {
  loading: () => <div>Loading...</div>
});

// Route-based code splitting (automatic in Next.js App Router)
```

#### Image Optimization

```javascript
// Next.js Image component with optimization
import Image from 'next/image';

<Image
  src="/quran-bg.jpg"
  alt="Quran background"
  width={1200}
  height={800}
  priority // Above the fold
  placeholder="blur"
  quality={85}
/>
```

#### Bundle Analysis

```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      };
    }
    return config;
  }
};
```

### Backend Optimization

#### Database Query Optimization

```sql
-- Optimized query with indexes
CREATE INDEX idx_verses_surah_verse ON verses(surah_id, verse_number);
CREATE INDEX idx_hadiths_collection ON hadiths(collection_id);

-- Efficient pagination
SELECT * FROM verses
WHERE surah_id = $1
ORDER BY verse_number
LIMIT $2 OFFSET $3;
```

#### Caching Strategy

```javascript
// Redis caching for API responses
const CACHE_TTL = 3600; // 1 hour

export async function getCachedData(key, fetcher) {
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetcher();
  await redis.setex(key, CACHE_TTL, JSON.stringify(data));

  return data;
}
```

### CDN & Edge Computing

#### Vercel Edge Functions

```javascript
// Edge function for global API responses
export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Run at the edge for minimal latency
  const data = await fetchFromDatabase(request);

  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' }
  });
}
```

---

## 📈 Scalability

### Horizontal Scaling

#### Database Scaling

- **Read Replicas**: Multiple read-only database instances
- **Connection Pooling**: Efficient database connection management
- **Sharding**: Data distribution across multiple databases (future)

#### API Scaling

- **Serverless Functions**: Auto-scaling based on demand
- **Load Balancing**: Distributed across global regions
- **Circuit Breakers**: Prevent cascade failures

### Vertical Scaling

#### Resource Optimization

```javascript
// Memory optimization
const memoizedData = useMemo(() => {
  return expensiveCalculation(props.data);
}, [props.data]);

// Virtual scrolling for large lists
<VirtualizedList
  items={verses}
  itemHeight={60}
  containerHeight={400}
/>
```

### Monitoring & Alerting

#### Key Metrics

- **Response Time**: API response times < 200ms
- **Error Rate**: < 0.1% error rate
- **Throughput**: Handle 10,000+ concurrent users
- **Uptime**: 99.9% service availability

#### Monitoring Tools

```javascript
// Application monitoring
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

// Performance monitoring
if (typeof window !== 'undefined') {
  // Web Vitals tracking
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    // Track and report metrics
  });
}
```

---

## 🚀 Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Environment Management

#### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://localhost:5432/yaqeen_dev
REDIS_URL=redis://localhost:6379

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.yaqeen.dev
DATABASE_URL=postgresql://prod-host:5432/yaqeen_prod
REDIS_URL=redis://prod-redis:6379
```

### Rollback Strategy

#### Blue-Green Deployment

1. **Deploy to staging** environment
2. **Run automated tests** and manual QA
3. **Gradual traffic shift** to new version
4. **Monitor metrics** for 24 hours
5. **Complete rollout** or rollback if issues

#### Database Migrations

```javascript
// Prisma migration
npx prisma migrate deploy

// Rollback if needed
npx prisma migrate reset --force
```

---

## 📊 Monitoring & Observability

### Application Monitoring

#### Error Tracking

```javascript
// Sentry configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Replay()
  ]
});
```

#### Performance Monitoring

```javascript
// Web Vitals tracking
export function reportWebVitals(metric) {
  // Send to analytics service
  console.log(metric);

  // Example: Send to Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true
    });
  }
}
```

### Infrastructure Monitoring

#### Health Checks

```javascript
// API health check endpoint
export default async function handler(req, res) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    await redis.ping();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'operational'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
}
```

---

## 🔄 Future Architecture

### Planned Improvements

#### Microservices Migration

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Quran Service │    │  Hadith Service │
│   (Kong)        │◄──►│   (Node.js)     │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Search Service  │    │  Auth Service   │
│   (Node.js)     │    │   (Python)      │    │   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Advanced Features

- **GraphQL API**: Flexible data fetching
- **Real-time Updates**: WebSocket connections
- **Machine Learning**: Personalized recommendations
- **Multi-region Deployment**: Global redundancy
- **Advanced Caching**: Multi-layer caching strategy

---

## 📞 Support & Contact

### Architecture Questions

- **📧 Technical Lead**: tech@yaqeen.dev
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/yaqeen/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/yaqeen/discussions)

### Documentation Updates

This architecture document is regularly updated. Last updated: January 2026

---

*This document represents the current system architecture and will evolve as Yaqeen grows and incorporates new technologies.*
