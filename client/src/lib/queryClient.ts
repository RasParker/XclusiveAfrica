import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Enhanced API request function with better error handling
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    // Check if response is ok first
    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `API request failed: ${response.statusText}`;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          // If response is HTML (error page), provide generic message
          errorMessage = getGenericErrorMessage(response.status);
        }
      } catch (parseError) {
        // If parsing fails, use generic message based on status
        errorMessage = getGenericErrorMessage(response.status);
      }

      throw new Error(errorMessage);
    }

    // Ensure response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned an invalid response format');
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection and try again');
    }

    // Re-throw other errors as-is
    throw error;
  }
};

// Admin API request helper that includes auth token in Authorization header
export const adminApiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('xclusive_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Helper function to provide user-friendly error messages
const getGenericErrorMessage = (status: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request - please check your input and try again';
    case 401:
      return 'You need to log in to access this feature';
    case 403:
      return 'You do not have permission to perform this action';
    case 404:
      return 'The requested resource was not found';
    case 429:
      return 'Too many requests - please wait a moment and try again';
    case 500:
      return 'Server error - our team has been notified';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable - please try again later';
    default:
      return 'Something went wrong - please try again';
  }
};