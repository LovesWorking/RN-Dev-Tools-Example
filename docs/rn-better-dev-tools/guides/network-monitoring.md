---
id: network-monitoring
title: Network Monitoring
---

Track and inspect all network requests in your React Native application with detailed request/response information, timing metrics, and error analysis.

> **Note**: Network monitoring is currently in development. The section appears in the menu but full functionality is being implemented.

## Overview

Network Monitoring captures all HTTP requests made by your application, providing insights into API performance, response data, headers, and error patterns.

## Accessing Network Monitor

1. Tap any menu button (G, C, or D) on the floating bubble
2. Select **NETWORK** from the menu
3. View all network requests in chronological order

## Network Statistics

The network section displays real-time statistics:

- **Recording/Paused** - Current recording status
- **Total requests** - Number of requests captured
- **Failed requests** - Count of failed requests
- **Response time** - Average response time

Status format examples:
- `Recording` - Actively capturing requests
- `3R • 1F` - 3 requests, 1 failed
- `Paused` - Not recording new requests

## Request Types

### GET Requests

Standard data fetching:

[//]: # 'GETRequests'
```tsx
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => console.log(data))

// Captured in network monitor:
// GET /users
// Status: 200
// Time: 145ms
```
[//]: # 'GETRequests'

### POST Requests

Data submission:

[//]: # 'POSTRequests'
```tsx
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John Doe' })
})

// Shows request body and response
```
[//]: # 'POSTRequests'

### PUT/PATCH Requests

Updates and modifications:

[//]: # 'PUTPATCHRequests'
```tsx
fetch(`https://api.example.com/users/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'active' })
})
```
[//]: # 'PUTPATCHRequests'

### DELETE Requests

Resource deletion:

[//]: # 'DELETERequests'
```tsx
fetch(`https://api.example.com/users/${id}`, {
  method: 'DELETE'
})
```
[//]: # 'DELETERequests'

## Request Details

### Request Information

Each request displays:

- **Method** - GET, POST, PUT, DELETE, etc.
- **URL** - Full endpoint URL
- **Status code** - HTTP response code
- **Duration** - Total request time
- **Size** - Response size in bytes
- **Timestamp** - When request was made

### Headers

View all request and response headers:

[//]: # 'HeadersView'
```tsx
// Request Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer token123",
  "User-Agent": "MyApp/1.0"
}

// Response Headers
{
  "Content-Type": "application/json",
  "Cache-Control": "max-age=3600",
  "X-Rate-Limit": "100"
}
```
[//]: # 'HeadersView'

### Request Body

Inspect request payloads:

[//]: # 'RequestBody'
```tsx
// POST/PUT request body
{
  "username": "johndoe",
  "email": "john@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```
[//]: # 'RequestBody'

### Response Body

View formatted response data:

[//]: # 'ResponseBody'
```tsx
// API response
{
  "success": true,
  "data": {
    "id": 123,
    "username": "johndoe",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```
[//]: # 'ResponseBody'

## Error Tracking

### Failed Requests

Failed requests are highlighted in red:

[//]: # 'FailedRequests'
```tsx
// 4xx Client Errors
404 Not Found
401 Unauthorized
403 Forbidden
422 Unprocessable Entity

// 5xx Server Errors
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
```
[//]: # 'FailedRequests'

### Error Details

View complete error information:

- **Error message** - Server error response
- **Stack trace** - JavaScript error stack
- **Request details** - What was sent
- **Response body** - Error details from server

### Network Errors

Connection and timeout issues:

[//]: # 'NetworkErrors'
```tsx
// Common network errors
"Network request failed"
"Timeout exceeded"
"No internet connection"
"SSL certificate invalid"
```
[//]: # 'NetworkErrors'

## Recording Controls

### Start/Stop Recording

Control when requests are captured:

- **Play button** - Start recording requests
- **Pause button** - Stop recording
- **Clear button** - Remove all captured requests

### Auto-pause

Recording automatically pauses when:
- App goes to background
- Memory threshold reached
- Maximum requests captured (1000)

## Filtering and Search

### Filter by Status

Quick filters for request status:
- **All** - Show all requests
- **Success** - 2xx responses
- **Client Error** - 4xx responses
- **Server Error** - 5xx responses
- **Pending** - In-progress requests

### Search Requests

Search by:
- URL path
- Domain name
- Status code
- Method type
- Response content

### Time Range

Filter by time:
- Last minute
- Last 5 minutes
- Last hour
- Custom range

## Performance Metrics

### Timing Breakdown

Detailed timing for each request:

[//]: # 'TimingBreakdown'
```tsx
// Request phases
DNS Lookup: 12ms
TCP Connection: 45ms
TLS Handshake: 23ms
Request Sent: 2ms
Waiting (TTFB): 89ms
Content Download: 34ms
Total: 205ms
```
[//]: # 'TimingBreakdown'

### Response Statistics

Aggregate performance data:
- **Average response time**
- **Slowest endpoint**
- **Fastest endpoint**
- **Success rate**
- **Error rate**

## Integration with React Query

Network requests from React Query are tracked:

[//]: # 'ReactQueryIntegration'
```tsx
// React Query requests appear with query key
useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json())
})

// Shows in network monitor as:
// GET /api/users [users]
```
[//]: # 'ReactQueryIntegration'

## Mock and Intercept (Planned)

Future capabilities:

### Mock Responses

Override API responses for testing:

[//]: # 'MockResponses'
```tsx
// Define mock response
{
  url: '/api/users',
  response: { users: [...] },
  delay: 500,
  status: 200
}
```
[//]: # 'MockResponses'

### Modify Requests

Edit requests before sending:
- Add/remove headers
- Modify request body
- Change URL parameters
- Simulate delays

## Export and Share

### Export Options (Planned)

- **HAR file** - Standard HTTP Archive format
- **JSON** - All request/response data
- **CSV** - Summary statistics
- **cURL** - Copy as cURL command

### Share Features (Planned)

- Share specific request details
- Export session for debugging
- Generate bug reports
- Team collaboration

## Common Use Cases

### API Debugging

Debug API integration issues:

[//]: # 'APIDebugging'
```tsx
// Check if requests are being made
// Verify correct endpoints
// Inspect request payloads
// Validate response format
// Identify error patterns
```
[//]: # 'APIDebugging'

### Performance Optimization

Identify performance bottlenecks:

[//]: # 'PerformanceOptimization'
```tsx
// Find slow endpoints
// Detect redundant requests
// Identify large payloads
// Check caching headers
// Monitor request frequency
```
[//]: # 'PerformanceOptimization'

### Error Handling

Test error scenarios:

[//]: # 'ErrorHandling'
```tsx
// Verify error handling
// Check retry logic
// Test offline behavior
// Validate error messages
// Monitor error rates
```
[//]: # 'ErrorHandling'

## Best Practices

### Request Organization

Structure requests for easy debugging:

[//]: # 'RequestOrganization'
```tsx
// Use descriptive endpoints
/api/v1/users ✓
/api/getData ✗

// Include version in path
/api/v2/products ✓
/products ✗
```
[//]: # 'RequestOrganization'

### Header Management

Use consistent headers:

[//]: # 'HeaderManagement'
```tsx
// Standard headers
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-App-Version': '1.0.0',
  'X-Request-ID': 'uuid'
}
```
[//]: # 'HeaderManagement'

### Error Responses

Standardize error formats:

[//]: # 'ErrorResponses'
```tsx
// Consistent error structure
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User does not exist",
    "details": {...}
  }
}
```
[//]: # 'ErrorResponses'

## Performance Considerations

### Memory Management

Network monitor limits:
- Maximum 1000 requests stored
- Old requests auto-removed
- Large responses truncated
- Binary data not stored

### Impact on App

Minimal performance overhead:
- Async request interception
- Lazy UI rendering
- Dev-only implementation
- Auto-disabled in production

## Platform Notes

### iOS Specific

- Requires no additional setup
- Works with all networking libraries
- Captures WKWebView requests

### Android Specific

- Works with OkHttp
- Captures WebView requests
- May need network permission

### Web Support

- Captures fetch and XHR
- Browser DevTools integration
- CORS considerations

## Troubleshooting

### Requests Not Appearing

If requests don't show:
1. Ensure recording is active
2. Check filter settings
3. Verify network permissions
4. Restart the app

### Missing Request Details

For incomplete data:
1. Check response size limits
2. Verify content-type headers
3. Look for parsing errors
4. Check encoding issues

## Current Limitations

- Binary data not displayed
- WebSocket support pending
- GraphQL specific features planned
- Maximum 1000 requests stored

## Roadmap

### Current
✅ Basic request capture
✅ Status statistics
⏳ Full request details view

### Next Release
⏳ Request/response body viewing
⏳ Header inspection
⏳ Search and filter
⏳ Export capabilities

### Future
⏳ Mock responses
⏳ Request modification
⏳ WebSocket support
⏳ GraphQL debugging

## Next Steps

- [React Query Tools](./react-query-tools.md) - Query-specific debugging
- [Storage Monitoring](./storage-monitoring.md) - Local data inspection
- [Environment Monitoring](./environment-monitoring.md) - Config debugging