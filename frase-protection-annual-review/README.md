# Frase Protection — Annual Alarm System Review

Field app for annual customer confidence visits (Vite + React + TypeScript). In the **csaltair** monorepo this app is the **`frase-protection-annual-review/`** folder (same **`main`** history as the Expo app). **Deploy:** [DEPLOY.md](./DEPLOY.md). **GitHub:** [`ceylon9112/csaltair`](https://github.com/ceylon9112/csaltair).

**Azure:** add **`AZURE_CREDENTIALS`** (or **`AZURE_STATIC_WEB_APPS_API_TOKEN`**) as a **repository** secret — **not** under your GitHub account/profile Settings. Open the **repo** → **Settings** → **Secrets and variables** → **Actions**, or **`npm run github:open-secrets`**. Full steps: [DEPLOY.md — section 3](./DEPLOY.md#github-actions-secrets). Pushes to **`main`** (or **`frase-annual-review`**) that touch this folder run **Deploy Frase Static Web App** in Actions. Optional: **`npm run deploy:check`** with GitHub CLI.

---

## Tooling (Vite template)

This project started from the Vite React TS template. Below is the original README section.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
