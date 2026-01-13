# Architecture

## Frameworks & Language

- **Meta Framework**: Nuxt 3 (Vue.js 3)
- **Language**: TypeScript

## Database & State

- **Database**: Turso (LibSQL) - Cloud SQLite provider.
- **ORM**: Drizzle ORM (Schema definitions, Queries, Migrations).
- **State Management**: Pinia.

## Authentication & Security

- **Auth**: Better Auth (supporting GitHub & Google OAuth).
- **Security**:
    - `nuxt-csurf` for CSRF protection.
        - Signed URLs for private image access.
- **Validation**: Zod (Schema validation) + Vee-Validate (Form handling).

## UI & UX

- **Styling**: Tailwind CSS v4 + DaisyUI.
- **Maps**: MapLibre GL.
- **Icons**: Nuxt Icon (Iconify).
- **Visuals**: `nuxt-easy-lightbox` for image galleries.

## Infrastructure & DevOps

- **Storage**: AWS S3 (Production) / Minio (Local Docker).
- **Linting**: ESLint + Husky (Git hooks).
