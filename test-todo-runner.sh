#!/bin/bash

# Test script for todo-runner.sh with various task formats

echo "Testing todo-runner.sh with different task formats"
echo "=================================================="

# Create a test TODO file
cat > TEST-TODO-RUNNER.md << 'EOF'
# Test TODO File

- [ ] [#001] Simple task without special characters
- [ ] [#002] Task with "double quotes" in it
- [ ] [#003] Task with 'single quotes' in it
- [ ] [#004] Task with both "double" and 'single' quotes
- [ ] [#005] Remove "noEmit": false from tsconfig.json
- [ ] [#006] Task with $dollar signs and ${variables}
- [ ] [#007] Task with backslash \ characters
- [ ] [#008] Task with `backticks` and command substitution
- [x] [#009] Completed task (should be skipped)
- [ ] [#010] Task with special chars: & | ; > < 
EOF

echo "Created TEST-TODO-RUNNER.md with test tasks"
echo ""

# Test the --run-task function directly
test_run_task() {
    local task="$1"
    echo "Testing task: $task"
    
    # Escape the task description for safe embedding in the script
    ESCAPED_TASK=$(echo "$task" | sed "s/'/'\\\\''/g" | sed 's/"/\\"/g')
    CURRENT_DIR="$(pwd)"
    TODO_FILE="TEST-TODO-RUNNER.md"
    
    # Create a temporary script that Terminal can run
    SCRIPT_PATH="/tmp/test_task_$$.sh"
    cat > "$SCRIPT_PATH" << 'SCRIPT_EOF'
#!/bin/bash
cd "'"$CURRENT_DIR"'"

TASK='"'$ESCAPED_TASK'"'
TODO_FILE='"'$TODO_FILE'"'

echo "🚀 Starting Task: $TASK"
echo "----------------------------------------"
echo "Task variable content: [$TASK]"
echo "TODO file: $TODO_FILE"
echo "Working directory: $(pwd)"

# Escape single quotes in task for the mark-complete command
ESCAPED_TASK_FOR_CMD=$(echo "$TASK" | sed "s/'/'\\\\''/g")

echo ""
echo "Command that would be run:"
echo "bash scripts/todo-runner.sh --mark-complete '$ESCAPED_TASK_FOR_CMD' '$TODO_FILE'"
echo ""
echo "✅ Test completed"
SCRIPT_EOF
    
    chmod +x "$SCRIPT_PATH"
    
    # Run the script directly (not in new terminal for testing)
    echo "Running test script..."
    bash "$SCRIPT_PATH"
    echo "Exit code: $?"
    echo "---"
    
    # Clean up
    rm -f "$SCRIPT_PATH"
    echo ""
}

# Test various task formats
test_run_task '[#001] Simple task without special characters'
test_run_task '[#002] Task with "double quotes" in it'
test_run_task '[#003] Task with '\''single quotes'\'' in it'
test_run_task '[#005] Remove "noEmit": false from tsconfig.json'

echo "=================================================="
echo "Test completed. Check output above for any issues."
echo ""
echo "Now testing the actual todo-runner.sh script..."
echo ""

# Test the actual script with a simple task
bash scripts/todo-runner.sh 1-1 TEST-TODO-RUNNER.md