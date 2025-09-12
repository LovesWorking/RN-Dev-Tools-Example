#!/bin/bash

# Simple TODO Runner - Opens tasks in terminals using npm run task
# Usage: bash todo-runner-simple.sh [start-end] [TODO-file]
# Example: bash todo-runner-simple.sh 5-10 TODO.md

RANGE="${1:-1-}"  # Default to starting from task 1
TODO_FILE="${2:-TODO.md}"  # Default to TODO.md

# Parse range
if [[ "$RANGE" =~ ^([0-9]+)-([0-9]+)?$ ]]; then
    START="${BASH_REMATCH[1]}"
    END="${BASH_REMATCH[2]}"
else
    echo "Invalid range format. Use: start-end (e.g., 5-10) or start- (e.g., 5-)"
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
            task_num=$(echo "$task_desc" | sed 's/^\[#\([0-9]\+\)\].*/\1/')
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
    # Convert to integer for comparison
    num_int=$(echo "$num" | sed 's/[^0-9]//g')
    if [ "$num_int" -eq "$START" ] 2>/dev/null; then
        actual_start=$i
    fi
    if [ -n "$END" ] && [ "$num_int" -eq "$END" ] 2>/dev/null; then
        actual_end=$i
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
    npm run task "$task" "$TODO_FILE" &
    
    # Small delay between opening terminals
    sleep 1
done

echo ""
echo "✅ Opened $((END-START+1)) task(s) in new terminals"