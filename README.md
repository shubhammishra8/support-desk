

A full-stack support ticket management application built with React (TypeScript) and Node.js (Express). Supports creating, searching, filtering, and commenting on support tickets.

---





- Node.js 18+ (`node --version`)
- npm 9+



```bash
cd backend
npm install
npm run seed          
npm run dev           
```

**API docs (Swagger):** `http://localhost:3001/api/docs`



```bash
cd frontend
npm install
npm run dev           
```

The Vite proxy forwards `/api/*` requests to the backend automatically — no CORS issues in development.



```bash

cd frontend && npm run build   


cd backend && npm start
```

---



```
/
├── ARCHITECTURE.md            ← System design document (read this first)
├── README.md                  ← This file
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js             ← Express app factory (middleware, routes, Swagger)
│   │   ├── server.js          ← Entry point (binds port)
│   │   ├── seed.js            ← Sample data generator
│   │   ├── routes/
│   │   │   └── tickets.js     ← Route definitions + Swagger JSDoc
│   │   ├── controllers/
│   │   │   ├── ticketController.js
│   │   │   └── commentController.js
│   │   ├── services/
│   │   │   ├── ticketService.js
│   │   │   └── commentService.js
│   │   ├── repositories/
│   │   │   ├── ticketRepository.js
│   │   │   └── commentRepository.js
│   │   ├── middleware/
│   │   │   └── index.js       ← Validation, logging, error handler
│   │   └── utils/
│   │       ├── database.js    ← SQLite init + schema
│   │       ├── schemas.js     ← Zod validation schemas
│   │       └── helpers.js     ← Logger, response helpers
│   └── data/
│       └── support.db         ← SQLite database (created on first run)
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tsconfig.json
    ├── public/
    │   └── index.html
    └── src/
        ├── main.tsx           ← React entry point
        ├── App.tsx            ← QueryClient + Router
        ├── types/
        │   └── index.ts       ← All TypeScript interfaces
        ├── utils/
        │   ├── api.ts         ← Typed API client (fetch wrappers)
        │   └── helpers.ts     ← Date formatting, label maps
        ├── components/
        │   ├── Layout.tsx     ← App shell (header, nav, footer)
        │   └── SharedComponents.tsx  ← Badges, Spinner, Pagination, etc.
        ├── features/
        │   ├── tickets/
        │   │   ├── useTickets.ts       ← TanStack Query hooks
        │   │   ├── TicketListPage.tsx  ← List with search/filter/sort
        │   │   ├── TicketDetailPage.tsx← Detail + status update + comments
        │   │   └── CreateTicketPage.tsx← Form with validation
        │   └── comments/
        │       └── useComments.ts      ← Comment query hooks
        └── styles/
            └── global.css     ← Full design system + component styles
```

---



| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/tickets`            | List tickets (search, filter, sort, paginate) |
| POST   | `/api/tickets`            | Create a ticket                    |
| GET    | `/api/tickets/:id`        | Get ticket detail                  |
| PATCH  | `/api/tickets/:id`        | Update ticket fields               |
| DELETE | `/api/tickets/:id`        | Delete a ticket                    |
| GET    | `/api/tickets/:id/comments` | List comments (paginated)        |
| POST   | `/api/tickets/:id/comments` | Add a comment                    |

Full interactive docs: `http://localhost:3001/api/docs`

---



1. **No authentication.** The `authorName` field on comments is free-text. The schema is positioned for a future `authorId` FK when auth is added.
2. **SQLite for persistence.** Zero-config, file-based, suitable for development and low-to-moderate traffic. The repository layer isolates all DB calls — swapping to PostgreSQL requires only changing the repository implementations.
3. **Hard delete.** Tickets are permanently removed on DELETE. Comments are cascade-deleted via FK. This is acceptable because comments already serve as an audit trail.
4. **Server-side search.** All filtering and searching happens on the backend. This keeps payloads small and provides a clear migration path to a dedicated search index.
5. **Offset pagination.** Chosen over cursor-based for simplicity at expected data volumes. See ARCHITECTURE.md §3.
6. **Single-user development.** No concurrent-write protection beyond last-write-wins on `updatedAt`. ETag-based optimistic locking is noted as a future extension.
