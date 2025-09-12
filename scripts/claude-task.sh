#!/bin/bash

# Check if task argument is provided
if [ -z "$1" ]; then
    echo "Error: No task provided"
    echo "Usage: npm run claude-task \"Your task description here\" [TODO-file]"
    exit 1
fi

# Get the task and TODO file
TASK="$1"
TODO_FILE="${2:-TODO.md}"

# Build the prompt with instructions to mark complete
PROMPT="Complete this task: $TASK

When you're done, run this command to mark it complete in $TODO_FILE:
bash scripts/mark-task-complete.sh '$TASK' '$TODO_FILE'

Important: Actually run that bash command above to update the TODO file."

# Execute Claude with the specified flags and task
echo "🚀 Running Claude with task: $TASK"
echo "----------------------------------------"

claude --dangerously-skip-permissions -p "$PROMPT"

# Capture exit code
exit_code=$?

if [ $exit_code -eq 0 ]; then
    echo "----------------------------------------"
    echo "✅ Task completed successfully"
else
    echo "----------------------------------------"
    echo "❌ Task failed with exit code: $exit_code"
    exit $exit_code
fi