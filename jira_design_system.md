# Design System - TaskBan (Jira Clone)

## 1. Design Philosophy & Principles
TaskBan is a high-density, productivity-focused application. The UI must be highly functional and scannable. 
- **Clarity over Decoration:** Visual elements must have a purpose. Use borders, subtle shadows, and whitespace to separate content, not heavy background colors.
- **Density:** Information density is key. Users need to see many issues at once. Use compact spacing in lists and boards.
- **Feedback:** Every action (drag, click, save) must have immediate visual feedback (hover states, loaders, toast notifications).

## 2. Color Palette (Tailwind Configuration)

### 2.1. Brand & Neutrals
- **Primary (Brand):** `#0052CC` (Jira Blue). Used for primary buttons, active links, and focused input borders.
- **Primary Hover:** `#0047B3`
- **Background (App):** `#FFFFFF`
- **Background (Surface/Sidebar):** `#F4F5F7`
- **Background (Hover):** `#EBECF0`
- **Text (Main):** `#172B4D` (Slate 900)
- **Text (Subtle):** `#5E6C84` (Slate 500)
- **Border:** `#DFE1E6`

### 2.2. Semantic & Status Colors
- **Success (Done):** `#36B37E` (Background for badges), `#006644` (Text/Icon).
- **Warning (In Progress):** `#FF991F` (Background), `#FF8B00` (Icon).
- **Danger (High Priority/Bugs):** `#FF5630` (Background), `#BF2600` (Text/Icon).
- **Info (To Do/Tasks):** `#4C9AFF` (Background).

## 3. Typography Scale
Font Family: `Inter`, `Roboto`, or `system-ui`.
- **H1 (Page Titles):** `text-2xl font-semibold text-[#172B4D] tracking-tight`
- **H2 (Modal Titles):** `text-xl font-medium text-[#172B4D]`
- **H3 (Column Headers):** `text-xs font-bold text-[#5E6C84] uppercase tracking-wider`
- **Body Main:** `text-sm text-[#172B4D] leading-relaxed`
- **Body Small (Metadata):** `text-xs text-[#5E6C84]`

## 4. UI Components

### 4.1. Buttons
- **Primary:** `bg-[#0052CC] hover:bg-[#0047B3] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors`
- **Secondary/Subtle:** `bg-gray-100 hover:bg-gray-200 text-[#172B4D] px-4 py-2 rounded-full text-sm font-medium transition-colors`
- **Ghost:** `bg-transparent hover:bg-gray-100 text-[#5E6C84] hover:text-[#172B4D] px-3 py-1.5 rounded-full text-sm transition-colors`

### 4.2. Forms & Inputs
- **Text Input:** `border border-[#DFE1E6] rounded-xl px-3 py-2 text-sm text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] w-full bg-white hover:bg-gray-50 transition-colors`
- **Dropdown/Select:** Same styling as Text Input, with a custom chevron SVG.

### 4.3. Avatars
- Used to represent users globally.
- **Small (Board):** `w-6 h-6 rounded-full overflow-hidden border border-white shadow-sm`
- **Medium (Comments):** `w-8 h-8 rounded-full overflow-hidden`
- **Fallback:** If no image, use a solid color background with initials in white.

### 4.4. Badges & Tags
- **Status Badge (To Do):** `bg-[#DFE1E6] text-[#42526E] text-xs px-2 py-0.5 rounded font-bold uppercase`
- **Status Badge (In Progress):** `bg-[#0052CC] text-white text-xs px-2 py-0.5 rounded font-bold uppercase`
- **Status Badge (Done):** `bg-[#00875A] text-white text-xs px-2 py-0.5 rounded font-bold uppercase`
- **Issue Type Icon (Bug):** A small 16x16 red square with a white dot/bug icon.
- **Issue Type Icon (Task):** A small 16x16 blue square with a white checkmark.

## 5. Advanced Component Structures

### 5.1. The Kanban Board Layout
```html
<!-- Main App Container -->
<div class="flex h-screen w-screen overflow-hidden bg-white">
  
  <!-- Left Sidebar -->
  <aside class="w-64 bg-[#F4F5F7] border-r border-[#DFE1E6] flex flex-col">
    <!-- Project Header -->
    <div class="p-4 border-b border-[#DFE1E6]">
      <h2 class="font-semibold text-[#172B4D]">TaskBan Project</h2>
      <p class="text-xs text-[#5E6C84]">Software Project</p>
    </div>
    <!-- Navigation Links -->
    <nav class="flex-1 p-2 space-y-1">
      <a href="#" class="block px-3 py-2 text-sm text-[#0052CC] bg-[#EBECF0] font-medium rounded-xl">Kanban Board</a>
      <a href="#" class="block px-3 py-2 text-sm text-[#5E6C84] hover:bg-[#EBECF0] rounded-xl">Backlog</a>
    </nav>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col min-w-0">
    <!-- Top Header -->
    <header class="h-14 border-b border-[#DFE1E6] flex items-center justify-between px-6">
      <h1 class="text-xl font-semibold text-[#172B4D]">Board</h1>
      <button class="bg-[#0052CC] text-white px-3 py-1.5 rounded-full text-sm font-medium">Create Issue</button>
    </header>

    <!-- Filters Bar -->
    <div class="p-4 flex gap-4 items-center">
      <input type="text" placeholder="Search this board" class="border border-[#DFE1E6] rounded-full px-3 py-1.5 text-sm w-48">
      <div class="flex -space-x-2">
        <!-- Avatars for quick filtering -->
        <img class="w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:-translate-y-1 transition-transform" src="avatar1.jpg">
      </div>
      <button class="text-sm text-[#5E6C84] hover:text-[#172B4D]">Only my issues</button>
    </div>

    <!-- Board Columns Wrapper -->
    <div class="flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 flex gap-4">
      
      <!-- Column -->
      <div class="w-[280px] min-w-[280px] bg-[#F4F5F7] rounded-2xl flex flex-col max-h-full">
        <!-- Column Header -->
        <div class="p-3 pb-2 sticky top-0 bg-[#F4F5F7] z-10 flex justify-between items-center">
          <h3 class="text-xs font-bold text-[#5E6C84] uppercase">To Do <span class="text-[#172B4D] ml-1">4</span></h3>
        </div>
        <!-- Column Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
           <!-- Card goes here -->
        </div>
      </div>

    </div>
  </main>
</div>
```

### 5.2. Modal / Dialog (Issue Detail View)
- When clicking a card, a wide modal opens (e.g., `max-w-4xl`), breaking the UI into a 70/30 grid.
- **Left Column (70%):** Issue Type, Issue Key, Summary (Large Text), Description (Rich Text), Activity/Comments Tab.
- **Right Column (30%):** Status Dropdown, Assignee Dropdown, Reporter, Priority, Labels.
- **Background overlay:** `bg-gray-900 bg-opacity-50 backdrop-blur-sm`.
