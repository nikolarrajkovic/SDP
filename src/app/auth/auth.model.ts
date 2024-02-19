export interface AuthModel {
  email: string;
  password: string;
}

export interface LoginTokenModel {
  token: string;
  refreshToken: string;
  error: string;
}

export interface RefreshToken {
  token: string;
  refreshToken: string;
}
