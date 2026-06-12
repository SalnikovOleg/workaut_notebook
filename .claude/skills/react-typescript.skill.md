# React + TypeScript Development Skill

## Overview
This skill provides best practices and guidelines for developing React applications using TypeScript.

## Project Setup
- Use `create-react-app` with the TypeScript template: `npx create-react-app my-app --template typescript`.
- Ensure `tsconfig.json` has `strict` mode enabled.
- Install ESLint and Prettier with TypeScript support.

## Folder Structure
```
src/
  components/      # Reusable UI components
  pages/           # Page-level components (screens)
  hooks/           # Custom React hooks
  utils/           # Utility functions
  types/           # Global TypeScript types
  services/        # API/service layer
  App.tsx
  index.tsx
```

## Component Guidelines
- Use functional components with React Hooks.
- Name component files as `ComponentName.tsx`.
- Export component as default.
- Define props interface:
```tsx
interface ComponentNameProps {
  title: string;
  onClick: () => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};
```
- Keep components small and focused.

## State Management
- Prefer React Context + `useReducer` for global state.
- For complex state, consider Redux Toolkit with TypeScript typings.

## Styling
- Use `styled-components` or `@emotion/react` with TypeScript typings.
- Alternatively, use CSS Modules (`.module.css`).

## Testing
- Use Jest and React Testing Library.
- Write tests in `*.test.tsx` files.
- Example test skeleton:
```tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

test('renders title', () => {
  render(<ComponentName title='Test' onClick={() => {}} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

## Linting & Formatting
- ESLint config extends `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `plugin:react/recommended`.
- Prettier integration via `eslint-config-prettier`.

## Build & Deployment
- Use `npm run build` to create production bundle.
- Deploy to Vercel, Netlify, or any static hosting.

## References
- Official React TypeScript docs: https://reactjs.org/docs/static-type-checking.html#typescript
- Create React App TypeScript template docs.
