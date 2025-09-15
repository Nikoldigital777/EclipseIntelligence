interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    role: string;
  };
  message: string;
}

export class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'auth_user';
  private static TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private static refreshPromise: Promise<string> | null = null;

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setAuth(token: string, user: any): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Set expiry time (2 hours from now minus 5 minutes buffer)
    const expiryTime = Date.now() + (2 * 60 * 60 * 1000) - (5 * 60 * 1000);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.refreshPromise = null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  static isTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;

    const expiry = parseInt(expiryStr);
    return Date.now() > expiry;
  }

  static async getValidToken(): Promise<string | null> {
    const currentToken = this.getToken();

    if (!currentToken) {
      return null;
    }

    // If token is not expired, return it
    if (!this.isTokenExpired()) {
      return currentToken;
    }

    // If already refreshing, wait for that promise
    if (this.refreshPromise) {
      try {
        return await this.refreshPromise;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearAuth();
        return null;
      }
    }

    // Start refresh process
    this.refreshPromise = this.refreshToken();

    try {
      const newToken = await this.refreshPromise;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.refreshPromise = null;
      this.clearAuth();
      return null;
    }
  }

  private static async refreshToken(): Promise<string> {
    const currentToken = this.getToken();
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const user = this.getUser();

    if (data.token && user) {
      this.setAuth(data.token, user);
      return data.token;
    }

    throw new Error('Invalid refresh response');
  }

  static async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getValidToken();

    if (!token) {
      // Redirect to login if no valid token
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If we get a 401/403, try refreshing token once more
    if ((response.status === 401 || response.status === 403) && !options.headers?.['X-Retry-Auth']) {
      console.log('Auth failed, attempting token refresh...');

      const newToken = await this.getValidToken();
      if (newToken) {
        return fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            'X-Retry-Auth': 'true',
            ...options.headers
          }
        });
      }
    }

    return response;
  }
}

// Axios-like API client with auth headers
export const apiClient = {
  get: async (url: string) => {
    const response = await AuthService.makeAuthenticatedRequest(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  post: async (url: string, data: any) => {
    const response = await AuthService.makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  put: async (url: string, data: any) => {
    const response = await AuthService.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (url: string) => {
    const response = await AuthService.makeAuthenticatedRequest(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};