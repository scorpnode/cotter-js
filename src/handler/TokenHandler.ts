import { CotterAccessToken, CotterIDToken } from "cotter-token-js";
import API from "../API";

const REFRESH_TOKEN_NAME = "rft";

const TOKEN_FETCHING_STATES = {
  initial: 1,
  fetching: 2,
  errorRetry: 3,
  errorFatal: 4,
  ready: 5,
};

export interface OAuthToken {
  access_token: string;
  id_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  auth_method: string;
}

class TokenHandler {
  accessToken: string | undefined;
  idToken: string | undefined;
  tokenType: string | undefined;
  apiKeyID: string | undefined;
  tokenFetchingState: number = TOKEN_FETCHING_STATES.initial;
  fetchTokenResp?: OAuthToken | null;

  withApiKeyID(apiKeyID: string) {
    this.apiKeyID = apiKeyID;
    return this;
  }

  storeTokens(oauthTokens: OAuthToken) {
    if (oauthTokens === null || oauthTokens === undefined) {
      throw new Error("oauthTokens are not specified (null or undefined)");
    }
    this.accessToken = oauthTokens.access_token;
    this.idToken = oauthTokens.id_token;
    this.tokenType = oauthTokens.token_type;
    if (window && window.localStorage) {
      window.localStorage.setItem(
        REFRESH_TOKEN_NAME,
        oauthTokens.refresh_token
      );
    }
    this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
  }

  async getAccessToken(): Promise<CotterAccessToken | null> {
    var accessToken = this.accessToken;

    var accessTok = null;
    if (accessToken && accessToken.length > 0) {
      accessTok = new CotterAccessToken(accessToken);
    }

    // if Access token already expired: refetch new token
    if (
      accessToken == undefined ||
      accessTok == null ||
      accessTok.getExpiration() < new Date().getTime() / 1000
    ) {
      try {
        var resp = await this.getTokensFromRefreshToken();
        accessToken = resp.access_token;
      } catch (err) {
        // No refresh token in cookie or some other error
        return null;
      }
    }
    this.accessToken = accessToken;
    return new CotterAccessToken(accessToken);
  }

  async getIDToken(): Promise<CotterIDToken | null> {
    var idToken = this.idToken;

    var idTok = null;
    if (idToken && idToken.length > 0) {
      idTok = new CotterIDToken(idToken);
    }

    // if ID token already expired: refetch new token
    if (
      idToken == undefined ||
      idTok == null ||
      idTok.getExpiration() < new Date().getTime() / 1000
    ) {
      try {
        var resp = await this.getTokensFromRefreshToken();
        idToken = resp.id_token;
      } catch (err) {
        // No refresh token in cookie or some other error
        return null;
      }
    }
    this.idToken = idToken;
    return new CotterIDToken(idToken);
  }

  // Refresh tokens only when needed.
  async getTokensFromRefreshToken(): Promise<OAuthToken> {
    return new Promise<OAuthToken>((resolve, reject) => {
      const checkTokenFetchProcess = () => {
        if (this.tokenFetchingState === TOKEN_FETCHING_STATES.initial) {
          this.getTokensFromRefreshTokenAPI();
        } else if (
          this.tokenFetchingState === TOKEN_FETCHING_STATES.ready &&
          this.fetchTokenResp
        ) {
          resolve(this.fetchTokenResp);
          return;
        } else if (
          this.tokenFetchingState === TOKEN_FETCHING_STATES.errorRetry
        ) {
          this.tokenFetchingState = TOKEN_FETCHING_STATES.initial;
          reject();
          return;
        } else if (
          this.tokenFetchingState === TOKEN_FETCHING_STATES.errorFatal
        ) {
          reject();
          return;
        }
        setTimeout(checkTokenFetchProcess, 0);
      };
      checkTokenFetchProcess();
    });
  }

  // Returns access token
  async getTokensFromRefreshTokenAPI(): Promise<void> {
    this.tokenFetchingState = TOKEN_FETCHING_STATES.fetching;
    this.fetchTokenResp = null;
    let refreshToken = null;
    if (window && window.localStorage) {
      refreshToken = window.localStorage.getItem(REFRESH_TOKEN_NAME);
    }
    try {
      if (!this.apiKeyID) {
        throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
      }
      var api = new API(this.apiKeyID);
      var resp = await api.getTokensFromRefreshToken(refreshToken);
      this.storeTokens(resp);
      this.tokenFetchingState = TOKEN_FETCHING_STATES.ready;
      this.fetchTokenResp = resp;
      return;
    } catch (err) {
      if (err.msg.includes("not valid")) {
        this.tokenFetchingState = TOKEN_FETCHING_STATES.errorFatal;
      } else {
        this.tokenFetchingState = TOKEN_FETCHING_STATES.errorRetry;
      }
      return;
    }
  }

  // Clear all access token
  async removeTokens() {
    this.accessToken = undefined;
    this.idToken = undefined;
    this.tokenType = undefined;
    if (window && window.localStorage) {
      window.localStorage.removeItem(REFRESH_TOKEN_NAME);
    }
    try {
      if (!this.apiKeyID) {
        throw "ApiKeyID is undefined, please initialize Cotter with ApiKeyID";
      }
      var api = new API(this.apiKeyID);
      await api.removeRefreshToken();
    } catch (err) {
      throw err;
    }
  }
}

export default TokenHandler;
