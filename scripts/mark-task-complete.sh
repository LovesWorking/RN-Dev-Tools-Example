#!/bin/bash

# Mark a task as complete in TODO file
# Usage: bash mark-task-complete.sh "task description" [TODO-file]

TASK="$1"
TODO_FILE="${2:-TODO.md}"

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