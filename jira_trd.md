# Technical Requirements Document (TRD) - TaskBan (Jira Clone)

## 1. System Architecture: Clean Architecture in Laravel
To ensure long-term maintainability, testability, and separation of concerns, the application will follow Clean Architecture principles. The codebase will be divided into specific layers, avoiding the "Fat Controller" or "Fat Model" anti-patterns standard in basic Laravel apps.

### 1.1. Directory Structure (`src/` vs `app/`)
We will create a `src/` directory at the root to house our Domain and Application layers, keeping them framework-agnostic where possible.
- **`src/Domain/`**: Contains Entities, Value Objects, Domain Exceptions, and Domain Events. (e.g., `Issue`, `Priority`, `Status`).
- **`src/Application/`**: Contains Use Cases (Actions) and DTOs (Data Transfer Objects). (e.g., `CreateIssueUseAction`, `MoveIssueAction`, `AssignIssueAction`).
- **`src/Infrastructure/`**: Contains the implementations of our Repositories (Eloquent implementations), external API clients, and services.
- **`app/Http/`**: The Laravel Presentation layer. Contains Controllers, Livewire Components, FormRequests, and Middleware. This layer purely handles HTTP/WebSockets and delegates to the `src/Application/` layer.

## 2. Technology Stack & Versions
- **Backend Framework:** Laravel 11.x
- **Language:** PHP 8.2+
- **Frontend Framework:** Laravel Livewire 3 + Alpine.js v3.
- **CSS Framework:** Tailwind CSS v3.
- **Database:** PostgreSQL 15+ (preferred for JSONb support and robust foreign keys).
- **WebSockets:** Laravel Reverb (native first-party package).
- **Queue System:** Redis (for robust broadcasting and background job processing).

## 3. Detailed Database Schema

### `users`
- `id` (bigint, unsigned, PK)
- `name` (varchar)
- `email` (varchar, unique)
- `password` (varchar)
- `avatar_url` (varchar, nullable)
- `created_at`, `updated_at`

### `projects`
- `id` (bigint, unsigned, PK)
- `key` (varchar, max 10, unique) - e.g., 'TASK'
- `name` (varchar)
- `description` (text, nullable)
- `owner_id` (bigint, unsigned, FK to users)
- `created_at`, `updated_at`

### `project_user` (Pivot for roles)
- `project_id` (bigint, unsigned, FK)
- `user_id` (bigint, unsigned, FK)
- `role` (enum: 'admin', 'member', 'viewer')
- Primary Key (`project_id`, `user_id`)

### `board_columns` (Workflow states)
- `id` (bigint, unsigned, PK)
- `project_id` (bigint, unsigned, FK)
- `name` (varchar) - e.g., 'To Do', 'In Progress'
- `position` (integer) - Left-to-right ordering
- `color` (varchar) - e.g., 'gray', 'blue', 'green'
- `created_at`, `updated_at`

### `issues`
- `id` (bigint, unsigned, PK)
- `project_id` (bigint, unsigned, FK)
- `board_column_id` (bigint, unsigned, FK)
- `epic_id` (bigint, unsigned, FK to issues, nullable)
- `assignee_id` (bigint, unsigned, FK to users, nullable)
- `reporter_id` (bigint, unsigned, FK to users)
- `issue_key` (varchar, unique) - Computed via Project Key + Auto Increment ID (e.g., TASK-1)
- `type` (enum: 'epic', 'story', 'task', 'bug')
- `summary` (varchar 255)
- `description` (longtext, nullable)
- `priority` (enum: 'highest', 'high', 'medium', 'low', 'lowest')
- `position` (double) - Lexicographical or floating-point ordering for O(1) drag-and-drop sorting within a column.
- `created_at`, `updated_at`, `deleted_at`

### `comments`
- `id` (bigint, unsigned, PK)
- `issue_id` (bigint, unsigned, FK)
- `user_id` (bigint, unsigned, FK)
- `body` (text)
- `created_at`, `updated_at`

### `issue_activities` (Audit Log)
- `id` (bigint, unsigned, PK)
- `issue_id` (bigint, unsigned, FK)
- `user_id` (bigint, unsigned, FK)
- `field` (varchar) - e.g., 'status', 'assignee', 'priority'
- `old_value` (varchar, nullable)
- `new_value` (varchar, nullable)
- `created_at`

## 4. Real-Time Architecture & Event Broadcasting
We will leverage Laravel Reverb for WebSocket communication.

### 4.1. Channels Setup
- We will use **Private Channels**.
- Channel Name: `project.{projectId}`
- Authorization: Checked in `routes/channels.php`. A user can only listen to `project.{projectId}` if they exist in the `project_user` table for that ID.

### 4.2. Domain Events & Broadcasting
When an action occurs, a Domain Event is dispatched. The Infrastructure layer maps these to Broadcast events.
- `IssueCreated` -> Broadcasts new issue card to append to the board.
- `IssueMoved` -> Broadcasts `$issueId`, `$oldColumnId`, `$newColumnId`, `$newPosition`. Clients instantly animate the card to the new position.
- `IssueUpdated` -> Broadcasts changes to summary, priority, or assignee so cards re-render on the board.
- `CommentAdded` -> Broadcasts new comment to users viewing the specific issue detail modal.

### 4.3. Livewire Implementation Details
- The `KanbanBoard` Livewire component will use `#[On('echo-private:project.{projectId},IssueMoved')]` to listen for broadcasted events and update its internal state (`$columns` and `$issues` collections) without hitting the database again.
- Optimistic UI updates: When a user drags a card, Alpine.js moves it in the DOM instantly. Livewire sends the network request in the background. If the request fails, Livewire rolls back the UI state and shows an error toast.

## 5. Background Jobs & Queues
- **Email Notifications:** All email sending (e.g., "You were assigned to TASK-42") must be pushed to a Redis queue so HTTP responses remain fast.
- **Search Indexing:** If using Laravel Scout (optional for MVP), updating the search index upon issue creation/update is queued.

## 6. APIs and Routing
- While Livewire handles the primary UI, RESTful API endpoints (`routes/api.php`) may be required for complex operations (like rich-text image uploads or asynchronous @mention user fetching).
- Example API: `GET /api/projects/{project}/users?search=John` -> Returns JSON of project members for mention dropdowns.
