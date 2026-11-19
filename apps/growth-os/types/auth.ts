export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "viewer";
}

export interface AuthSession {
  user: AdminUser;
  expiresAt: number; // unix timestamp
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}
