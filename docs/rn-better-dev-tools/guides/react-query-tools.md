---
id: react-query-tools
title: React Query DevTools
---

Comprehensive React Query debugging and state management directly in your React Native app.

## Overview

The React Query DevTools provide real-time visibility into your application's server state, allowing you to inspect, modify, and debug queries and mutations without leaving your app.

## Accessing React Query Tools

1. Tap any menu button (G, C, or D) on the floating bubble
2. Select **REACT QUERY** from the menu
3. The query browser opens with all active queries

## Query Browser

### Query List View

The main view displays all queries in your application:

[//]: # 'QueryBrowser'
```tsx
// Queries are automatically tracked when using React Query
const { data, error, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
})

// These appear in the dev tools automatically
```
[//]: # 'QueryBrowser'

Each query shows:
- **Query key** - The unique identifier
- **Status** - Success, error, pending, or stale
- **Data preview** - First few characters of the response
- **Last updated** - Time since last fetch

### Query Filtering

Filter queries by status using the status chips:

- **All** - Show all queries
- **Success** - Only successful queries
- **Error** - Queries that failed
- **Pending** - Currently loading queries
- **Stale** - Queries marked as stale

### Search Functionality

Use the search bar to find specific queries by key:

[//]: # 'QuerySearch'
```tsx
// Search for queries containing "user"
// Will match: ['user'], ['user', 123], ['posts', 'user']
```
[//]: # 'QuerySearch'

## Query Details

Tap any query to view detailed information:

### Data Viewer

- **JSON tree view** - Expandable/collapsible data structure
- **Type indicators** - Visual badges for data types (string, number, boolean, null, undefined)
- **Copy to clipboard** - Long-press any value to copy
- **Large data handling** - Virtualized scrolling for performance

### Query Actions

Available actions for each query:

#### Refetch

Force a query to refetch its data:

[//]: # 'RefetchQuery'
```tsx
// In your code
queryClient.refetchQueries({ queryKey: ['todos'] })

// Or use the "Refetch" button in dev tools
```
[//]: # 'RefetchQuery'

#### Invalidate

Mark a query as stale and optionally refetch:

[//]: # 'InvalidateQuery'
```tsx
// In your code
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Or use the "Invalidate" button in dev tools
```
[//]: # 'InvalidateQuery'

#### Reset

Reset query to its initial state:

[//]: # 'ResetQuery'
```tsx
// Clears data and error state
queryClient.resetQueries({ queryKey: ['todos'] })
```
[//]: # 'ResetQuery'

#### Remove

Remove a query from the cache entirely:

[//]: # 'RemoveQuery'
```tsx
// Completely removes from cache
queryClient.removeQueries({ queryKey: ['todos'] })
```
[//]: # 'RemoveQuery'

## Data Editing

### Live Data Modification

Edit query data directly in the dev tools:

1. Open a query's details
2. Tap the **Edit** button
3. Modify the JSON data
4. Tap **Save** to update the cache

[//]: # 'DataEditing'
```tsx
// Changes are immediately reflected in your app
// Useful for testing different data states
```
[//]: # 'DataEditing'

### Testing Error States

Simulate error conditions:

1. Edit a query's data
2. Set it to an error object
3. Test your error handling UI

## Mutations

### Mutation Browser

Switch to the **Mutations** tab to view all mutations:

[//]: # 'MutationBrowser'
```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  }
})

// Track mutation status in dev tools
```
[//]: # 'MutationBrowser'

### Mutation Details

Each mutation displays:
- **Mutation ID** - Unique identifier
- **Status** - Idle, pending, success, or error
- **Variables** - Input data sent to the mutation
- **Data** - Response from the server
- **Error** - Error details if failed

### Mutation Actions

- **Reset** - Clear mutation state
- **Trigger** - Re-run a mutation with previous variables

## WiFi Toggle

Simulate network conditions using the WiFi toggle:

### Offline Mode

Toggle WiFi off to:
- Test offline functionality
- Verify cached data usage
- Check error states
- Test retry logic

[//]: # 'OfflineMode'
```tsx
// When WiFi is toggled off:
// - New queries will fail
// - Cached data is still available
// - Mutations queue for retry
```
[//]: # 'OfflineMode'

### Online Recovery

Toggle WiFi back on to:
- Trigger queued mutations
- Refetch stale queries
- Test reconnection logic

## Cache Management

### Clear Cache

Remove all cached queries at once:

1. Tap the **Clear Cache** button
2. Confirm the action
3. All queries are removed and marked for refetch

### Storage Integration

React Query data stored in AsyncStorage/MMKV is accessible via:

[//]: # 'StorageIntegration'
```tsx
// Query storage keys in the Storage browser
// Keys like: ['#storage', 'async', 'react-query-cache']
```
[//]: # 'StorageIntegration'

## Performance Monitoring

### Query Statistics

View aggregated statistics:
- **Total queries** - Number of unique query keys
- **Active queries** - Currently subscribed queries
- **Stale queries** - Queries needing refresh
- **Failed queries** - Queries in error state

### Query Timing

Each query shows timing information:
- **Fetch duration** - Time to complete request
- **Last fetch** - When data was last updated
- **Stale time** - When query becomes stale
- **Cache time** - How long data stays in cache

## Advanced Features

### Query Composition

View query dependencies and relationships:

[//]: # 'QueryComposition'
```tsx
// Dependent queries show their relationships
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: fetchUser
})

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: fetchUserPosts,
  enabled: !!user?.id // Shows as dependent in dev tools
})
```
[//]: # 'QueryComposition'

### Optimistic Updates

Monitor optimistic updates in real-time:

[//]: # 'OptimisticUpdates'
```tsx
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Optimistic update visible in dev tools
    queryClient.setQueryData(['todos'], old => [...old, newTodo])
  }
})
```
[//]: # 'OptimisticUpdates'

## Tips and Best Practices

### Query Key Organization

Use consistent query key patterns for easier debugging:

[//]: # 'QueryKeyPatterns'
```tsx
// Good: Hierarchical and descriptive
['todos']
['todos', 'list']
['todos', 'detail', todoId]
['user', userId, 'posts']

// Visible structure in dev tools makes debugging easier
```
[//]: # 'QueryKeyPatterns'

### Development Workflow

1. Keep dev tools open while developing
2. Monitor query states during user interactions
3. Test edge cases by editing cached data
4. Simulate network issues with WiFi toggle
5. Verify cache invalidation logic

### Debugging Common Issues

**Queries not updating:**
- Check if query is stale
- Verify invalidation is triggered
- Test with manual refetch

**Duplicate queries:**
- Look for different query keys
- Check component re-renders
- Verify query key stability

**Performance issues:**
- Monitor active query count
- Check for unnecessary refetches
- Review stale/cache time settings

## Next Steps

- [Storage Monitoring](./storage-monitoring.md) - Inspect device storage
- [Environment Monitoring](./environment-monitoring.md) - Track env variables
- [Network Monitoring](./network-monitoring.md) - Debug API requests