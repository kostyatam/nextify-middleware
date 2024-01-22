# Express File-System Router Middleware

This middleware for Express.js allows you to create a file-system-based router similar to Next.js. Instead of using React and Server-Side Rendering (SSR), it utilizes HTMX and Handlebars for dynamic rendering. This allows you to easily structure and handle your routes using TypeScript handlers (.ts) and Handlebars templates (.hbs).

## Installation

```bash
npm i --save github:kostyatam/nextify-middleware
```

## Usage

1. **Middleware Setup:**

   ```typescript
   import express from "express";
   import { getRouter } from "nextify-middleware";
   import path from "path";

   export const app = express();
   app.use(getRouter(path.join(__dirname, "pages")));
   ```

   **Directory strucure example**

   ```
     /pages
       index.ts // route `/`
       about.ts // route `/about`
       /list
         layout.ts //custom layout for this and child levels
         index.ts
         /[id]
          index.ts // turns to route `/list/:id` and `/list/layout.ts` as layout
   ```

1. **Create Handlers and Templates:**

   - Handlers: Create TypeScript files (e.g., `index.ts`) to handle specific routes. Handlers receive request as parameters. The object returned by the function will be passed to the template.

   ```typescript
   // index.ts
   import { Request } from "express";

   export default function handler(req: Request) {
     return {
       message: "Hello world",
     };
   }
   ```

   - Templates: Create Handlebars templates (e.g., `index.hbs`) for each route. If a route is represented only by a template file, it recive parameters from the request, including `url`, `params`, and `isHtmxRequest`.

1. **Layout Handling:**

   The route handler automatically turns the page into a layout depending on the `HX-Request` cookie. The page will be wrapped in the nearest sibling or parent layout template.

- Inspired by Next.js and HTMX.
