# Database Schema (Supabase/PostgreSQL)

## Tables & Logic

### 1. `admins`
* Links to Supabase Auth.
* Roles: `super_admin`, `admin`.

### 2. `employees`
* Target audience (No Login).
* Columns: `id` (UUID), `email`, `phone` (for WhatsApp), `metadata` (JSONB for custom fields).

### 3. `packages`
* The container for content.
* Columns: `slug` (unique URL), `global_styles` (JSONB for theming), `status` (draft/published).

### 4. `content_blocks`
* The actual content inside a package.
* Columns: `type` ('text', 'poll', 'image'), `content` (JSONB), `sort_order` (int).

### 5. `analytics_events`
* The tracking log.
* Columns: `employee_id`, `package_id`, `event_type` ('open', 'click', 'scroll').

## Key Relationships
* `packages` 1:N `content_blocks`
* `employees` N:N `segments`
* `employees` 1:N `analytics_events`