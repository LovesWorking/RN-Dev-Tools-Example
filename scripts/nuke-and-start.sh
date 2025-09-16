#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔥 NUKE AND START - Complete Reset and Rebuild${NC}"
echo -e "${YELLOW}================================================${NC}"

# Step 1: Kill any running Metro/Expo processes
echo -e "\n${YELLOW}Step 1: Killing any running processes...${NC}"
pkill -f "expo" || true
pkill -f "metro" || true
pkill -f "react-native" || true
pkill -f "watchman" || true
sleep 2

# Step 2: Clear all caches
echo -e "\n${YELLOW}Step 2: Clearing all caches...${NC}"
rm -rf ~/.expo
rm -rf .expo
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
watchman watch-del-all 2>/dev/null || true
npm cache clean --force

# Step 3: Remove all node_modules and lock files
echo -e "\n${YELLOW}Step 3: Removing all node_modules and lock files...${NC}"
rm -rf node_modules
rm -rf package-lock.json

# Remove node_modules from all packages
for package in packages/*/; do
  if [ -d "$package" ]; then
    echo "  Cleaning ${package}..."
    rm -rf "${package}node_modules"
    rm -rf "${package}package-lock.json"
    rm -rf "${package}lib"
  fi
done

# Step 4: Remove iOS and Android folders
echo -e "\n${YELLOW}Step 4: Removing iOS and Android folders...${NC}"
rm -rf ios
rm -rf android

# Step 5: Fresh install of dependencies
echo -e "\n${YELLOW}Step 5: Installing dependencies...${NC}"
npm install

# Step 6: Install dependencies in each package
echo -e "\n${YELLOW}Step 6: Installing package dependencies...${NC}"
for package in packages/*/; do
  if [ -d "$package" ] && [ -f "${package}package.json" ]; then
    echo "  Installing dependencies in ${package}..."
    cd "$package"
    npm install
    cd ../..
  fi
done

# Step 7: Build all packages
echo -e "\n${YELLOW}Step 7: Building packages...${NC}"

# Build env-manager
if [ -d "packages/react-native-env-manager" ]; then
  echo "  Building react-native-env-manager..."
  cd packages/react-native-env-manager
  npm run build
  cd ../..
fi

# Build network-inspector
if [ -d "packages/react-native-network-inspector" ]; then
  echo "  Building react-native-network-inspector..."
  cd packages/react-native-network-inspector
  npm run build
  cd ../..
fi

# Build storage-inspector if it exists
if [ -d "packages/react-native-storage-inspector" ]; then
  echo "  Building react-native-storage-inspector..."
  cd packages/react-native-storage-inspector
  npm run build 2>/dev/null || echo "    ⚠️  Build failed, continuing..."
  cd ../..
fi

# Step 8: Clear Expo cache one more time
echo -e "\n${YELLOW}Step 8: Final cache clear...${NC}"
npx expo start --clear --port 8081 &
EXPO_PID=$!
sleep 5
kill $EXPO_PID 2>/dev/null || true

# Step 9: Start the app
echo -e "\n${GREEN}✅ All clean! Starting the app...${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "${YELLOW}Note: This project uses Expo Go only (no dev builds)${NC}"

echo -e "${GREEN}Starting Expo server...${NC}"
echo -e "${YELLOW}Use Expo Go app on your device/simulator to scan the QR code${NC}"
echo -e "${YELLOW}Or press 'i' for iOS simulator, 'a' for Android${NC}"

# Just start expo without the --go flag to avoid EAS login
npx expo start --clear