# Clove · cook with love

> A beautifully curated space to store, schedule, and share your favorite culinary discoveries.

![Clove App Mockup](./mockup%20Clove.webp)

Clove is a personal recipe manager built as a web application. Create detailed recipes, tag and browse your collection, plan your week meal by meal, and generate a shopping list automatically — all within a single, self-hosted app.

---

## ✨ Features

- **Authentication** — register and log in with email and password; sessions are persisted server-side
- **Recipe library** — browse your full collection on a clean card-based home page
- **Recipe creation & editing** — add a title, description, instructions, cooking time, ingredients, a cover photo, and a category tag; editing is restricted to the recipe owner
- **Recipe sharing** — save other users' public recipes to your own collection
- **Ingredient management** — ingredients are stored in a shared catalogue and linked to recipes with quantities
- **Tag / category system** — a single tag per recipe (e.g. *Daily*, *Dessert*…) for quick filtering
- **Weekly meal planner** — assign any recipe to a day and meal slot (breakfast, lunch, dinner, snack…); unlimited entries per day
- **Shopping list** — generated automatically from your week's planner, with persistent checked/unchecked state
- **Image uploads** — cover photos are stored locally in the `uploads/` directory and served by the Nitro server

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com/) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (Vite plugin) |
| Animations | [GSAP 3](https://greensock.com/gsap/) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Database | SQLite (`better-sqlite3`) |
| Auth | Custom — bcrypt password hashing + server session middleware |

---

## 📁 Project Structure

```
clove/
├── app/
│   ├── assets/css/          # Tailwind CSS entry point (main.css)
│   ├── components/
│   │   └── RecipeModal.vue  # Recipe detail / quick-view modal
│   ├── middleware/
│   │   └── auth.ts          # Client-side route guard
│   └── pages/
│       ├── index.vue        # Login & register
│       ├── home.vue         # Recipe library
│       ├── planner.vue      # Weekly meal planner + shopping list
│       └── recipes/
│           └── [id].vue     # Recipe detail & edit
├── server/
│   ├── api/
│   │   ├── auth/            # login, logout, register, me
│   │   ├── recipes/         # CRUD (index, [id], tags)
│   │   ├── ingredients/     # search
│   │   ├── planner/         # weekly planner + shopping-list
│   │   └── uploads/         # image upload handler
│   ├── database/
│   │   ├── schema.ts        # Drizzle table definitions
│   │   └── migrations/      # Generated migration files
│   ├── middleware/
│   │   └── auth.ts          # Server-side session guard
│   └── utils/               # Shared server helpers
├── public/                  # Static assets (favicon, stock images)
├── uploads/                 # User-uploaded recipe images (git-ignored)
├── local.db                 # SQLite database file (git-ignored)
├── drizzle.config.ts
├── nuxt.config.ts
└── package.json
```

---

## 🗄️ Database Schema

```
users              id · name · email · password · createdAt
recipes            id · userId · title · description · instructions
                   imageUrl · tag · cookingTime · createdAt
ingredients        id · name (unique)
recipe_ingredients id · recipeId · ingredientId · amount
saved_recipes      id · userId · recipeId · createdAt
weekly_planner     id · userId · recipeId · day · mealType · createdAt
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20

### 1. Clone the repo

```bash
git clone https://github.com/your-username/clove.git
cd clove
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file at the root:

```env
# Path to the SQLite database file (defaults to local.db)
DATABASE_URL=local.db

# Secret used to sign session cookies — generate with: openssl rand -base64 32
NUXT_SESSION_SECRET=your-super-secret-key
```

### 4. Create the database

```bash
npx drizzle-kit push
```

This introspects `server/database/schema.ts` and creates the `local.db` SQLite file with all tables.

### 5. Start the dev server

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (accessible on LAN) |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npx drizzle-kit push` | Sync schema to the database (no migrations) |
| `npx drizzle-kit generate` | Generate a migration file from schema changes |
| `npx drizzle-kit migrate` | Apply pending migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio (visual DB browser) |

