# Routing Architecture Analysis & Improvement Plan

## Current Routing Structure

### File Structure Overview
```
app/
  _layout.tsx          # Root layout with Stack navigator
  index.tsx           # Main Pokemon app screen
  +not-found.tsx      # 404 handler
  test-filters.tsx    # Test screen
  components/
    PokemonCardSwipeable.tsx  # Component used in index
```

### Current Implementation Details

#### 1. Root Layout (`app/_layout.tsx`)
- **Navigator Type**: Basic Stack navigator
- **Features**:
  - Custom theme provider (DevToolsThemeProvider)
  - QueryClient setup with global persistence
  - Linear gradient background
  - Splash screen handling with fonts
  - No authentication logic
  - No protected routes
  - Headers hidden globally

#### 2. Main Screen (`app/index.tsx`)
- **Type**: Single monolithic screen
- **Features**:
  - Pokemon card swipe interface
  - Dev tools bubble integration
  - No navigation to other screens
  - No user context or authentication

#### 3. Error Handling (`app/+not-found.tsx`)
- Basic 404 screen with link back to home
- Uses themed components

### Current Issues & Limitations

1. **No Authentication System**
   - No user context or auth state management
   - No login/signup screens
   - No protected routes
   - No session persistence

2. **Flat Route Structure**
   - All screens at root level
   - No logical grouping of features
   - No separation between public/private areas

3. **Missing Navigation Features**
   - No tabs for main app sections
   - No drawer for settings/profile
   - No modal presentations
   - Single screen app with no real navigation

4. **No Route Guards**
   - Any route is accessible at any time
   - No redirect logic based on auth state
   - No prevention of back navigation to auth screens

---

## Recommended Improvements

### 1. Implement Proper Authentication Flow

#### Required Components
```typescript
// contexts/auth.tsx
- AuthContext with session management
- useAuth hook for components
- Session persistence with SecureStore
- Login/logout methods
- User profile state
```

#### Auth State Management
- Use AsyncStorage or SecureStore for token persistence
- Implement refresh token logic
- Handle auth state loading with splash screen
- Clear navigation stack on logout

### 2. Restructure App with Route Groups

#### Proposed File Structure
```
app/
  _layout.tsx                    # Root with auth logic
  +not-found.tsx                # Global 404
  +native-intent.tsx            # Deep link handler
  
  (auth)/                       # Public routes (only when logged out)
    _layout.tsx                 # Stack for auth screens
    sign-in.tsx                 # Login screen
    sign-up.tsx                 # Registration screen
    forgot-password.tsx         # Password reset
    onboarding.tsx             # Optional onboarding flow
    
  (app)/                        # Protected routes (only when logged in)
    _layout.tsx                 # Tab layout for main app
    (tabs)/
      _layout.tsx               # Tab navigator setup
      (home)/
        _layout.tsx             # Stack for home tab
        index.tsx               # Pokemon cards (current index.tsx)
        pokemon/[id].tsx        # Pokemon detail screen
      (collection)/
        _layout.tsx             # Stack for collection
        index.tsx               # User's Pokemon collection
        [id].tsx                # Collection item detail
      (battle)/
        _layout.tsx             # Stack for battles
        index.tsx               # Battle arena
        history.tsx             # Battle history
      profile/
        _layout.tsx             # Stack for profile
        index.tsx               # User profile
        settings.tsx            # App settings
        edit.tsx                # Edit profile
    
    modals/                     # Modal screens
      search.tsx                # Global Pokemon search
      filters.tsx               # Filter options
      dev-tools.tsx             # Dev tools modal
```

### 3. Implement Protected Routes Pattern

#### Root Layout with Protection
```typescript
// app/_layout.tsx
export default function RootLayout() {
  const { session, isLoading } = useAuth();
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <Stack>
      {/* Protected: Only when authenticated */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      
      {/* Public: Only when NOT authenticated */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
```

### 4. Add Navigation Guards & Redirects

#### Prevent Back Navigation to Auth
```typescript
// In sign-in success handler
router.replace('/(app)/(tabs)'); // Replace instead of push
```

#### Auto-redirect Based on Auth State
```typescript
// Protected routes automatically redirect when guard fails
<Stack.Protected guard={!!session}>
  // User is redirected to auth if not logged in
</Stack.Protected>
```

#### Deep Link Handling
```typescript
// app/+native-intent.tsx
export async function redirectSystemPath({ path, initial }) {
  const { session } = await getAuthState();
  
  if (!session && path.startsWith('/(app)')) {
    return '/sign-in';
  }
  
  return path;
}
```

### 5. Implement Tab Navigation for Main App

```typescript
// app/(app)/_layout.tsx
export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PokemonTheme.colors.primary,
        tabBarStyle: { 
          backgroundColor: PokemonTheme.colors.darkBg,
          borderTopColor: 'rgba(255,215,0,0.2)'
        }
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Pokédex',
          tabBarIcon: ({ color }) => <Icon name="albums" color={color} />
        }}
      />
      <Tabs.Screen
        name="(collection)"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <Icon name="star" color={color} />
        }}
      />
      <Tabs.Screen
        name="(battle)"
        options={{
          title: 'Battle',
          tabBarIcon: ({ color }) => <Icon name="flash" color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person" color={color} />
        }}
      />
    </Tabs>
  );
}
```

### 6. Session Management Best Practices

#### Secure Token Storage
```typescript
// utils/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const TokenManager = {
  async getToken() {
    return await SecureStore.getItemAsync('authToken');
  },
  
  async setToken(token: string) {
    await SecureStore.setItemAsync('authToken', token);
  },
  
  async removeToken() {
    await SecureStore.deleteItemAsync('authToken');
  }
};
```

#### Auto-logout on 401
```typescript
// In API interceptor
if (response.status === 401) {
  await TokenManager.removeToken();
  router.replace('/sign-in');
}
```

### 7. Navigation State Persistence

```typescript
// For development - persist navigation state
import { useNavigationContainerRef } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAVIGATION_STATE_KEY = 'NAVIGATION_STATE';

export function useNavigationPersistence() {
  const navigationRef = useNavigationContainerRef();
  
  // Save state on change
  React.useEffect(() => {
    const state = navigationRef.current?.getRootState();
    if (state) {
      AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
    }
  }, [navigationRef]);
}
```

### 8. Loading States & Transitions

#### Splash Screen Management
```typescript
// app/_layout.tsx
export default function Root() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      // Check auth state
      await checkAuthState();
      // Load resources
      await loadResources();
      // Hide splash
      await SplashScreen.hideAsync();
      setIsReady(true);
    }
    prepare();
  }, []);
  
  if (!isReady) return null;
  
  return <RootNavigator />;
}
```

---

## Implementation Priority

### Phase 1: Core Auth Infrastructure (Critical)
1. Create auth context and hooks
2. Add login/signup screens
3. Implement protected routes in root layout
4. Add secure token storage

### Phase 2: Route Restructuring (High)
1. Create route groups structure
2. Move existing screens to appropriate groups
3. Add tab navigation for main app
4. Implement proper back navigation

### Phase 3: Enhanced Features (Medium)
1. Add profile and settings screens
2. Implement modal presentations
3. Add deep linking support
4. Create onboarding flow

### Phase 4: Polish & UX (Low)
1. Add loading transitions
2. Implement navigation persistence
3. Add gesture-based navigation
4. Create custom tab bar

---

## Migration Steps

### Step 1: Create Auth Context
```bash
mkdir -p contexts
# Create contexts/auth.tsx with SessionProvider
```

### Step 2: Create Route Groups
```bash
mkdir -p app/{auth,app}
mkdir -p app/app/{tabs,modals}
```

### Step 3: Move Existing Screens
- Move `app/index.tsx` → `app/(app)/(tabs)/(home)/index.tsx`
- Keep `app/_layout.tsx` but add protection logic
- Create new auth screens in `app/(auth)/`

### Step 4: Update Root Layout
- Add SessionProvider wrapper
- Implement Stack.Protected guards
- Handle loading states

### Step 5: Test Auth Flow
- Test login → redirect to app
- Test logout → redirect to auth
- Test back button behavior
- Test deep links with/without auth

---

## Security Considerations

1. **Token Security**
   - Use SecureStore for sensitive data
   - Never store passwords
   - Implement token refresh logic
   - Clear tokens on logout

2. **Navigation Security**
   - Protected routes prevent unauthorized access
   - Deep links validate auth state
   - Sensitive screens require re-authentication
   - Clear navigation stack on logout

3. **Session Management**
   - Implement session timeout
   - Handle token expiration gracefully
   - Support biometric authentication
   - Secure API communication

---

## Testing Checklist

- [ ] User can't access app without login
- [ ] User can't go back to login after authentication
- [ ] Deep links redirect properly based on auth
- [ ] Logout clears all user data and navigation
- [ ] Token persists across app restarts
- [ ] 401 responses trigger re-authentication
- [ ] Protected routes redirect when guard fails
- [ ] Tab navigation only shows for authenticated users
- [ ] Modals dismiss properly on logout
- [ ] Loading states show during auth checks