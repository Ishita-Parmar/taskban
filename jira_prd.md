# Product Requirements Document (PRD) - TaskBan (Jira Clone)

## 1. Project Overview
**Name:** TaskBan
**Purpose:** To provide a comprehensive, real-time project management and issue tracking tool for agile software development teams. It aims to replicate the core functionalities of Jira (Kanban/Scrum boards, backlog management, issue tracking) with a focus on speed, real-time collaboration, and an intuitive user experience.

## 2. Problem Statement
Software teams need a centralized source of truth for their work. When team members are remote or distributed, asynchronous communication and out-of-sync boards lead to duplicated effort, missed deadlines, and confusion about task status. Existing tools can be slow or require manual refreshes to see state changes made by others.

## 3. Target Audience & User Roles
### 3.1. Roles
- **System Admin:** Manages overall workspace settings, billing, and global users.
- **Project Admin (PM / Scrum Master):** Can create projects, configure workflows/columns, manage project members, and adjust sprint settings.
- **Developer / Contributor:** Can view boards, create/edit issues, transition issues across columns, log comments, and upload attachments.
- **QA / Tester:** Focuses on finding tasks in the "Ready for QA" state, transitioning them back to "In Progress" (if failed) or "Done" (if passed), and creating bug tickets.
- **Viewer / Stakeholder:** Read-only access to view progress without the ability to modify states.

## 4. Key Features & Detailed Requirements

### 4.1. Issue Tracking & Management
An "Issue" is the core entity. It represents a unit of work.
- **Issue Types:**
  - **Epic:** A large body of work that can be broken down into specific tasks.
  - **Story:** A feature or requirement from the user's perspective.
  - **Task:** A technical piece of work.
  - **Bug:** A problem that impairs or prevents the functions of the product.
- **Issue Attributes:**
  - **Key:** Auto-generated unique identifier (e.g., `PROJ-123`).
  - **Summary:** Short, descriptive title.
  - **Description:** Rich text field (Markdown support) for detailed instructions.
  - **Assignee:** The user responsible for the work.
  - **Reporter:** The user who created the issue.
  - **Priority:** Highest, High, Medium, Low, Lowest.
  - **Status:** Maps to the current column in the workflow (e.g., To Do, In Progress, Done).
  - **Labels:** Tags for filtering and categorization.
  - **Attachments:** Support for uploading images and documents.
- **Sub-tasks:** Issues can be broken down into smaller sub-tasks which have their own statuses.

### 4.2. Backlog Management
- A dedicated view where all unresolved issues are listed chronologically or ranked by priority.
- Users can drag and drop to reorder the backlog.
- PMs can move items from the Backlog into an "Active Sprint" or directly onto the Kanban board.
- Inline issue creation: Quickly add issues to the bottom or top of the backlog without opening a full modal.

### 4.3. The Digital Kanban / Sprint Board
- **Customizable Workflows:** Project Admins can define the columns (statuses) and their order.
- **Real-Time Drag & Drop:** Moving an issue card from one column to another must broadcast instantly to all connected clients via WebSockets. No page refresh required.
- **Swimlanes (Optional):** Ability to group rows on the board by Assignee or Epic.
- **Card Customization:** Choose which fields (e.g., labels, epic link) display on the card on the board.

### 4.4. Collaboration & Activity
- **Comments:** Users can add comments to issues. Supports `@mentions` to alert specific users.
- **Activity Stream / Audit Log:** Every action (status change, assignment change, priority update) is logged with a timestamp and the user who performed it.
- **Watchers:** Users can "watch" an issue to receive notifications for any updates, even if they are not the assignee.

### 4.5. Notifications
- **In-App Notifications:** A bell icon in the top nav showing unread alerts (mentions, assignments, status changes on watched issues).
- **Email Notifications:** Configurable email alerts for critical events (e.g., "You have been assigned to TASK-45").

### 4.6. Search and Filters
- **Quick Filters:** Pre-defined toggles on the board (e.g., "Only My Issues", "Recently Updated").
- **Global Search:** Search bar in the top navigation to quickly jump to a specific issue key or search across all issue summaries.

## 5. Acceptance Criteria Examples
- **Given** a user is on the Kanban board, **When** they drag an issue from "To Do" to "In Progress", **Then** the issue's status updates in the database, **And** all other users viewing the board see the card move instantly.
- **Given** a user is creating an issue, **When** they type "@John" in the description or comment, **Then** a dropdown appears suggesting users named John, **And** John receives a notification upon saving.

## 6. Out of Scope (For MVP)
- Advanced reporting (Burndown charts, Velocity, Cumulative Flow Diagrams).
- Custom Issue Types and Custom Fields (stick to the standard ones for MVP).
- Third-party integrations (GitHub, GitLab, Slack, Zendesk).
- Advanced permission schemes (e.g., restricting transitions between specific statuses).
