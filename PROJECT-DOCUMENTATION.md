# NexttoFit - Project Documentation

## 📋 Table of Contents
1. [What We Have Developed](#-what-we-have-developed)
2. [Bugs & Fixes](#-bugs--fixes)
3. [Tools & Technologies Used](#-tools--technologies-used)

---

## 🛍️ What We Have Developed

### Project Overview
**NexttoFit** (originally NEXTFITT) is a production-grade premium fashion e-commerce website built from scratch. The platform includes a full customer-facing storefront and a comprehensive admin dashboard.

### Live URLs
- **Website:** https://nextto-fit-jlr1.vercel.app/
- **GitHub:** https://github.com/manishabbir/NexttoFit

### Pages & Features

#### 🏠 Public Pages (Customer Facing)
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section with animated banners, featured products, categories grid |
| Shop Men | `/men` | Men's clothing collection with filters |
| Shop Women | `/women` | Women's clothing collection with filters |
| New Arrivals | `/new-arrivals` | Latest products |
| Sale | `/sale` | Discounted items |
| Product Detail | `/product/[slug]` | Product images, sizes, colors, add to cart |
| Cart | `/cart` | Shopping cart management |
| Checkout | `/checkout` | Order checkout flow |
| Wishlist | `/wishlist` | Saved items |
| Auth Login | `/auth/login` | User authentication |
| Account | `/account` | User dashboard |
| Account Orders | `/account/orders` | Order history |
| Account Addresses | `/account/addresses` | Saved addresses |
| Account Settings | `/account/settings` | Profile settings |

#### 📄 Information Pages
| Page | Route | Description |
|------|-------|-------------|
| About Us | `/about` | Company information |
| Contact | `/contact` | Contact form & info |
| FAQs | `/faqs` | Frequently asked questions |
| Shipping & Returns | `/shipping-returns` | Policy information |
| Privacy Policy | `/privacy` | Privacy policy |
| Terms & Conditions | `/terms` | Terms of service |
| Size Guide | `/size-guide` | Clothing size charts |
| Order Tracking | `/order-tracking` | Track orders |
| Blog | `/blog` | Blog listing |
| Blog Post | `/blog/[slug]` | Individual blog post |
| Careers | `/careers` | Job listings |
| Gift Cards | `/gift-cards` | Digital gift cards |

#### 🔧 Admin Dashboard
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin` | Analytics, revenue charts, orders overview |
| Products | `/admin/products` | Manage products (CRUD) |
| Orders | `/admin/orders` | View/manage orders |
| Users | `/admin/users` | User management |
| Banners | `/admin/banners` | Hero banner management |
| Coupons | `/admin/coupons` | Discount coupon management |
| Blog | `/admin/blog` | Blog post management |
| Messages | `/admin/messages` | Contact form messages |
| Careers | `/admin/careers` | Job listing management |
| Gift Cards | `/admin/gift-cards` | Gift card management |
| Pages | `/admin/pages` | Static page management |
| Settings | `/admin/settings` | Site settings |

### Architecture & Features
- **Framework:** Next.js 14 App Router (TypeScript)
- **Styling:** Tailwind CSS with custom dark luxury theme (gold accent colors)
- **Animations:** Framer Motion throughout (hero, cards, nav, modals)
- **Authentication:** NextAuth.js with CredentialsProvider + JWT strategy
- **Database:** PostgreSQL (Supabase) with Prisma ORM
- **State Management:** Zustand for client-side (cart, wishlist, UI drawer/modal)
- **Admin Analytics:** Recharts charts (revenue, orders)

### Prisma Database Models (22 models)
- User, Account, Session, VerificationToken
- Product, Category, Collection
- ProductVariant (size/color/stock), ProductImage
- Cart, CartItem, WishlistItem
- Order, OrderItem, Address
- Review, Banner, Coupon
- BlogPost, BlogCategory
- ContactMessage, Career, GiftCard
- SiteSetting

---

## 🐛 Bugs & Fixes

### Bug #1: Vercel Build Error - TypeScript Compilation of .ts Scripts
- **Symptom:** Vercel build failed with TypeScript errors in scripts/hash-password.ts
- **Root Cause:** The `scripts/` directory contained a `.ts` file that Vercel tried to compile as part of the build, but it had import issues and wasn't needed in production.
- **Fix:** Removed the scripts/hash-password.ts file and replaced with .mjs version. Added `"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]` in `tsconfig.json` to exclude scripts directory.

### Bug #2: Prisma Schema - Missing `@@map("User")` Causing Table Name Mismatch
- **Symptom:** Prisma was looking for table `User` but Sequelize created `user` (lowercase)
- **Root Cause:** PostgreSQL/Supabase table naming convention differences
- **Fix:** Added `@@map("User")` and `@@map("Account")` etc. in schema.prisma model definitions

### Bug #3: Supabase Database Connection Issues
- **Symptom:** "Can't reach database server" on Vercel, connection refused errors, IP blocked on port 5432
- **Root Cause:** Supabase blocks direct IPv4 connections on port 5432. Need to use the connection pooler on port 6543.
- **Fix:** Changed DATABASE_URL to use port 6543 with `pgbouncer=true` and added DIRECT_URL pointing to port 5432 for Prisma migrations:

```env
DATABASE_URL="postgresql://postgres.glnkwsbehwdsyddoqnke:Ayat7077Fatima@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://postgres.glnkwsbehwdsyddoqnke:Ayat7077Fatima@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

Added in `schema.prisma`:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Bug #4: Prisma Migrate - DIRECT_URL Not Recognized
- **Symptom:** `npx prisma migrate dev` was not using the DIRECT_URL for migrations
- **Root Cause:** Older Prisma versions didn't support `directUrl` in datasource
- **Fix:** Updated Prisma to a version that supports `directUrl` parameter in the datasource block

### Bug #5: Prisma Migrate - Database Already Has Tables (Not Empty)
- **Symptom:** `prisma migrate dev` failed because tables already existed from Sequelize
- **Root Cause:** The Supabase database already had tables from a previous setup
- **Fix:** Used `npx prisma db push` instead of migrate to sync schema without creating migration files

### Bug #6: bcrypt.compare Failing During Login
- **Symptom:** Login returns "wrong credentials" despite correct email/password
- **Root Cause:** Password hash format incompatibility. The password was hashed differently during seed vs what bcrypt.compare expected.
- **Fix:** Created admin user via a dedicated API endpoint `/api/create-admin` which properly handles password hashing.

### Bug #7: Admin User Not Visible in Supabase Auth Dashboard
- **Symptom:** User created but not showing in Supabase Authentication > Users
- **Root Cause:** Users are stored in the public "User" table (Prisma model), NOT in Supabase Auth. This is by design - we use NextAuth with CredentialsProvider, not Supabase Auth.
- **Fix:** No fix needed - data is correctly stored. Check Supabase Table Editor > "User" table instead.

### Bug #8: NEXTAUTH_URL Pointing to localhost on Vercel
- **Symptom:** Login works locally but fails on the deployed Vercel site
- **Root Cause:** NEXTAUTH_URL environment variable was set to `http://localhost:3000` instead of the Vercel domain
- **Fix:** Must update environment variables in Vercel dashboard:
  - `NEXTAUTH_URL` = `https://nextto-fit-jlr1.vercel.app`
  - `NEXT_PUBLIC_APP_URL` = `https://nextto-fit-jlr1.vercel.app`

### Bug #9: Seed Script - User Already Exists Error
- **Symptom:** `npx prisma db seed` failed because admin user already exists in database
- **Root Cause:** Seed script tries to create admin user with `create()` which fails if user already exists
- **Fix:** Modified seed to use `upsert()` instead of `create()` for the admin user, so it updates existing records.

### Bug #10: NextAuth - JWT Secret / Callback URL Mismatch
- **Symptom:** NextAuth redirects or fails after successful credential validation
- **Root Cause:** Missing or incorrect `NEXTAUTH_SECRET` or callback URL configuration
- **Fix:** Ensure NEXTAUTH_SECRET is set in .env and Vercel env vars. Add `NEXTAUTH_URL` in production.

---

## 🛠️ Tools & Technologies Used

### Programming Languages
| Language | Usage |
|----------|-------|
| TypeScript | Main application code (full-stack) |
| HTML (JSX/TSX) | React components |
| CSS (Tailwind) | Styling |
| SQL | Database queries (via Prisma) |

### Core Frameworks & Libraries (Frontend)
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js 14 | ^14.1.0 | React framework with App Router |
| React | ^18 | UI library |
| Tailwind CSS | ^3.4 | Utility-first CSS framework |
| Framer Motion | ^11.0 | Animation library |
| Shadcn UI / Radix UI | - | UI primitives (dialog, sheet, dropdown, etc.) |
| Recharts | ^2.12 | Admin dashboard charts |
| Zustand | ^4.5 | Client-side state management |
| Lucide React | - | Icon library |
| next-themes | ^0.3 | Dark/light mode theming |

### Backend & Database
| Tool | Version | Purpose |
|------|---------|---------|
| Next.js API Routes | - | Serverless API endpoints |
| NextAuth.js | ^4.24 | Authentication (Credentials + JWT) |
| Prisma ORM | ^5.10 | Database ORM |
| PostgreSQL (Supabase) | - | Database host |
| bcryptjs | ^2.4 | Password hashing |
| Stripe | ready | Payment processing (integrated) |

### Development Tools
| Tool | Purpose |
|------|---------|
| VS Code | IDE |
| TypeScript Compiler (`tsc`) | Type checking |
| ESLint | Code linting |
| PostCSS | CSS processing |
| Prisma Studio | Database GUI |
| Git & GitHub | Version control |
| Vercel CLI | Deployment |

### Cloud Services & Platforms
| Service | Purpose |
|---------|---------|
| Vercel | Hosting & deployment |
| Supabase | PostgreSQL database hosting |
| GitHub | Source code management |

### NPM Packages Used
```json
{
  "next": "^14.1.0",
  "react": "^18",
  "react-dom": "^18",
  "next-auth": "^4.24.7",
  "@prisma/client": "^5.10.2",
  "prisma": "^5.10.2",
  "bcryptjs": "^2.4.3",
  "stripe": "^14.25.0",
  "zustand": "^4.5.2",
  "framer-motion": "^11.0.8",
  "recharts": "^2.12.7",
  "lucide-react": "^0.344.0",
  "next-themes": "^0.3.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "class-variance-authority": "^0.7.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-toast": "^1.1.5",
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.0.1",
  "postcss": "^8",
  "tailwindcss": "^3.4",
  "typescript": "^5",
  "eslint": "^8",
  "eslint-config-next": "14.1.0"
}
```

### Configuration Files Created
| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js configuration (images, headers, redirects) |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS custom theme (colors, fonts) |
| `postcss.config.mjs` | PostCSS configuration |
| `prisma/schema.prisma` | Database schema (22 models) |
| `.env.example` | Environment variable template |
| `.env` | Environment variables (local) |
| `.gitignore` | Git ignore rules |

### File Structure Overview
```
nextfitt/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seed data
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── scripts/                   # Utility scripts
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (shop)/            # Shopping pages (men, women, cart, etc.)
│   │   ├── account/           # User account pages
│   │   ├── admin/             # Admin dashboard pages (12 sections)
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes (auth, create-admin)
│   │   └── ...                # Static pages (about, contact, blog, etc.)
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, AnnouncementBar
│   │   ├── home/              # HeroSection, FeaturedSection
│   │   ├── product/           # ProductCard, ProductGrid
│   │   ├── cart/              # CartDrawer, CartItem
│   │   ├── search/            # SearchModal
│   │   └── ui/                # Reusable UI components (button, card, etc.)
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── stripe.ts          # Stripe integration setup
│   │   └── utils.ts           # Helper functions (cn, formatters)
│   ├── providers/             # React context providers (Session, Theme, Query, Toaster)
│   ├── store/                 # Zustand stores (cart, wishlist, UI)
│   └── types/                 # TypeScript type definitions
└── config files               # tailwind, tsconfig, postcss, next.config, etc.
```

---

## 🚀 Deployment Instructions

### Environment Variables (Required)
```
DATABASE_URL=<supabase-pooler-url:6543>
DIRECT_URL=<supabase-direct-url:5432>
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=<stripe-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable>
```

### Admin Credentials
- **Email:** imranafmdc@gmail.com
- **Password:** Fatima7077Ayat
- **Login URL:** https://nextto-fit-jlr1.vercel.app/auth/login
- **Admin URL:** https://nextto-fit-jlr1.vercel.app/admin

---

*Documentation generated on: May 30, 2026*