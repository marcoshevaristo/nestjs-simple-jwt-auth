export interface AccessToken {
  access_token: string;
  refresh_token?: string;
}

export interface AccessTokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
