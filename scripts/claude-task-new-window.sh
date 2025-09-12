#!/bin/bash

# Check if task argument is provided
if [ -z "$1" ]; then
    echo "Error: No task provided"
    echo "Usage: npm task \"Your task description here\""
    exit 1
fi

# Get the task and TODO file
TASK="$1"
TODO_FILE="${2:-TODO.md}"
CURRENT_DIR="$(pwd)"

echo "🚀 Opening new terminal for task: $TASK"

# Auto-close delay in seconds (0 = no auto-close, wait for keypress)
AUTO_CLOSE_DELAY=3

# Check which terminal emulator to use
if [ "$TERM_PROGRAM" = "vscode" ]; then
    # For VS Code integrated terminal, we'll use a different approach
    # Create a script that VS Code can execute
    SCRIPT_PATH="/tmp/claude_task_$$.command"
    cat > "$SCRIPT_PATH" << EOF
#!/bin/bash
cd "$CURRENT_DIR"

# Run the claude task and capture exit code
bash scripts/claude-task.sh "$TASK" "$TODO_FILE"
exit_code=\$?

echo ""
if [ \$exit_code -eq 0 ]; then
    echo "✅ Task completed successfully"
    if [ $AUTO_CLOSE_DELAY -gt 0 ]; then
        echo "Window will close in $AUTO_CLOSE_DELAY seconds..."
        sleep $AUTO_CLOSE_DELAY
        osascript -e 'tell application "Terminal" to close (every window whose name contains "claude_task_$$")' &
    else
        echo "Press any key to close..."
        read -n 1
    fi
else
    echo "❌ Task failed - keeping window open"
    echo "Press any key to close..."
    read -n 1
fi
EOF
    chmod +x "$SCRIPT_PATH"
    
    # Open the script (this will open in Terminal.app on macOS)
    open "$SCRIPT_PATH"
    
    # Clean up the script after a delay
    (sleep 30 && rm -f "$SCRIPT_PATH" 2>/dev/null) &
    
elif [ "$TERM_PROGRAM" = "Apple_Terminal" ] || [ -z "$TERM_PROGRAM" ]; then
    # Use AppleScript to open a new Terminal window with auto-close
    osascript << EOF
tell application "Terminal"
    activate
    set newWindow to do script "cd '$CURRENT_DIR' && bash scripts/claude-task.sh '$TASK' '$TODO_FILE'; exit_code=\$?; echo ''; if [ \$exit_code -eq 0 ]; then echo '✅ Task completed successfully'; if [ $AUTO_CLOSE_DELAY -gt 0 ]; then echo 'Window will close in $AUTO_CLOSE_DELAY seconds...'; sleep $AUTO_CLOSE_DELAY; exit; else echo 'Press any key to close...'; read -n 1; exit; fi; else echo '❌ Task failed - keeping window open'; echo 'Press any key to close...'; read -n 1; exit; fi"
    set current settings of newWindow to settings set "Basic"
end tell
EOF

elif [ "$TERM_PROGRAM" = "iTerm.app" ]; then
    # Use AppleScript for iTerm2 with auto-close
    osascript << EOF
tell application "iTerm"
    activate
    create window with default profile
    tell current session of current window
        write text "cd '$CURRENT_DIR' && bash scripts/claude-task.sh '$TASK' '$TODO_FILE'; exit_code=\$?; echo ''; if [ \$exit_code -eq 0 ]; then echo '✅ Task completed successfully'; if [ $AUTO_CLOSE_DELAY -gt 0 ]; then echo 'Window will close in $AUTO_CLOSE_DELAY seconds...'; sleep $AUTO_CLOSE_DELAY; exit; else echo 'Press any key to close...'; read -n 1; exit; fi; else echo '❌ Task failed - keeping window open'; echo 'Press any key to close...'; read -n 1; exit; fi"
    end tell
end tell
EOF

else
    echo "⚠️  Unknown terminal program: $TERM_PROGRAM"
    echo "Running in current terminal instead..."
    bash scripts/claude-task.sh "$TASK"
fi

echo "✅ New terminal opened for task"