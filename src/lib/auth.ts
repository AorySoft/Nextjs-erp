export interface UserSession {
  token?: string;
  user: string;
  loginTime: string;
  full_name?: string;
  email?: string;
  sid?: string;
  session_id?: string;
  [key: string]: unknown;
}

export const AUTH_STORAGE_KEY = 'userSession';
export const TOKEN_STORAGE_KEY = 'authToken';

// Get session from storage
export const getSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check both localStorage and sessionStorage
    const sessionData = localStorage.getItem(AUTH_STORAGE_KEY) || 
                       sessionStorage.getItem(AUTH_STORAGE_KEY);
    
    if (!sessionData) return null;
    
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

// Get auth token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(TOKEN_STORAGE_KEY) || 
         sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

// Check if session is valid
export const isSessionValid = (): boolean => {
  const session = getSession();
  
  if (!session) return false;
  
  // Check if session has required user info (since ERP doesn't return token)
  if (!session.user && !session.full_name) return false;
  
  // Check if session is expired (24 hours for localStorage, session for sessionStorage)
  const loginTime = new Date(session.loginTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
  
  // If stored in localStorage, check 24-hour expiry
  if (localStorage.getItem(AUTH_STORAGE_KEY)) {
    return hoursDiff < 24;
  }
  
  // If in sessionStorage, it's valid until browser closes
  return true;
};

// Clear session data
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem('selectedEntity');
  sessionStorage.removeItem('selectedEntity');
  
  // Clear cookies for middleware
  document.cookie = 'userSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'selectedEntity=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  console.log('Session cleared');
};

// Direct API login function
export const loginUser = async (username: string, password: string): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch('https://erp.thebenchmark.com.pk/api/method/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        usr: username,
        pwd: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.message === 'Logged In') {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Direct API logout function
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('https://erp.thebenchmark.com.pk/api/method/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: 'Logout failed' };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Network error during logout' };
  }
};

// Logout function that calls the API
export const logout = async (): Promise<void> => {
  try {
    const result = await logoutUser();
    
    if (result.success) {
      console.log('Logout successful');
    } else {
      console.warn('Logout API call failed, but clearing local session');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local session regardless of API response
    clearSession();
    // Force redirect to login page
    window.location.replace('/login');
  }
};

// Redirect to login with message
export const redirectToLogin = (): void => {
  if (typeof window === 'undefined') return;
  
  clearSession();
  
  const loginUrl = '/login';
    
  window.location.href = loginUrl;
};

// Save session data
export const saveSession = (sessionData: Record<string, unknown>, rememberMe: boolean = false): void => {
  if (typeof window === 'undefined') return;
  
  const userSession: UserSession = {
    token: (sessionData.sid as string) || (sessionData.session_id as string) || (sessionData.token as string) || 'erp_session',
    user: (sessionData.user as string) || (sessionData.full_name as string) || '',
    loginTime: new Date().toISOString(),
    full_name: sessionData.full_name as string | undefined,
    email: sessionData.email as string | undefined,
    sid: sessionData.sid as string | undefined,
    session_id: sessionData.session_id as string | undefined,
    home_page: sessionData.home_page,
    ...sessionData
  };
  
  const storage = rememberMe ? localStorage : sessionStorage;
  const tokenStorage = rememberMe ? localStorage : sessionStorage;
  
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
  
  // Always save a token (use fallback if none provided)
  const tokenToSave = userSession.token || 'erp_session';
  tokenStorage.setItem(TOKEN_STORAGE_KEY, tokenToSave);
  
  // Also save to cookies for middleware access
  const cookieValue = encodeURIComponent(JSON.stringify(userSession));
  const maxAge = rememberMe ? 'max-age=86400; ' : '';
  document.cookie = `userSession=${cookieValue}; path=/; ${maxAge}SameSite=Lax`;
  
  console.log(`Session saved to ${rememberMe ? 'localStorage' : 'sessionStorage'}:`, userSession);
};

// Direct API function to fetch entities
export const fetchEntities = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const response = await fetch('https://erp.thebenchmark.com.pk/api/resource/Branch?fields=["name","branch"]', {
      method: 'GET',
      headers: {
        'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: 'Failed to fetch entities' };
    }
  } catch (error) {
    console.error('Fetch entities error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
};

// Auto-logout on session expiry
export const checkSessionExpiry = (): boolean => {
  if (!isSessionValid()) {
    redirectToLogin();
    return false;
  }
  return true;
};
