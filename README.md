# Clove - cook with love

> A personal recipe manager — create, organize, and rediscover your kitchen repertoire.

Clove is a self-hosted web application to manage your personal recipe collection. Create detailed recipes, organize them with tags, build ingredient lists, and find exactly what you're looking for in seconds.

---

## ✨ Features

- **User account** — secure authentication with session management
- **Recipe creation** — rich editor with ingredients, steps, photos, tags, and metadata (prep time, servings, difficulty)
- **Recipe library** — your full collection at a glance with card or list view
- **Keyword search** — instant full-text search across recipe titles, descriptions, and ingredients
- **Tag filtering** — organize by cuisine, diet, occasion, or any custom tag
- **Favourites** — bookmark your go-to recipes for quick access
- **Ingredient & shopping list** — compile ingredients from one or several recipes into a shopping list
- **Fully private** — all data stays on your server, no third-party sharing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com/) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |
| Database | PostgreSQL |
| Authentication | [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils) |
| Deployment | Docker (self-hosted) |

---

## 📁 Project Structure

```
clove/
├── app/
│   ├── assets/          # Global styles & static assets
│   ├── components/      # Reusable Vue components
│   │   ├── recipe/      # RecipeCard, RecipeForm, RecipeDetail…
│   │   ├── ingredient/  # IngredientRow, ShoppingList…
│   │   └── ui/          # Button, Input, Badge, Modal…
│   ├── layouts/         # Default, auth
│   ├── pages/
│   │   ├── index.vue            # Recipe library (search + filter)
│   │   ├── recipes/
│   │   │   ├── new.vue          # Create a recipe
│   │   │   ├── [id].vue         # Recipe detail
│   │   │   └── [id]/edit.vue    # Edit a recipe
│   │   ├── favourites.vue       # Favourited recipes
│   │   ├── shopping-list.vue    # Shopping list
│   │   └── auth/
│   │       ├── login.vue
│   │       └── register.vue
│   └── composables/     # useRecipes, useFavourites, useShoppingList…
├── server/
│   ├── api/             # Nuxt API routes
│   │   ├── recipes/
│   │   ├── tags/
│   │   ├── favourites/
│   │   └── shopping-list/
│   ├── db/
│   │   ├── schema.ts    # Drizzle schema
│   │   └── index.ts     # DB connection
│   └── utils/           # Auth helpers, validators
├── drizzle/             # Migrations
├── public/
├── docker-compose.yml
├── Dockerfile
└── nuxt.config.ts
```

---

## 🗄️ Database Schema (Overview)

```
users          id, email, passwordHash, name, createdAt
recipes        id, userId, title, description, coverImage,
               prepTime, cookTime, servings, difficulty,
               isFavourite, createdAt, updatedAt
ingredients    id, recipeId, name, quantity, unit, position
steps          id, recipeId, content, position
tags           id, name, slug
recipe_tags    recipeId, tagId
shopping_list  id, userId, ingredientId, quantity, unit, checked
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js ≥ 20 (for local development only)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/clove.git
cd clove
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL=postgresql://clove:yourpassword@db:5432/clove

# Auth (generate with: openssl rand -base64 32)
NUXT_SESSION_SECRET=your-super-secret-key

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run with Docker

```bash
docker compose up -d
```

The app will be available at **http://localhost:3000**.

### 4. Run database migrations

```bash
docker compose exec app npx drizzle-kit migrate
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start a local PostgreSQL instance
docker compose up -d db

# Push the schema
npx drizzle-kit push

# Start the dev server
npm run dev
```

---

## 🐳 Docker

### `docker-compose.yml` (production)

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: clove
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: clove
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U clove"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## 📦 Key Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npx drizzle-kit generate` | Generate a new migration |
| `npx drizzle-kit migrate` | Run pending migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio (DB GUI) |

---

## 🗺️ Roadmap

- [ ] Recipe cover image upload
- [ ] Servings scaler (auto-adjust ingredient quantities)
- [ ] Export recipe as PDF
- [ ] Meal planner (plan recipes by day)
- [ ] Nutritional info (manual or via API)
- [ ] PWA / offline support

---

## 📄 License

MIT — do whatever you like with it.
