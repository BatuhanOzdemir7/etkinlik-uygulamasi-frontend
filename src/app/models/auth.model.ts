export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
  userId?: number;
}