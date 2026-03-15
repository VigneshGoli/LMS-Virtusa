# Online Library Management System

A full-stack Online Library Management System demonstrating professional Spring Boot + React engineering practices and core Java concepts (OOP, collections, streams, predicates, custom annotations, Java I/O, and basic threading).

## Tech Stack

- **Backend**: Spring Boot, Spring Web, Spring Data JPA, MySQL, Spring Scheduling, AOP
- **Frontend**: React (Vite + TypeScript), Tailwind CSS, React Router, Axios, react-hot-toast

## Backend – Project Structure

`backend/`

- `pom.xml` – Maven build, Spring Boot and MySQL dependencies.
- `src/main/java/com/example/library`
  - `LibraryApplication` – main entry point (`@SpringBootApplication`, `@EnableScheduling`).
  - `config`
    - `WebConfig` – CORS configuration for Vite dev server.
    - `AuditActionAspect` – AOP aspect that processes `@AuditAction` and writes audit logs via Java I/O.
    - `OverdueCheckScheduler` – scheduled task checking overdue books in a background thread.
  - `model` – JPA entities extending `BaseEntity`:
    - `Book`, `User`, `IssuedBook`.
  - `enums` – `BookStatus`, `UserRole`, `IssueStatus`.
  - `repository` – Spring Data JPA repositories for each entity.
  - `dto` – request/response objects for books, issuing, returning, dashboard stats, and activity logs.
  - `annotations` – `@AuditAction` custom annotation.
  - `util`
    - `FileAuditLogger` – synchronized file-based logging (`logs/audit.log`).  
    - `IdGeneratorUtil` – static ID generator and simple string/array helper.  
    - `BookSearchUtil` – inner `SearchFilter` class building Java 8 `Predicate<Book>` filters.
  - `service` / `service.impl`
    - `BookService`, `IssueService`, `DashboardService` and implementations.
  - `controller`
    - `BookController`, `IssueController`, `DashboardController` – REST APIs.
  - `exception`
    - `LibraryException`, `BookNotFoundException`, `BookUnavailableException`, `GlobalExceptionHandler`.

`src/main/resources`:

- `application.yml` – MySQL, JPA, logging, audit log path, and CORS configuration.
- `schema.sql` – DDL for `books`, `users`, `issued_books` tables.

## Backend – Key REST Endpoints

- `POST /api/books` – Add new book.
- `GET /api/books` – List all books.
- `GET /api/books/available` – List available books only.
- `GET /api/books/search` – Predicate-based search (title, author, category, ISBN) using Streams + `Predicate<Book>`.
- `POST /api/books/issue` – Issue a book (quantity reduced, status updated, `IssuedBook` created).
- `POST /api/books/return` – Return book (quantity increased, status updated).
- `GET /api/books/issued` – List active issued books.
- `GET /api/dashboard/stats` – Dashboard statistics (total, issued, available, overdue).
- `GET /api/dashboard/activity` – Recent activity logs (from file-based audit log).

## Database Schema (MySQL)

Database name: `library_db` (configure in `application.yml`).

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  isbn VARCHAR(50) NOT NULL UNIQUE,
  publisher VARCHAR(255),
  quantity INT NOT NULL,
  year INT,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE issued_books (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  book_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  return_date DATE,
  status VARCHAR(50) NOT NULL,
  CONSTRAINT fk_issued_book_book FOREIGN KEY (book_id) REFERENCES books(id),
  CONSTRAINT fk_issued_book_user FOREIGN KEY (user_id) REFERENCES users(id)
);
```

`schema.sql` is provided and can be run manually. JPA is configured with `ddl-auto: update` for convenience in local development.

## Frontend – Project Structure

`frontend/`

- Vite React TypeScript app (`npm create vite@latest frontend --template react-ts`).
- Tailwind configured via `tailwind.config.cjs` and `src/index.css` (`@tailwind base/components/utilities`).

`src/`:

- `main.tsx` – React entry, imports global Tailwind styles.
- `App.tsx` – Router + `AppLayout`:
  - `/dashboard` – `DashboardPage`
  - `/books/add` – `AddBookPage`
  - `/books` – `LibraryPage`
  - `/books/search` – `SearchPage`
  - `/books/issue` – `IssueBookPage`
  - `/books/return` – `ReturnBookPage`
  - `/books/available` – `AvailableBooksPage`

### Layout & Components

- `components/layout/AppLayout.tsx` – Shell with sidebar, top bar, and content.
- `components/layout/Sidebar.tsx` – Deep navy enterprise-style navigation sidebar.
- `components/layout/TopBar.tsx` – Top bar with system title and admin avatar.
- `components/StatsCard.tsx` – Dashboard stats cards.
- `components/BookCard.tsx` – Book cards (status badges, metadata).
- `components/SearchBar.tsx` – Predicate-style search form (title/author/category/ISBN).
- `components/LoadingSkeleton.tsx` – Loading placeholders.

### Pages

- `DashboardPage` – shows total/issued/available/overdue stats and recent audit activity.
- `AddBookPage` – professional form to add books (title, author, category, ISBN, publisher, quantity, year, description).
- `LibraryPage` – all books in responsive card grid.
- `SearchPage` – debounced search with suggestions via `GET /api/books/search` (Streams + Predicates on backend).
- `IssueBookPage` – issue a selected available book to a user.
- `ReturnBookPage` – return an issued book and update inventory.
- `AvailableBooksPage` – only shows available books.

### Services & Types

- `services/apiClient.ts` – Axios instance, base URL from `VITE_API_BASE_URL` (defaults to `http://localhost:8080`).
- `services/bookApi.ts` – book endpoints.
- `services/issueApi.ts` – issue/return/issued-books endpoints.
- `services/dashboardApi.ts` – stats and activity endpoints.
- `types/library.ts` – shared TypeScript models for books, stats, and activity logs.

## Running the System Locally

### Prerequisites

- Java 17+
- Maven
- Node.js + npm
- MySQL 8+

### 1. Set up the database

1. Create database:
   ```sql
   CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Update credentials in `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/library_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
       username: YOUR_USERNAME
       password: YOUR_PASSWORD
   ```
3. Optionally run `backend/src/main/resources/schema.sql` manually to precreate tables.

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend will start at `http://localhost:8080` and automatically create/update tables.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server will start at `http://localhost:5173`.

If you host the backend elsewhere, create a `.env` file in `frontend` with:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Core Java Concepts Demonstrated

- **OOP / Inheritance / Polymorphism**: `BaseEntity` + entities; service interfaces with concrete implementations.
- **Static keyword**: `IdGeneratorUtil` for audit ID generation and helpers.
- **Collections & Generics**: Extensive use of `List`, `Map`, generics in repositories/services.
- **Enums**: `BookStatus`, `UserRole`, `IssueStatus` used throughout domain and logic.
- **Custom Exceptions**: `BookNotFoundException`, `BookUnavailableException`, `LibraryException` with global handling.
- **Custom Annotation + AOP**: `@AuditAction` + `AuditActionAspect` invoking `FileAuditLogger`.
- **Java I/O**: `FileAuditLogger` for book add/issue/return/audit logs; `DashboardServiceImpl` reads logs.
- **Java 8 Streams / Lambdas / Predicates**: Search implemented via `BookSearchUtil` + `BookService.searchBooks`.
- **Optional**: Used in search utilities and repository lookups.
- **Threading / Scheduling**: `OverdueCheckScheduler` uses `@Scheduled` and an `ExecutorService` to check overdue books periodically.
- **Inner Classes**: `BookSearchUtil.SearchFilter` encapsulates building complex `Predicate<Book>` chains.

## Primary User Flows

1. **Add Book**  
   Admin opens *Add Book*, submits form → `POST /api/books` → book persisted, audit log written.

2. **Issue Book**  
   Admin selects an available book and user → `POST /api/books/issue` → quantity reduced, `IssuedBook` created, status updated, audit logged.

3. **Return Book**  
   Admin picks an issued record → `POST /api/books/return` → quantity increased, status set to AVAILABLE, audit logged.

4. **Search & View**  
   *Search* and *Available Books* pages call respective APIs backed by Java 8 Predicate-based filtering and status-based JPA queries.

## Notes

- CORS is enabled for `http://localhost:5173` in `WebConfig`.
- Audit log file is written to `logs/audit.log` relative to the backend working directory.
- For production, swap `ddl-auto: update` for migrations (e.g., Flyway) and harden logging/exception handling further.

