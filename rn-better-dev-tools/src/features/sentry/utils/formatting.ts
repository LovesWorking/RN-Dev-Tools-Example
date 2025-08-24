/**
 * Utility functions for formatting Sentry event data
 */

// Re-export shared formatRelativeTime
export { formatRelativeTime } from '@/rn-better-dev-tools/src/shared/utils/time/formatRelativeTime';

// Re-export shared formatting utilities
export { 
  formatBytes, 
  formatDuration,
  truncateMiddle,
} from '@/rn-better-dev-tools/src/shared/utils/formatting';

/**
 * URL components for structured display
 */
export interface UrlComponents {
  protocol: string;
  host: string;
  port?: string;
  pathname: string;
  search?: string;
  hash?: string;
  params?: Record<string, string>;
  isSecure: boolean;
  domain: string; // Just the domain without subdomain
  subdomain?: string;
  path: string[]; // Path segments
}

/**
 * Parse URL into components for better display
 * @param urlString URL to parse
 * @returns Parsed URL components
 */
export function parseUrl(urlString: string): UrlComponents | null {
  if (!urlString) return null;
  
  try {
    // Handle relative URLs by prepending a base
    const url = urlString.startsWith('http') 
      ? new URL(urlString)
      : new URL(urlString, 'http://example.com');
    
    // Extract domain parts
    const hostParts = url.hostname.split('.');
    const domain = hostParts.length >= 2 
      ? hostParts.slice(-2).join('.') 
      : url.hostname;
    const subdomain = hostParts.length > 2 
      ? hostParts.slice(0, -2).join('.') 
      : undefined;
    
    // Parse query parameters
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    // Split pathname into segments
    const pathSegments = url.pathname
      .split('/')
      .filter(segment => segment.length > 0);
    
    return {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port || undefined,
      pathname: url.pathname,
      search: url.search || undefined,
      hash: url.hash || undefined,
      params: Object.keys(params).length > 0 ? params : undefined,
      isSecure: url.protocol === 'https:',
      domain,
      subdomain,
      path: pathSegments,
    };
  } catch {
    // For malformed URLs, return basic info
    return {
      protocol: 'http',
      host: 'unknown',
      pathname: urlString,
      isSecure: false,
      domain: 'unknown',
      path: [urlString],
    };
  }
}

/**
 * Format HTTP status code with semantic color/meaning
 * @param status HTTP status code
 * @returns Status info with color and meaning
 */
export function formatHttpStatusDetail(status: number | undefined): {
  text: string;
  color: string;
  meaning: string;
} {
  if (!status) {
    return { text: 'N/A', color: '#6B7280', meaning: 'Unknown' };
  }
  
  if (status >= 200 && status < 300) {
    return { 
      text: `${status}`, 
      color: '#10B981', 
      meaning: 'Success' 
    };
  }
  
  if (status >= 300 && status < 400) {
    return { 
      text: `${status}`, 
      color: '#3B82F6', 
      meaning: 'Redirect' 
    };
  }
  
  if (status >= 400 && status < 500) {
    const meanings: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      429: 'Rate Limited',
    };
    return { 
      text: `${status}`, 
      color: '#F59E0B', 
      meaning: meanings[status] || 'Client Error' 
    };
  }
  
  if (status >= 500) {
    const meanings: Record<number, string> = {
      500: 'Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };
    return { 
      text: `${status}`, 
      color: '#EF4444', 
      meaning: meanings[status] || 'Server Error' 
    };
  }
  
  return { text: `${status}`, color: '#6B7280', meaning: 'Unknown' };
}


