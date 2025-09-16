#!/bin/bash

echo "⚡ QUICK START (no rebuild)"
echo "==========================="
echo ""

# Just clear metro cache and start
echo "Clearing Metro cache..."
rm -rf .metro $TMPDIR/metro-* 2>/dev/null || true

echo "Starting Expo..."
npx expo start --clear