import { CotterAccessToken, CotterIDToken } from "cotter-token-js";
export interface OAuthToken {
    access_token: string;
    id_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    auth_method: string;
}
declare class TokenHandler {
    accessToken: string | undefined;
    idToken: string | undefined;
    tokenType: string | undefined;
    apiKeyID: string | undefined;
    withApiKeyID(apiKeyID: string): this;
    storeTokens(oauthTokens: OAuthToken): void;
    getAccessToken(): Promise<CotterAccessToken | null>;
    getIDToken(): Promise<CotterIDToken | null>;
    getTokensFromRefreshToken(): Promise<OAuthToken>;
    removeTokens(): Promise<void>;
}
export default TokenHandler;
