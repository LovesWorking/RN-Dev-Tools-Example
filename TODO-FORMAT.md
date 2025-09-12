# TODO Format Guide for Automated Task Runner

## Required Format

Tasks MUST follow this exact format for the automated runner to work:
```markdown
- [ ] [#001] Task description here
- [ ] [#002] Another task description
- [x] [#003] Completed task example
```

## Key Requirements

### 1. Task Format
- **MUST** start with `- [ ]` for uncompleted tasks
- **MUST** have task ID in format `[#XXX]` immediately after checkbox
- Task ID should be 3 digits with leading zeros (e.g., `[#001]`, `[#010]`, `[#100]`)
- Description comes after the task ID

### 2. Task States
- `[ ]` = Not started (will be picked up by runner)
- `[x]` = Complete (will be skipped by runner)
- `[~]` = In progress (optional - for manual tracking)
- `[!]` = Blocked (optional - for manual tracking)

### 3. File Structure
Tasks can be organized with headers and details, but the task lines must follow the format:

```markdown
# TODO: Project Name

## Section Name

### Subsection (optional)
- [ ] [#001] First task in this section
- [ ] [#002] Second task in this section
      → Optional details on next line
      → More details can go here
      
- [ ] [#003] Third task with inline details - keep it on one line for the task

## Another Section
- [ ] [#004] Task in different section
- [x] [#005] Completed task (will be skipped)
- [ ] [#006] Another pending task
```

## Running Tasks

### Command Format
```bash
# Run specific task by number
npm run tasks 4-4 TODO.md

# Run range of tasks
npm run tasks 1-5 TODO.md

# Run all remaining tasks
npm run tasks 1- TODO.md

# Run tasks 10 through 15
npm run tasks 10-15 TODO.md
```

### How It Works
1. Script finds all uncompleted tasks (`- [ ]`)
2. Identifies task by its number (`[#XXX]`)
3. Opens each task in a new Terminal window
4. Each Claude instance gets instructions to mark task complete when done
5. Task automatically changes from `[ ]` to `[x]` in the TODO file

## Complete Example

```markdown
# TODO: E-commerce Platform

## Backend Tasks

- [ ] [#001] Set up Express server with TypeScript
- [ ] [#002] Configure PostgreSQL database connection
- [ ] [#003] Create user authentication endpoints
      → POST /api/auth/register
      → POST /api/auth/login
      → POST /api/auth/logout
      
- [x] [#004] Set up environment variables
- [ ] [#005] Implement JWT token generation and validation

## Frontend Tasks

- [ ] [#006] Create Next.js project structure
- [ ] [#007] Set up Tailwind CSS configuration
- [ ] [#008] Build login page component
- [ ] [#009] Build registration page component
- [ ] [#010] Create protected route wrapper

## Database Tasks

- [ ] [#011] Design user schema in Prisma
- [ ] [#012] Create product model
- [ ] [#013] Set up migrations
- [x] [#014] Add seed data script
- [ ] [#015] Create indexes for performance

## Testing

- [ ] [#016] Set up Jest for unit testing
- [ ] [#017] Write auth endpoint tests
- [ ] [#018] Create E2E test suite with Playwright
```

## Tips for Task Descriptions

### Good Task Descriptions (Clear & Actionable)
✅ `- [ ] [#001] Add 'files' field to package.json with ["lib", "src"]`
✅ `- [ ] [#002] Install rimraf@^5.0.0 as devDependency`
✅ `- [ ] [#003] Create user authentication endpoint at POST /api/auth/login`

### Poor Task Descriptions (Too Vague)
❌ `- [ ] [#001] Fix the thing`
❌ `- [ ] [#002] Update stuff`
❌ `- [ ] [#003] Make it work`

## Task Details Section (Optional)

You can add detailed instructions after the task list:

```markdown
## Task Details

### Task #001: Set up Express server
Full steps:
1. Install express and @types/express
2. Create server.ts file
3. Set up basic routes
4. Configure middleware
5. Add error handling

### Task #002: Configure database
Dependencies: Needs .env file from task #004
Steps:
1. Install pg and @types/pg
2. Create database connection pool
3. Test connection on startup
```

## Important Notes

1. **Task IDs must be unique** - Each task needs its own number
2. **Keep task descriptions on one line** - Details go on indented lines below
3. **Task numbers can be any 1-3 digit number** - The runner finds tasks by their ID, not position
4. **Completed tasks stay in the file** - They're just marked with `[x]`
5. **The runner updates the file automatically** - No manual marking needed

## Automation Features

When a Claude instance completes a task, it will:
1. Run the completion command: `bash scripts/mark-task-complete.sh "[#XXX] Task description" TODO.md`
2. The task automatically changes from `- [ ]` to `- [x]` in your TODO file
3. You can see progress in real-time by checking the TODO file

## Running Multiple Claude Instances

```bash
# Example: You have 20 tasks and want to run 5 at a time

# First batch - tasks 1-5
npm run tasks 1-5 TODO.md

# Once some complete, run next batch - tasks 6-10  
npm run tasks 6-10 TODO.md

# Run specific tasks that failed
npm run tasks 7-7 TODO.md  # Just task 7
npm run tasks 9-9 TODO.md  # Just task 9

# Run all remaining uncompleted tasks
npm run tasks 1- TODO.md
```

The system handles completed tasks intelligently - if tasks 1-3 are already marked `[x]`, running `npm run tasks 1-5` will only open tasks 4 and 5.