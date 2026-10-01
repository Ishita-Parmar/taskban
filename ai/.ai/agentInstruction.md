# Project AI Agent Instructions

## Overview
This project, **TaskBan (MediBan)**, is a Kanban board clone built with Laravel 11. It heavily adheres to **Clean Architecture** principles and features a **Glassmorphism UI**.

When assisting with this project, AI agents MUST follow the strict architectural and styling rules defined below.

## Architecture Guidelines (Clean Architecture)
The backend is split into 4 distinct layers to ensure separation of concerns. Do not bypass these layers.

1. **Presentation Layer (`app/Livewire/`, `app/Http/Controllers/`, `resources/views/`)**
   - Handles HTTP requests, session management, and Livewire component state.
   - **Rule:** Do NOT place business logic or direct Eloquent queries here. The presentation layer must call **Action classes** from the Application layer.
   - **Rule:** Controllers and Livewire components should only inject Services/Actions, parse input into DTOs, and return responses.

2. **Application Layer (`src/Application/`)**
   - Contains Use Cases/Actions (e.g., `CreateIssue`, `MoveIssue`) and DTOs (Data Transfer Objects).
   - **Rule:** This layer orchestrates business logic. It receives DTOs from the Presentation layer and interacts with the Domain and Infrastructure layers.

3. **Domain Layer (`src/Domain/`)**
   - Contains Domain Entities, Value Objects (Enums), and Domain Events.
   - **Rule:** This layer must NOT have dependencies on Eloquent, the database, or external frameworks. It should be pure PHP (though we pragmatically allow some Laravel primitives like basic Collections).
   - Enums are located in `src/Domain/ValueObjects/`. Events are in `src/Domain/Events/`.

4. **Infrastructure Layer (`src/Infrastructure/` & `app/Models/`)**
   - Contains Eloquent Models, Repositories, and concrete implementations of Domain Interfaces.
   - **Rule:** Database interactions (Eloquent) live here. The Application layer interacts with this layer via abstractions (though Eloquent models are pragmatically passed back in this specific implementation).

## Tech Stack & Tooling
- **PHP:** 8.3+
- **Framework:** Laravel 11
- **Real-Time:** Laravel Reverb (WebSockets) + Echo
- **Frontend:** Livewire 3 + Alpine.js
- **Styling:** Tailwind CSS

## Styling Guidelines (Glassmorphism & Stitch UI)
The frontend uses a specific "Glassmorphism" design aesthetic.

- **Backgrounds:** Use semi-transparent backgrounds with backdrop filters (e.g., `bg-[rgba(255,255,255,0.7)] backdrop-blur-md`).
- **Borders:** Use subtle white or light gray borders (`border-white/40`, `border-[#DFE1E6]`).
- **Shadows:** Use soft shadows (`shadow-sm`, `shadow-lg`).
- **Colors:** We use a Jira-inspired palette defined in `tailwind.config.js`:
  - Primary Blue: `#0052CC`
  - Text Dark: `#172B4D`
  - Text Subtle: `#5E6C84`
  - Background: `#F4F5F7` or `#F9F9FF`

When creating or modifying UI components, ensure they match this modern, frosted-glass aesthetic. Do not use default or flat Tailwind classes without considering the glassmorphic theme.

## Real-Time Events (Laravel Reverb)
- The application uses Laravel Reverb for real-time WebSocket broadcasting.
- Domain events (e.g., `IssueMoved`) implement `ShouldBroadcast` and dispatch on `PrivateChannel("project.{projectId}")`.
- Livewire components use dynamic listeners (e.g., `echo-private:project.{id},.Src\\Domain\\Events\\IssueMoved`) via the `getListeners()` method to react to these events.

## File Locations
- **Actions:** `src/Application/Actions/`
- **DTOs:** `src/Application/DTOs/`
- **Value Objects / Enums:** `src/Domain/ValueObjects/`
- **Events:** `src/Domain/Events/`
- **Models:** `app/Models/`
- **Livewire Components:** `app/Livewire/`
- **Views:** `resources/views/livewire/` and `resources/views/layouts/`