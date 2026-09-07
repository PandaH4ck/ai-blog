# PandaH4ck — Modern Developer Blog & Admin Dashboard

A fast, responsive, and minimalist developer blog built with **Next.js (App Router)** and **TypeScript**. It features dynamic post management, an integrated Markdown/MDX editor, and secure admin authentication powered by **Clerk**.

---

## ✨ Features

* **Modern Fullstack Architecture:** Built with Next.js 14+ App Router, React, and TypeScript.
* **Content Management:** Supports MDX-driven content workflow with static generation and dynamic routing.
* **Integrated Editor & Admin Panel:** Built-in editor to create, draft, and publish new articles directly from the browser.
* **Managed Authentication:** Secure user management and admin route protection via Clerk (Auth-as-a-Service).
* **Responsive UI:** Styled with Tailwind CSS and accessible component primitives (Shadcn UI / Radix).
* **Dark / Light Mode:** Built-in theme toggling with smooth transitions.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions / API Routes)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Authentication:** [Clerk](https://clerk.com/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons & Components:** Lucide Icons, Shadcn UI / Radix UI
* **Content Pipeline:** Contentlayer / MDX

> **Note on Architecture:**  
> This project originated from a modern Next.js blog starter template, customized and extended into a fullstack publishing platform with custom Clerk authentication rules, middleware-based route guarding, and dynamic post publishing logic.

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have Node.js installed (v18.17+ recommended):

```bash
node -v
npm -v
```

### 2. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Clerk API credentials from your [Clerk Dashboard](https://dashboard.clerk.com/):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or your designated port) in your browser.

---

## 🔒 Protecting the Admin Panel

The `/editor` route is secured via `middleware.ts` using Clerk session checks:
* Unauthenticated visitors attempting to access protected routes are automatically redirected to the sign-in modal.
* Only designated administrator accounts can view and publish articles.

---

## 📜 Scripts

* `npm run dev` — Starts the development server.
* `npm run build` — Compiles and builds the application for production.
* `npm run start` — Runs the compiled production server.
* `npm run lint` — Runs ESLint checks.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
