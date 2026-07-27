# 📚 BookWise

<div align="center">

**A Modern University Library Management System**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-6C47FF?style=for-the-badge&logo=auth0)](https://authjs.dev/)

</div>

---

## 🎯 Overview

**BookWise** is a full-stack university library management platform built with Next.js 15. It enables students to browse, borrow, and return books while giving administrators powerful tools to manage the library's inventory, users, and borrowing workflows — all secured with role-based authentication and rate limiting.

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["🖥️ Browser"]
    end

    subgraph "Next.js 15 App Router"
        direction TB
        MW["🔒 Middleware<br/>(Auth + Route Protection)"]
        
        subgraph "Public Routes"
            SI["/sign-in"]
            SU["/sign-up"]
        end
        
        subgraph "User Routes"
            HOME["/ (Home)"]
            LIB["/library"]
            BOOK["/books/[id]"]
            PROF["/my-profile"]
        end
        
        subgraph "Admin Routes"
            ADM["/admin"]
            ADM_USERS["/admin/users"]
            ADM_BOOKS["/admin/books"]
            ADM_BORROW["/admin/book-requests"]
            ADM_ACCT["/admin/account-requests"]
        end
        
        subgraph "API Layer"
            AUTH_API["/api/auth/[...nextauth]"]
            IK_API["/api/auth/imagekit"]
            WF_API["/api/workflows/onboarding"]
        end
    end

    subgraph "External Services"
        DB[("🐘 Neon PostgreSQL<br/>(Serverless)")]
        REDIS[("⚡ Upstash Redis<br/>(Rate Limiting)")]
        QSTASH["📨 QStash<br/>(Email Workflows)"]
        IK["🖼️ ImageKit<br/>(Image CDN)"]
        RESEND["✉️ Resend<br/>(Email Delivery)"]
    end

    Browser --> MW
    MW --> SI & SU
    MW --> HOME & LIB & BOOK & PROF
    MW --> ADM & ADM_USERS & ADM_BOOKS & ADM_BORROW & ADM_ACCT
    
    AUTH_API --> DB
    IK_API --> IK
    WF_API --> QSTASH --> RESEND
    
    HOME --> DB
    LIB --> DB
    BOOK --> DB
    PROF --> DB
    ADM --> DB
    ADM_USERS --> DB
    ADM_BOOKS --> DB
    ADM_BORROW --> DB
    ADM_ACCT --> DB
    
    MW --> REDIS

    style Browser fill:#4B5563,color:#fff
    style DB fill:#4169E1,color:#fff
    style REDIS fill:#EF4444,color:#fff
    style QSTASH fill:#8B5CF6,color:#fff
    style IK fill:#F97316,color:#fff
    style RESEND fill:#000,color:#fff
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    users {
        uuid id PK "defaultRandom()"
        varchar full_name
        text email UK
        int university_id UK
        text password
        text university_card
        enum status "PENDING | APPROVED | REJECTED"
        enum role "USER | ADMIN"
        date last_activity_date
        timestamp created_at
    }

    books {
        uuid id PK "defaultRandom()"
        varchar title
        varchar author
        text genre
        int rating
        text cover_url
        varchar cover_color
        text description
        int total_copies
        int available_copies
        text video_url
        varchar summary
        timestamp created_at
    }

    borrow_records {
        uuid id PK "defaultRandom()"
        uuid user_id FK
        uuid book_id FK
        timestamp borrow_date
        date due_date
        date return_date
        enum status "BORROWED | RETURNED"
        timestamp created_at
    }

    users ||--o{ borrow_records : "borrows"
    books ||--o{ borrow_records : "is borrowed"
```

---

## ✨ Features

### 👤 For Students

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure sign-up/sign-in with university ID verification |
| 📖 **Book Browsing** | Browse the full library with search & genre filters |
| 📋 **Book Details** | View book info, cover, description, and video preview |
| 📚 **Borrow Books** | One-click borrowing with 7-day due dates |
| 🔄 **Return Books** | Easy return flow with receipt download |
| 👤 **Profile** | View borrowed books, due dates, and borrowing history |
| 🛡️ **Rate Limiting** | Protected against abuse with Upstash Redis |

### 🛠️ For Administrators

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Stats overview: total books, users, pending approvals, active borrows |
| 📚 **Book Management** | Add, edit, and delete books with cover image upload |
| 👥 **User Management** | Approve/reject registrations, change user roles |
| 📋 **Borrow Requests** | View and manage all borrowing activity |
| ✅ **Account Requests** | Review and approve pending university ID verifications |
| 🎨 **Custom Covers** | Color picker for book cover customization |

---

## 🚀 Tech Stack

```mermaid
mindmap
  root((BookWise))
    Frontend
      Next.js 15 (App Router)
      React 19
      TypeScript
      Tailwind CSS
      Radix UI Primitives
      Lucide React Icons
      React Hook Form + Zod
    Backend
      Next.js Server Actions
      Auth.js v5 (NextAuth)
      Drizzle ORM
      Upstash Workflow
    Database
      Neon PostgreSQL (Serverless)
      Upstash Redis
    Storage
      ImageKit (Image CDN)
    Email
      QStash
      Resend
    Security
      bcryptjs (Password Hashing)
      Rate Limiting (Upstash)
      JWT Sessions
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    actor Student
    participant App as BookWise App
    participant Auth as Auth.js v5
    participant DB as Neon PostgreSQL
    participant Redis as Upstash Redis
    participant Email as QStash/Resend

    Note over Student,Email: Sign-Up Flow
    
    Student->>App: Submit registration form
    App->>Redis: Check rate limit
    Redis-->>App: OK
    App->>DB: Check existing user
    DB-->>App: Not found
    App->>App: Hash password (bcryptjs)
    App->>DB: Insert user (PENDING status)
    App->>Email: Send onboarding email
    Email-->>Student: Welcome email
    
    Note over Student,Email: Admin Approval
    
    App->>DB: Admin approves user
    DB-->>App: Status → APPROVED
    
    Note over Student,Email: Sign-In Flow
    
    Student->>App: Enter credentials
    App->>Redis: Check rate limit
    Redis-->>App: OK
    App->>DB: Find user by email
    DB-->>App: User found
    App->>App: Verify password
    App->>Auth: Create JWT session
    Auth-->>Student: Set session cookie
```

---

## 📁 Project Structure

```
bookwise/
├── app/
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   ├── (root)/                  # Main user-facing pages
│   │   ├── page.tsx             # Home page
│   │   ├── layout.tsx           # Root layout with header
│   │   ├── error.tsx            # Error boundary
│   │   └── loading.tsx          # Loading skeleton
│   ├── admin/                   # Admin dashboard & management
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── books/               # Book CRUD
│   │   ├── users/               # User management
│   │   ├── book-requests/       # Borrow management
│   │   └── account-requests/    # Registration approvals
│   ├── api/                     # API routes
│   │   ├── auth/[...nextauth]/  # Auth.js handler
│   │   └── workflows/           # Upstash workflow endpoints
│   ├── books/[id]/              # Book detail page
│   ├── library/                 # Library browsing
│   └── my-profile/              # User profile & borrowed books
├── components/
│   ├── ui/                      # Radix UI primitives
│   ├── admin/                   # Admin-specific components
│   └── *.tsx                    # Shared components
├── database/
│   ├── drizzle.ts               # Drizzle DB connection
│   ├── redis.ts                 # Upstash Redis connection
│   └── schema.ts                # Database schema
├── lib/
│   ├── actions/                 # Server actions (auth, book)
│   ├── admin/actions/           # Admin server actions
│   ├── config.ts                # Environment config
│   ├── ratelimit.ts             # Rate limiting setup
│   ├── validations.ts           # Zod schemas
│   └── workflow.ts              # Email workflow setup
├── constants/                   # Navigation links, sample data
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
├── styles/                      # Global & admin CSS
├── auth.ts                      # Auth.js configuration
├── middleware.ts                 # Next.js middleware
└── types.d.ts                   # TypeScript type definitions
```

---

## 📊 Data Flow

```mermaid
flowchart LR
    subgraph "Write Operations"
        direction TB
        SA["Server Actions<br/>(use server)"]
        SA --> DB[(Neon PostgreSQL)]
        SA --> IK[ImageKit CDN]
        SA --> QS[QStash Workflows]
    end

    subgraph "Read Operations"
        direction TB
        RSC["React Server Components<br/>(async)"]
        RSC --> DB
    end

    subgraph "Client"
        direction TB
        CC["Client Components<br/>(use client)"]
        CC --> SA
        CC --> RSC
    end

    style SA fill:#8B5CF6,color:#fff
    style RSC fill:#06B6D4,color:#fff
    style CC fill:#F97316,color:#fff
    style DB fill:#4169E1,color:#fff
    style IK fill:#EF4444,color:#fff
    style QS fill:#10B981,color:#fff
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **pnpm**
- A **Neon PostgreSQL** database
- An **Upstash Redis** instance
- An **ImageKit** account
- A **Resend** API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-auth-secret"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/..."
IMAGEKIT_PRIVATE_KEY="private_..."

# Upstash
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."
QSTASH_URL="https://..."
QSTASH_TOKEN="..."

# Resend
RESEND_TOKEN="re_..."

# API
NEXT_PUBLIC_API_ENDPOINT="http://localhost:3000/api"
NEXT_PUBLIC_PROD_API_ENDPOINT="https://your-domain.com/api"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Script-Kitty01/bookwise.git
cd bookwise

# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |

---

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed with bcryptjs (10 salt rounds)
- **Rate Limiting**: 5 requests per minute per IP via Upstash Redis
- **JWT Sessions**: Stateless authentication with Auth.js v5
- **Route Protection**: Middleware guards all routes except public assets
- **Input Validation**: Zod schemas validate all form inputs
- **Role-Based Access**: Separate USER and ADMIN roles with protected admin routes

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Made with ❤️ using [Next.js](https://nextjs.org/) • [Tailwind CSS](https://tailwindcss.com/) • [Drizzle ORM](https://orm.drizzle.team/)

</div>
