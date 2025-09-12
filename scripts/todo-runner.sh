#!/bin/bash

# Todo Runner - All-in-one script for running Claude tasks from TODO files
# Usage: 
#   npm run tasks 1-5 TODO.md    # Run tasks 1-5
#   npm run tasks 4-4 TODO.md    # Run task 4 only
#   npm run tasks 1- TODO.md     # Run all tasks

# Check if being called to mark a task complete
if [ "$1" = "--mark-complete" ]; then
    TASK="$2"
    TODO_FILE="${3:-TODO.md}"
    
    if [ -z "$TASK" ]; then
        echo "Error: Task description required"
        exit 1
    fi
    
    if [ ! -f "$TODO_FILE" ]; then
        echo "Error: $TODO_FILE not found"
        exit 1
    fi
    
    # Escape special characters for sed
    ESCAPED_TASK=$(echo "$TASK" | sed 's/[[\.*^$()+?{|]/\\&/g')
    
    # Update the task from [ ] to [x]
    sed -i.bak "s/^- \[ \] ${ESCAPED_TASK}/- [x] ${ESCAPED_TASK}/" "$TODO_FILE"
    
    if grep -q "^- \[x\] ${ESCAPED_TASK}" "$TODO_FILE"; then
        echo "✅ Task marked as complete in $TODO_FILE"
        echo "   Task: $TASK"
    else
        echo "❌ Failed to mark task as complete"
        exit 1
    fi
    exit 0
fi

# Check if being called to run a single task in a new window
if [ "$1" = "--run-task" ]; then
    TASK="$2"
    TODO_FILE="${3:-TODO.md}"
    CURRENT_DIR="$(pwd)"
    
    # Create a temporary script that Terminal can run
    SCRIPT_PATH="/tmp/claude_task_$$.command"
    
    # Write the script with proper escaping
    cat > "$SCRIPT_PATH" << EOF
#!/bin/bash
cd "$CURRENT_DIR"

# Set the task and todo file
TASK="$(echo "$TASK" | sed 's/"/\\"/g')"
TODO_FILE="$TODO_FILE"

echo "🚀 Starting Task: \$TASK"
echo "----------------------------------------"

# Build the prompt with instructions to mark complete
# Escape single quotes in task for the mark-complete command
ESCAPED_TASK_FOR_CMD=\$(echo "\$TASK" | sed "s/'/'\\\\\\\\''/g")

PROMPT="Complete this task: \$TASK

When you're done, run this command to mark it complete in \$TODO_FILE:
bash scripts/todo-runner.sh --mark-complete '\$ESCAPED_TASK_FOR_CMD' '\$TODO_FILE'

Important: Actually run that bash command above to update the TODO file."

# Run Claude with the task
claude --dangerously-skip-permissions -p "\$PROMPT"
exit_code=\$?

echo ""
if [ \$exit_code -eq 0 ]; then
    echo "✅ Task completed successfully"
    echo "Window will close in 3 seconds..."
    sleep 3
else
    echo "❌ Task failed with exit code: \$exit_code"
    echo "Press any key to close..."
    read -n 1
fi
EOF
    
    chmod +x "$SCRIPT_PATH"
    
    # Open the script in a new Terminal window
    open "$SCRIPT_PATH"
    
    # Clean up after a delay
    (sleep 30 && rm -f "$SCRIPT_PATH" 2>/dev/null) &
    
    echo "✅ New terminal opened for task"
    exit 0
fi

# Main todo runner logic
RANGE="${1:-1-}"  # Default to starting from task 1
TODO_FILE="${2:-TODO.md}"  # Default to TODO.md

# Parse range - handle single numbers or ranges
if [[ "$RANGE" =~ ^([0-9]+)$ ]]; then
    # Single number, e.g., "8"
    START="${BASH_REMATCH[1]}"
    END="${BASH_REMATCH[1]}"
elif [[ "$RANGE" =~ ^([0-9]+)-([0-9]+)?$ ]]; then
    # Range format, e.g., "5-10" or "5-"
    START="${BASH_REMATCH[1]}"
    END="${BASH_REMATCH[2]}"
else
    echo "Invalid range format. Use: N (single task), N-M (range), or N- (from N to end)"
    exit 1
fi

# Check if TODO file exists
if [ ! -f "$TODO_FILE" ]; then
    echo "Error: $TODO_FILE not found"
    exit 1
fi

# Extract ALL tasks with their status and line numbers
IFS=$'\n'
all_tasks=($(grep -n "^- \[.\] " "$TODO_FILE"))
unset IFS

# Build arrays for uncompleted tasks only
tasks=()
task_line_nums=()
task_absolute_nums=()

for line in "${all_tasks[@]}"; do
    line_num=$(echo "$line" | cut -d: -f1)
    content=$(echo "$line" | cut -d: -f2-)
    
    # Check if task is uncompleted (has [ ] not [x])
    if echo "$content" | grep -q "^- \[ \]"; then
        # Extract task description (everything after "- [ ] ")
        task_desc=$(echo "$content" | sed 's/^- \[ \] //')
        tasks+=("$task_desc")
        task_line_nums+=("$line_num")
        
        # Extract task number if it has format [#XXX]
        if echo "$task_desc" | grep -q "^\[#[0-9]\+\]"; then
            # Extract just the number between [# and ]
            task_num=$(echo "$task_desc" | grep -o '^\[#[0-9]\+\]' | sed 's/\[#\([0-9]\+\)\]/\1/')
            task_absolute_nums+=("$task_num")
        else
            task_absolute_nums+=("$line_num")
        fi
    fi
done

# Get total uncompleted tasks
TOTAL="${#tasks[@]}"

if [ "$TOTAL" -eq 0 ]; then
    echo "No pending tasks found in $TODO_FILE"
    exit 0
fi

# Find actual positions based on task numbers
actual_start=-1
actual_end=-1

for i in "${!task_absolute_nums[@]}"; do
    num="${task_absolute_nums[$i]}"
    # Convert to integer for comparison, removing leading zeros
    num_int=$(echo "$num" | sed 's/[^0-9]//g' | sed 's/^0*//')
    # Handle edge case of all zeros
    if [ -z "$num_int" ]; then
        num_int=0
    fi
    
    # Compare with START (also remove leading zeros)
    start_int=$(echo "$START" | sed 's/^0*//')
    if [ -z "$start_int" ]; then
        start_int=0
    fi
    
    if [ "$num_int" -eq "$start_int" ] 2>/dev/null; then
        actual_start=$i
    fi
    
    if [ -n "$END" ]; then
        end_int=$(echo "$END" | sed 's/^0*//')
        if [ -z "$end_int" ]; then
            end_int=0
        fi
        if [ "$num_int" -eq "$end_int" ] 2>/dev/null; then
            actual_end=$i
        fi
    fi
done

# If we couldn't find by task number, fall back to position
if [ "$actual_start" -eq -1 ]; then
    if [ "$START" -le "$TOTAL" ]; then
        actual_start=$((START - 1))
    else
        echo "Task #$START not found or already completed"
        exit 1
    fi
fi

if [ "$actual_end" -eq -1 ]; then
    if [ -z "$END" ]; then
        actual_end=$((TOTAL - 1))
    elif [ "$END" -le "$TOTAL" ]; then
        actual_end=$((END - 1))
    else
        actual_end=$((TOTAL - 1))
    fi
fi

# Ensure end is not before start
if [ "$actual_end" -lt "$actual_start" ]; then
    actual_end="$actual_start"
fi

echo "🚀 Opening tasks ($(($actual_end - $actual_start + 1)) task(s) from $TOTAL pending)"
echo ""

# Open each task in range
for ((i=actual_start; i<=actual_end; i++)); do
    task="${tasks[$i]}"
    task_num="${task_absolute_nums[$i]}"
    
    echo "Opening task #$task_num: $task"
    bash "$0" --run-task "$task" "$TODO_FILE" &
    
    # Small delay between opening terminals
    sleep 1
done

echo ""
echo "✅ Opened $(($actual_end - $actual_start + 1)) task(s) in new terminals"