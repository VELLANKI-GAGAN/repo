# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Index / Landing page

This project includes a user-friendly landing page (`src/pages/IndexPage.jsx`) which is the app's default route (`/`). The landing page now uses local SVG illustrations stored in `src/assets/` (people-eating-hero.svg and related files) so images load reliably without depending on external image hosts.

To run the frontend locally and view the index/landing page:

```bash
cd frontend
npm install
npm run dev
```

Then open the development server URL printed by Vite (usually http://localhost:5173).

Note: by default the landing page (`/`) will now be shown even when a user is already authenticated. If you are logged in and want to reach your dashboard, use the "Go to dashboard" button in the hero (or log out first). This keeps the index page visible for everyone.

Show sample/demo data
---------------------
The donor and recipient dashboards now display demo cards when your database doesn't contain listings or donations yet — helping you preview the UI right away. If you want the backend to be populated with real sample data, run the backend seed script (from the `backend` folder):

```powershell
cd backend
npm run seed
```

The seed script creates example donors, recipients, food listings and donation requests for development/demo purposes.

Admin notes
-----------
There is a default super-admin used for initial setup. By default this account is:

- email: admin@gmail.com
- password: admin123

Only this super-admin account is allowed to create additional admin users using the protected backend endpoint (POST /api/auth/register-admin). Admins are NOT creatable via the public registration UI.
