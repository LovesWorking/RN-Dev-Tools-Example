/**
 * Formatting utilities for network events
 */

/**
 * Format bytes into human-readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds into human-readable format
 * @param ms Duration in milliseconds
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }
};

/**
 * Format HTTP status code with descriptive text
 * @param status HTTP status code
 */
export const formatHttpStatus = (status: number): string => {
  const statusTexts: Record<number, string> = {
    // 1xx Informational
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    
    // 2xx Success
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    206: 'Partial Content',
    
    // 3xx Redirection
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    
    // 4xx Client Error
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    413: 'Payload Too Large',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    
    // 5xx Server Error
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
  };

  const statusText = statusTexts[status] || 'Unknown';
  return `${status} ${statusText}`;
};

/**
 * Get color for HTTP method
 * @param method HTTP method
 */
export const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return '#10B981'; // green
    case 'POST':
      return '#3B82F6'; // blue
    case 'PUT':
      return '#F59E0B'; // amber
    case 'DELETE':
      return '#EF4444'; // red
    case 'PATCH':
      return '#8B5CF6'; // violet
    case 'HEAD':
      return '#6B7280'; // gray
    case 'OPTIONS':
      return '#14B8A6'; // teal
    default:
      return '#6B7280'; // gray
  }
};