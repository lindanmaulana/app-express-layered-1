import type { UserResponse } from "../models/user.model.js";

export interface AuthResponse  {
    user: UserResponse
    tokens: {
        accessToken: string
        refreshToken: string
    }
}

export interface RefreshTokenResponse {
    accessToken: string
}