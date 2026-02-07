---
title: "TypeScript Tips for Better Code"
description: "Practical TypeScript patterns and tips I use daily to write safer, more maintainable code."
pubDate: 2024-02-10
tags: ["typescript", "javascript", "best-practices"]
---

TypeScript has transformed the way I write JavaScript. Here are some patterns and tips I use every day to write better code.

## 1. Use `unknown` Instead of `any`

When you don't know the type, reach for `unknown` instead of `any`:

```typescript
// ❌ Avoid
function processData(data: any) {
  return data.value; // No type checking!
}

// ✅ Better
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value; // Type-safe
  }
  throw new Error('Invalid data');
}
```

## 2. Discriminated Unions

Use discriminated unions for type-safe state management:

```typescript
type LoadingState = 
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: string };

function render(state: LoadingState) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data.map(u => u.name); // data is available here
    case 'error':
      return state.error; // error is available here
  }
}
```

## 3. Const Assertions

Make objects and arrays readonly with `as const`:

```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;

// config.apiUrl = 'new'; // Error!

const colors = ['red', 'green', 'blue'] as const;
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'
```

## 4. Utility Types

Master the built-in utility types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Pick only what you need
type UserPreview = Pick<User, 'id' | 'name'>;

// Make everything optional
type PartialUser = Partial<User>;

// Make everything required
type RequiredUser = Required<Partial<User>>;

// Omit fields
type PublicUser = Omit<User, 'email'>;
```

## 5. Type Guards

Write reusable type guards:

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Usage
const data: unknown = fetchData();
if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}
```

## 6. Generic Constraints

Use constraints to make generic functions safer:

```typescript
// ❌ Too broad
function getProperty<T>(obj: T, key: string) {
  return obj[key]; // Error: Element implicitly has 'any' type
}

// ✅ Better
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]; // Type-safe!
}

const user = { name: 'Alice', age: 30 };
const name = getProperty(user, 'name'); // string
const age = getProperty(user, 'age'); // number
// getProperty(user, 'invalid'); // Error!
```

## 7. Satisfies Operator

Validate shape while preserving literal types:

```typescript
type Route = {
  path: string;
  component: string;
};

const routes = {
  home: { path: '/', component: 'Home' },
  about: { path: '/about', component: 'About' }
} satisfies Record<string, Route>;

// routes.home.path is '/' not string
// But we still get type checking!
```

## Conclusion

These patterns have made my TypeScript code more robust and easier to maintain. Start with one or two, and gradually incorporate more as they become second nature.

The key is to let TypeScript's type system work for you, not against you.
