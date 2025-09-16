# TODO: Repository Refactoring

## Directory Structure Setup

- [ ] [#001] Create all directory structures
- [ ] [#002] Move shared utility files

## Feature Migration

- [ ] [#003] Extract and migrate transcription feature
- [ ] [#004] Extract device controls from HTML
- [ ] [#005] Migrate UI toolkit feature
- [ ] [#006] Migrate Zoom session core

## Backend Services

- [ ] [#007] Migrate AI facilitation backend
- [ ] [#008] Organize Express server code

## Build and Integration

- [ ] [#009] Update TypeScript build configuration
- [ ] [#010] Fix all import paths
- [ ] [#011] Test everything works

## Finalization

- [ ] [#012] Create documentation
- [ ] [#013] Clean up old structure

---

## Task Details

### Task #001: Create all directory structures
Steps:
1. Create src/features directory
2. Create src/shared directory with subdirs (types, utils, constants, hooks)
3. Create src/server directory with subdirs (express, websocket, config)
4. Create src/features/zoom-session with subdirs (components, hooks, utils, types, video, controls, state, handlers)
5. Create src/features/transcription with subdirs (components, hooks, managers, utils, types)
6. Create src/features/ui-toolkit with subdirs (components, themes, hooks, utils, session)
7. Create src/features/device-controls with subdirs (components, hooks, utils)
8. Create src/features/ai-facilitation with subdirs (websocket, audio, services, state, utils)

### Task #002: Move shared utility files
Depends on: #001
Steps:
1. Move src/manual/types.ts to src/shared/types/index.ts
2. Check if src/manual/constants.ts exists, move to src/shared/constants/index.ts
3. Move src/manual/debug-logger.ts to src/shared/utils/debug-logger.ts
4. Move src/manual/dom.ts to src/shared/utils/dom-helpers.ts
5. Move src/manual/ui.ts to src/shared/utils/ui-helpers.ts
6. Create src/shared/hooks/useLocalStorage.ts (extract if exists)
7. Create src/shared/hooks/useWebSocket.ts (extract if exists)
8. Create src/shared/hooks/useMediaPermissions.ts (extract if exists)

### Task #003: Extract and migrate transcription feature
Depends on: #001
Steps:
1. Move src/manual/transcription-types.ts to src/features/transcription/types/index.ts
2. Move src/manual/transcription-manager.ts to src/features/transcription/managers/transcription-manager.ts
3. Move src/manual/transcription.ts to src/features/transcription/index.ts
4. Move src/manual/caption-combiner.ts to src/features/transcription/utils/caption-combiner.ts
5. Move src/manual/useZoomTranscription.ts to src/features/transcription/hooks/useZoomTranscription.ts
6. Extract transcription demo logic from uitoolkit.ts (lines 543-574) to hooks/useTranscriptionDemo.ts
7. Extract real-time transcription logic from uitoolkit.ts (lines 820-1073) to hooks/useRealTimeTranscription.ts
8. Create TranscriptionDemo component from extracted code
9. Create TranscriptionOverlay component from uitoolkit.ts (lines 580-818)
10. Create TranscriptionEntry component for reusable transcript entries

### Task #004: Extract device controls from HTML
Depends on: #001
Steps:
1. Create DeviceSelector component from index.html (lines 176-200)
2. Create AudioLevelIndicator component from index.html (lines 219-224)
3. Create CameraPreview component from index.html (lines 227-230)
4. Create DeviceControlPanel component combining all device controls
5. Create useMediaDevices hook from index.html JavaScript (lines 400-439)
6. Create useAudioLevel hook from index.html JavaScript (lines 516-550)
7. Create useCameraPreview hook from index.html JavaScript (lines 570-596)
8. Create device-manager.ts utility for device enumeration
9. Create audio-analyzer.ts utility for audio level analysis
10. Create test-sounds.ts utility for speaker testing

### Task #005: Migrate UI toolkit feature
Depends on: #001, #003
Steps:
1. Move src/manual/custom-theme-uitoolkit.ts to src/features/ui-toolkit/themes/custom-theme.ts
2. Move src/manual/ui-toolkit-components.ts to src/features/ui-toolkit/components/index.ts
3. Extract purple theme CSS from uitoolkit.ts (lines 29-402) to themes/purple-theme.ts
4. Remove transcription code from uitoolkit.ts (already extracted in #003)
5. Move cleaned uitoolkit.ts to src/features/ui-toolkit/index.ts
6. Create theme-manager.ts for theme switching logic
7. Create useUIToolkit hook for initialization logic
8. Extract session management to session-manager.ts

### Task #006: Migrate Zoom session core
Depends on: #001, #002
Steps:
1. Move src/manual/entry.ts to src/features/zoom-session/index.ts (update all imports)
2. Move src/manual/state.ts to src/features/zoom-session/state/session-state.ts
3. Move src/manual/events.ts to src/features/zoom-session/handlers/event-handlers.ts
4. Move src/manual/video-constants.ts to src/features/zoom-session/video/constants.ts
5. Move src/manual/video-layout-helper.ts to src/features/zoom-session/video/layout-helper.ts
6. Move src/manual/video.ts to src/features/zoom-session/video/video-manager.ts
7. Move src/manual/selfVideo.ts to src/features/zoom-session/video/self-video.ts
8. Move src/manual/controls.ts to src/features/zoom-session/controls/media-controls.ts
9. Extract audio controls to src/features/zoom-session/controls/audio-controls.ts
10. Extract video controls to src/features/zoom-session/controls/video-controls.ts

### Task #007: Migrate AI facilitation backend
Depends on: #001
Steps:
1. Convert websocket-server.js to TypeScript
2. Move to src/features/ai-facilitation/websocket/server.ts
3. Extract OpenAI integration to services/openai-service.ts
4. Extract ElevenLabs integration to services/elevenlabs-service.ts
5. Create audio/audio-processor.ts for audio processing logic
6. Create audio/tts-manager.ts for text-to-speech management
7. Create audio/audio-queue.ts for audio queueing
8. Create state/facilitator-state.ts for AI state management
9. Create state/participant-tracker.ts for tracking participants
10. Create state/conversation-context.ts for conversation history

### Task #008: Organize Express server code
Depends on: #001
Steps:
1. Convert server.js to TypeScript
2. Move to src/server/express/index.ts
3. Extract JWT generation logic to express/auth/jwt-service.ts
4. Extract OAuth handlers to express/auth/oauth-handlers.ts
5. Extract API routes to express/routes/index.ts
6. Create config/zoom-config.ts for Zoom SDK configuration
7. Create config/server-config.ts for port and environment settings
8. Create config/cors-config.ts for CORS settings

### Task #009: Update TypeScript build configuration
Depends on: #006, #007, #008
Steps:
1. Update tsconfig.json with path aliases for @zoom, @transcription, @ui-toolkit, etc.
2. Update include/exclude paths for new structure
3. Change build output directory from public/js/manual to appropriate new location
4. Update build script in package.json
5. Update dev script in package.json to watch new directories
6. Add feature-specific build scripts if needed

### Task #010: Fix all import paths
Depends on: #002, #003, #004, #005, #006, #007, #008
Steps:
1. Fix all imports in zoom-session feature files
2. Fix all imports in transcription feature files
3. Fix all imports in ui-toolkit feature files
4. Fix all imports in device-controls feature files
5. Fix all imports in ai-facilitation feature files
6. Fix all imports in server files
7. Update public/index.html script imports to point to new compiled JS
8. Update any CDN or external references

### Task #011: Test everything works
Depends on: #009, #010
Steps:
1. Run TypeScript compilation (npm run build)
2. Verify build output structure is correct
3. Test joining a Zoom session
4. Test transcription functionality
5. Test UI toolkit theming
6. Test device selection and controls
7. Test AI facilitation WebSocket connection
8. Run full end-to-end test of all features
9. Test production build (npm start)

### Task #012: Create documentation
Depends on: #010
Steps:
1. Create src/features/zoom-session/README.md
2. Create src/features/transcription/README.md
3. Create src/features/ui-toolkit/README.md
4. Create src/features/device-controls/README.md
5. Create src/features/ai-facilitation/README.md
6. Create main ARCHITECTURE.md documenting overall structure
7. Create dependency graph visualization

### Task #013: Clean up old structure
Depends on: #011
Steps:
1. Delete src/manual directory (ONLY after all tests pass)
2. Delete public/js/manual directory
3. Update .gitignore to exclude old paths and include new ones
4. Run final verification that nothing is broken

---

## Notes

### Current Structure Problems
- Files scattered across `/src/manual/` with unclear relationships
- Mixed concerns (transcription, video, UI toolkit, etc.) in same directory
- Backend files (server.js, websocket-server.js) in root directory
- No clear separation between features

### Target Structure
```
src/
├── features/
│   ├── zoom-session/     # Core Zoom SDK
│   ├── transcription/    # All transcription logic
│   ├── ui-toolkit/       # Zoom UI toolkit
│   ├── device-controls/  # Audio/video devices
│   └── ai-facilitation/  # AI & WebSocket
├── shared/              # Truly shared utilities
└── server/              # Backend services
```

### Critical Dependencies
- **uitoolkit.ts** has transcription code mixed in - must extract transcription first (#003 before #005)
- **entry.ts** is the main entry point - be very careful updating imports (#006)
- Device controls are currently inline JavaScript in **index.html** (#004)
- **server.js** and **websocket-server.js** need TypeScript conversion (#007, #008) so its more clear