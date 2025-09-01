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

// Logout function that calls the API
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Logout successful');
    } else {
      console.warn('Logout API call failed, but clearing local session');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local session regardless of API response
    clearSession();
    window.location.href = '/login';
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

// Auto-logout on session expiry
export const checkSessionExpiry = (): boolean => {
  if (!isSessionValid()) {
    redirectToLogin();
    return false;
  }
  return true;
};
