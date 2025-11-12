# KickIt Frontend - Comprehensive Engineering Guide

> Purpose: a practical learning document for junior engineers. This file walks through the frontend codebase, explains design decisions and patterns, and provides concrete examples and next steps to prepare you for industry work.

Last updated: 2025-11-11

---

## Table of contents

- [KickIt Frontend - Comprehensive Engineering Guide](#kickit-frontend---comprehensive-engineering-guide)
  - [Table of contents](#table-of-contents)
  - [Project overview](#project-overview)
  - [How the app is wired](#how-the-app-is-wired)
  - [Key files and why they matter](#key-files-and-why-they-matter)
  - [Core frontend concepts in this project](#core-frontend-concepts-in-this-project)
    - [React + Vite](#react--vite)
    - [Routing (react-router-dom)](#routing-react-router-dom)
    - [Global state: Context API + hooks](#global-state-context-api--hooks)
    - [Services pattern for API calls](#services-pattern-for-api-calls)
    - [Component design \& styling](#component-design--styling)
    - [Forms \& controlled inputs](#forms--controlled-inputs)
  - [Authentication \& security (frontend specifics)](#authentication--security-frontend-specifics)
    - [Current flow used in the app](#current-flow-used-in-the-app)
    - [Security trade-offs](#security-trade-offs)
    - [Token expiry \& refresh](#token-expiry--refresh)
  - [Accessibility \& UX](#accessibility--ux)
  - [Error handling \& user feedback patterns](#error-handling--user-feedback-patterns)
  - [Testing suggestions](#testing-suggestions)
  - [Local development, build and run](#local-development-build-and-run)
  - [Common pitfalls \& debugging tips](#common-pitfalls--debugging-tips)
  - [Suggested improvements \& stretch tasks (learn-by-doing)](#suggested-improvements--stretch-tasks-learn-by-doing)
  - [Onboarding checklist for new engineers](#onboarding-checklist-for-new-engineers)
  - [Reference snippets (practical patterns)](#reference-snippets-practical-patterns)
  - [Final notes](#final-notes)

---

## Project overview

This is the KickIt frontend: a React single-page application built with Vite. It consumes the KickIt backend API (configured via `VITE_BACK_END_SERVER_URL`) to authenticate users and manage "kicks" (adventures). The app follows component-driven design with SCSS modules, a small global styles system, and lightweight state management using React Context + hooks.

High level responsibilities:

- Authentication (signup/signin) via `authService`
- CRUD for kicks via `kickService`
- UI composition using small, focused components
- Route protection for authenticated pages

This guide explains why things are implemented the way they are and how to extend/maintain the code.

---

## How the app is wired

1. `src/main.jsx` loads global styles and mounts the React tree:
   - Imports `globals.scss` and renders `<App />`.
2. `src/App.jsx` sets up routing (React Router) and wraps the app with `AuthProvider` (Context).
3. `AuthProvider` reads persisted auth state (token, user) from localStorage via `authService` and exposes `login`, `logout`, `isAuthenticated`, and `isLoading` through `AuthContext`.
4. Protected routes use `ProtectedRoute` component that reads `useAuth()` and either renders the protected page or redirects to `/signin`.
5. UI pages (Dashboard, Kick details, Auth pages) call `kickService` and `authService` for API interactions.
6. UI components are small, presentational, and styled with SCSS modules for local scoping.

---

## Key files and why they matter

- `index.html` – HTML entry. Minimal; Vite injects the bundle.
- `vite.config.js` – Vite configuration; ensures React plugin and file resolution.
- `package.json` – dev and build scripts: `dev`, `build`, `preview`, `lint`.

- `src/main.jsx` – app bootstrap. Loads global styles and mounts React.
- `src/App.jsx` – routes and providers. This is the app's routing map.

- `src/contexts/AuthContext.jsx` & `src/contexts/AuthContext.js` – implements authentication Context and provider. Centralized place for `user`, `token`, `login`, `logout`, and `isLoading`.

- `src/services/authService.js` – network + persistence logic for auth (signup/signin/logout). Encapsulates how tokens are stored (currently `localStorage`).
- `src/services/kickService.js` – wrapped API calls for kicks: fetch, create, update, delete, toggle status. Handles token injection and error parsing.

- `src/components/*` – reusable UI blocks. Examples:

  - `Button/` – small, reusable button with variants and SCSS module.
  - `Modal/` – accessible modal with backdrop click to close.
  - `KickForm/` – controlled form using `react-datepicker` for dates.
  - `KickCard/` – presentational card showing a kick.
  - `ProtectedRoute/` – routing gate for authenticated pages.

- `src/pages/` – route-level containers:

  - `HomePage.jsx`, `SignInPage.jsx`, `SignUpPage.jsx`, `DashboardPage.jsx`, `KickDetailsPage.jsx`.

- `src/styles/` – global SCSS variables, abstracts, and component partials. Project uses SCSS modules with a small global system of variables/mixins.

- `.env` / `.env.example` – environment variables for local development. Important: `VITE_BACK_END_SERVER_URL` must be set to the backend base URL.

---

## Core frontend concepts in this project

### React + Vite

- Vite provides a fast dev server, ES modules, and optimized build.
- React 19 (or 18/19 depending on package.json) is used with functional components and hooks.
- Use `pnpm run dev` to run locally.

Why Vite? It gives near-instant cold-start and fast HMR which accelerates development.

### Routing (react-router-dom)

- Routes are defined in `App.jsx` using `Routes` and `Route` components.
- Protected pages are wrapped with `ProtectedRoute`, which uses `useAuth()` to determine access.

Pattern used:

- Keep routing declarative and minimal in `App.jsx`.
- For large apps, consider route grouping and code-splitting (lazy loading components with `React.lazy` + `Suspense`).

### Global state: Context API + hooks

- `AuthProvider` exposes auth state (user, token) and actions (login, logout).
- `useAuth()` (hook in `src/hooks/useAuth.js`) reads the context — preferred by components.

Why Context? Simple and enough for auth state; avoids bringing Redux for this small project. For bigger apps, consider `useReducer` + Context or a state library.

### Services pattern for API calls

- `authService` and `kickService` are thin wrappers around `fetch`. They:
  - Build request headers (including token)
  - Convert responses to JSON
  - Normalize error messages
  - Persist token and user as needed

Benefits:

- Keeps network logic centralized and mockable in tests.
- UI code just calls `await api.createKick(data)` and handles the returned data or thrown Error.

Security note: Current token persistence uses `localStorage` (simple). Discussed later are trade-offs and recommended secure alternatives.

### Component design & styling

- SCSS modules are used for per-component styles (e.g., `KickForm.module.scss`).
- `src/styles/abstracts/_variables.scss` provides design tokens (colors, spacing, fonts) consumed by component styles.

Pattern:

- Small, single-purpose components (Button, Modal, KickCard)
- Presentational components accept props and callbacks instead of pulling global state
- Containers (pages) orchestrate data loading and pass handlers down

### Forms & controlled inputs

- `KickForm` is a controlled component: form state lives in React state and updates on change events.
- Dates are handled using `react-datepicker` and converted to ISO strings for the API.

Tips:

- Validate on the client for UX, but always re-validate on the server.
- Keep conversion logic (date formats) in service or form helper utilities to avoid duplication.

---

## Authentication & security (frontend specifics)

### Current flow used in the app

1. On signin/signup, `authService` POSTs credentials to backend.
2. If response contains `token` and `user`, both are stored in `localStorage`.
3. `AuthProvider` reads stored values on load and populates context.
4. `kickService` reads token from `localStorage` and sets `Authorization: Bearer <token>` header for API requests.

### Security trade-offs

- localStorage is simple but vulnerable to XSS. If an attacker can run JS on the page, they can read localStorage and steal tokens.
- A more secure pattern: store tokens in httpOnly, Secure cookies (set by server) to prevent JavaScript access. This requires CORS cookie setup and CSRF protection.

Recommendations:

- For production consider switching to httpOnly cookies with CSRF safeguards.
- Always sanitize and escape user-generated content to reduce XSS risk.
- Use Content Security Policy (CSP) headers from the backend to mitigate script injection risks.

### Token expiry & refresh

- Current implementation does not handle token refresh. If the API returns 401 with "TokenExpiredError", frontend should:
  1. Redirect to signin or
  2. Use a refresh token flow (recommended for longer sessions)

Suggested pattern:

- Introduce a `refreshService` and `axios` (or fetch wrapper) that intercepts 401 and attempts a refresh before redirecting to signin.

---

## Accessibility & UX

Small things implemented already:

- Forms use `label` + `htmlFor` to associate labels with inputs (`KickForm`).
- Modal supports backdrop click to close and has a close button icon. Improve by adding `aria-modal`, `role="dialog"`, and keyboard handling (Escape to close) if not already implemented.
- `ProtectedRoute` shows a loading state while auth status is determined.

Accessibility checklist to add:

1. Ensure keyboard focus is trapped in modals while open and returned to the triggering element when closed.
2. Modal should have `aria-label` or an accessible `h2` and `role="dialog" aria-modal="true"`.
3. Provide visible focus rings for all interactive elements.
4. Use semantic headings and landmarks (`header`, `main`, `nav`) in page markup.
5. Ensure color contrast meets WCAG 2.2 AA (use variables in `_variables.scss` to tweak colors).
6. Add skip link to jump to main content for keyboard users.

---

## Error handling & user feedback patterns

Patterns used in the codebase:

- Services throw `Error` with user-friendly messages. Pages catch those errors and set `error` state to display alerts.
- Loading states (`isLoading`, `isSubmitting`) are used to show spinners and disable inputs.

Do this consistently:

- Always show a toaster or an inline dismissible alert for errors.
- Normalize error objects — `service` should return consistent shape `{ message, code }` when possible.
- For network failures provide a retry affordance.

Good UX patterns:

- Disable submit buttons while request is in flight.
- Use optimistic UI only when safe (not used here).
- Use skeleton loaders for slow pages rather than blank screens.

---

## Testing suggestions

The repo doesn't currently include tests. Recommended stack:

- Unit tests: Vitest or Jest
- Component tests: React Testing Library
- E2E: Playwright or Cypress

Suggested quick tests:

- `AuthContext` provider: test that it reads and exposes stored token and user, `login` updates context.
- `KickForm`: test validation and that `onSubmit` receives properly formatted payload.
- `ProtectedRoute`: test redirection when not authenticated.
- `kickService`: test request headers include Authorization when token exists (mock fetch).

Example with Vitest + Testing Library (pseudo):

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test (`src/__tests__/ProtectedRoute.test.jsx`):

```jsx
import { render } from "@testing-library/react";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { AuthContext } from "../contexts/AuthContext";

test("redirects when not authenticated", () => {
  const wrapper = ({ children }) => (
    <AuthContext.Provider value={{ isAuthenticated: false, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );

  const { getByText } = render(
    <ProtectedRoute>
      <div>Secret</div>
    </ProtectedRoute>,
    { wrapper }
  );
  // ...assert navigation/redirect behavior
});
```

---

## Local development, build and run

From the project root (`kickit-frontend`) you can run these commands. This project uses Vite — the `package.json` scripts are authoritative.

Install dependencies (choose npm or pnpm depending on your environment):

```bash
# npm
npm install

# or pnpm
pnpm install
```

Run development server with hot reload:

```bash
npm run dev
# or
pnpm dev
```

Build for production:

```bash
npm run build
# or
pnpm build
```

Preview a production build locally:

```bash
npm run preview
# or
pnpm preview
```

Lint the codebase:

```bash
npm run lint
# or
pnpm lint
```

Environment variables

- Copy `.env.example` to `.env` and set `VITE_BACK_END_SERVER_URL` to your backend URL (e.g., `http://localhost:1986`).
- Vite exposes variables prefixed with `VITE_` to client code.

Quick checklist before running locally:

- Backend running and reachable (or set `VITE_BACK_END_SERVER_URL` to a mock server)
- `.env` configured in the project root

---

## Common pitfalls & debugging tips

1. Vite env variables not available

   - Ensure the variable is prefixed with `VITE_` and you restarted the dev server after editing `.env`.

2. CORS issues when calling backend

   - Confirm backend `cors()` is configured to accept `http://localhost:5173` or your dev URL.

3. Token-related 401s

   - Check `localStorage.token` and ensure `Authorization` header is set on requests.
   - Use browser devtools network tab to inspect request headers and responses.

4. Date formatting in forms

   - `KickForm` converts selected date to `YYYY-MM-DD` ISO-like string before submission; ensure backend expects that format.

5. Module or path resolution errors

   - Vite resolves `.jsx`, `.js`. Confirm `vite.config.js` has the `resolve.extensions` setting if you add typescript.

6. SCSS variable import failures

   - Ensure relative `@use` paths are correct; use partials and central `abstracts/_index.scss` pattern if needed.

7. Console errors from uncontrolled components
   - Check form inputs are always controlled (value or defaultValue) to avoid React warnings.

---

## Suggested improvements & stretch tasks (learn-by-doing)

Short-term (safe):

- Add tests for critical flows (auth, protected routes, kick CRUD)
- Improve modal accessibility: trap focus and add keyboard close
- Centralize fetch logic into a small `apiClient` wrapper to support automatic retries and 401 handling
- Add toasts (aria-live polite) for global notifications

Medium-term:

- Move token storage to httpOnly cookies and implement refresh token flow in backend + frontend
- Add code-splitting for route-level components using `React.lazy` and `Suspense`
- Add pagination and optimistic updates for better UX on large lists

Advanced:

- Add E2E tests (Playwright) for signup → create kick → edit → delete flow
- Add real-time updates with WebSockets for collaborative features

---

## Onboarding checklist for new engineers

- [ ] Run `npm install` and start the backend locally
- [ ] Set `.env` with `VITE_BACK_END_SERVER_URL`
- [ ] Run `npm run dev` and open the app
- [ ] Create a new user via signup and confirm you can create a kick
- [ ] Read `AuthContext` and `authService`: understand where the token is saved
- [ ] Implement a small bugfix or feature: e.g., add client-side validation to KickForm and submit
- [ ] Open a PR with a descriptive conventional commit message

---

## Reference snippets (practical patterns)

Controlled input pattern:

```jsx
const [value, setValue] = useState("");
return <input value={value} onChange={(e) => setValue(e.target.value)} />;
```

Example `authService` usage in a page:

```jsx
const handleSubmit = async (credentials) => {
  try {
    const data = await authService.signin(credentials);
    login(data.user, data.token); // from useAuth()
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  }
};
```

API service error normalization (pattern):

```javascript
// inside service
if (!response.ok) {
  const payload = await response.json().catch(() => ({}));
  const message =
    payload.err || payload.error || payload.message || "Server error";
  throw new Error(message);
}
```

---

## Final notes

This guide is intended to be a living document. As you work on the codebase — add features, refactor, and learn — update this file with important patterns, gotchas, and decisions so future engineers ramp faster.

If you want, I can:

- Add unit tests scaffolding (Vitest + React Testing Library)
- Implement an `apiClient` wrapper to centralize fetch and token handling
- Convert `localStorage` token behavior into a cookie-based flow (requires backend changes)

Would you like me to add tests scaffold or implement any of the suggested improvements next?
