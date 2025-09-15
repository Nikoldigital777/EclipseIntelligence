
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
  private static REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
  private static refreshTimer: NodeJS.Timeout | null = null;

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.startTokenRefresh();
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.stopTokenRefresh();
  }

  private static startTokenRefresh(): void {
    this.stopTokenRefresh();
    this.refreshTimer = setInterval(() => {
      this.refreshToken().catch(() => {
        // If refresh fails, logout the user
        this.logout();
      });
    }, this.REFRESH_INTERVAL);
  }

  private static stopTokenRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private static async refreshToken(): Promise<void> {
    const currentToken = this.getToken();
    if (!currentToken) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  static getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  }

  static async logout(): Promise<void> {
    this.stopTokenRefresh();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } finally {
      this.removeToken();
    }
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }): Promise<AuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  }

  static initializeAuth(): void {
    if (this.isAuthenticated()) {
      this.startTokenRefresh();
    }
  }
}

// Axios-like API client with auth headers
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url, {
      headers: AuthService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AuthService.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  delete: async (url: string) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};
