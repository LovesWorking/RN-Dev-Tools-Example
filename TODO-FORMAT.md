# TODO Format Guide for Automated Task Runner

## Required Format

Tasks MUST follow this exact format for the automated runner to work:
```markdown
- [ ] [#001] Complete self-contained task description
      → First sub-task that needs to be done
      → Second sub-task to complete
      → Third sub-task with specific details
      → Verification step to ensure it works
      → Documentation or cleanup step
```

## Key Requirements

### 1. Task Format
- **MUST** start with `- [ ]` for uncompleted tasks
- **MUST** have task ID in format `[#XXX]` immediately after checkbox
- Task ID should be 3 digits with leading zeros (e.g., `[#001]`, `[#010]`, `[#100]`)
- Main description should be complete and self-contained
- **MUST** include all necessary sub-tasks with `→` prefix
- Each task should be completable without waiting for other tasks

### 2. Task States
- `[ ]` = Not started (will be picked up by runner)
- `[x]` = Complete (will be skipped by runner)
- `[~]` = In progress (optional - for manual tracking)
- `[!]` = Blocked (optional - for manual tracking)

### 3. Sub-Task Requirements (IMPORTANT - Prevents Blockers)
- **Every task MUST include ALL necessary sub-tasks**
- Sub-tasks use `→` prefix on indented lines below main task
- Include setup, implementation, verification, and cleanup steps
- No task should depend on another task being completed first
- If a task seems to need another task, combine them or include all steps

### 4. File Structure
Tasks can be organized with headers, but each task must be self-contained:

```markdown
# TODO: Project Name

## Feature Implementation

- [ ] [#001] Implement complete user authentication system
      → Set up auth context and provider
      → Create login form with validation
      → Create signup form with validation  
      → Implement JWT token handling
      → Add secure token storage
      → Create auth API endpoints
      → Add error handling and user feedback
      → Test login/logout flow
      → Document auth usage in README

- [ ] [#002] Build complete profile management interface
      → Create profile data model
      → Design profile edit form UI
      → Implement image upload functionality
      → Add form validation rules
      → Create API endpoints for profile updates
      → Handle loading and error states
      → Add success notifications
      → Test with various user inputs
      → Update user documentation

## Infrastructure

- [ ] [#003] Set up complete CI/CD pipeline
      → Create GitHub Actions workflow file
      → Configure build steps for all packages
      → Add test execution stage
      → Set up linting and type checking
      → Configure deployment to staging
      → Add environment variable handling
      → Set up notification webhooks
      → Test pipeline with sample PR
      → Document CI/CD process
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

### Good Task Descriptions (Self-Contained & Complete)
✅ **Complete task with all steps:**
```markdown
- [ ] [#001] Implement complete package.json configuration
      → Add 'files' field with ["lib", "src", "!**/__tests__"]
      → Add 'exports' field for ESM/CJS support
      → Update main/module paths to include .js extensions
      → Add rimraf@^5.0.0 as devDependency
      → Add clean script using rimraf
      → Run build to verify configuration
      → Test package can be imported
```

✅ **All dependencies included:**
```markdown
- [ ] [#002] Create complete user authentication system
      → Install bcrypt and jsonwebtoken packages
      → Create user model with password hashing
      → Build login endpoint with validation
      → Build signup endpoint with validation
      → Implement JWT token generation
      → Add token verification middleware
      → Create protected route examples
      → Test all auth flows
```

### Poor Task Descriptions (Incomplete or Dependent)
❌ **Missing sub-tasks:**
```markdown
- [ ] [#001] Fix the authentication bug
```

❌ **Has hidden dependencies:**
```markdown
- [ ] [#002] Deploy to production (needs #001, #003, #005 first)
```

❌ **Too vague:**
```markdown
- [ ] [#003] Update the configuration files
```

❌ **Requires external context:**
```markdown
- [ ] [#004] Implement the feature we discussed
```

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

## Avoiding Blocker Tasks (CRITICAL)

### Why Self-Contained Tasks Matter
When tasks depend on each other, you create bottlenecks:
- AI agents sit idle waiting for dependencies
- Humans get blocked and context-switch
- Progress slows dramatically
- Debugging becomes harder

### How to Make Tasks Independent
1. **Include ALL setup steps** - Don't assume previous work
2. **Add installation commands** - Include all npm/yarn installs needed
3. **Provide file paths** - Be explicit about where to make changes
4. **Include verification** - Add steps to test the work
5. **Combine related work** - If tasks are tightly coupled, make them one task

### Example: Converting Dependent Tasks to Independent

**BAD (Has Dependencies):**
```markdown
- [ ] [#001] Create user model
- [ ] [#002] Add authentication to user model (needs #001)
- [ ] [#003] Create login endpoint (needs #001 and #002)
```

**GOOD (Self-Contained):**
```markdown
- [ ] [#001] Implement complete user authentication backend
      → Create user model with all fields
      → Add password hashing to model
      → Create login endpoint with validation
      → Create signup endpoint
      → Add JWT token generation
      → Test all endpoints work
```

## Important Notes

1. **Task IDs must be unique** - Each task needs its own number
2. **Main task on one line** - Sub-tasks go on indented lines with `→`
3. **Every task is independent** - Can be done without waiting for others
4. **Include ALL sub-steps** - No hidden dependencies or assumptions
5. **Task numbers can be any 1-3 digit number** - Runner finds by ID
6. **Completed tasks stay in file** - Marked with `[x]`
7. **Runner updates automatically** - No manual marking needed

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