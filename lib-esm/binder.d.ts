import { OAuthToken } from "./handler/TokenHandler";
import User from "./models/User";
export interface VerifyRespondResponse {
    authorization_code: string;
    challenge_id: string;
    state: string;
    client_json: any;
}
export interface RefreshTokenRequest {
    grant_type: string;
    refresh_token?: string;
}
export interface ResponseData extends Response {
    data?: any;
}
export interface WebAuthnRegistrationText {
    title: string;
    subtitle: string;
    button: string;
    buttonSkip: string;
    theme: string;
}
export declare type OnBeginHandler = (payload: OnBeginPayload) => Promise<string | null> | (string | void);
export interface WebAuthnLoginText {
    title: string;
    subtitle: string;
    button: string;
    buttonSkip: string;
    theme: string;
    waiting: string;
}
export interface Config {
    ApiKeyID: string;
    Type: string;
    ContainerID?: string;
    OnSuccess?: (payload: VerifySuccess) => void;
    IdentifierField?: string;
    CotterBaseURL?: string;
    CountryCode?: string[];
    AdditionalFields?: Object[];
    Domain?: string;
    ButtonText?: string;
    ButtonTextColor?: string;
    ErrorColor?: string;
    ButtonBorderColor?: string;
    ButtonWAText?: string;
    ButtonBackgroundColor?: string;
    ButtonWATextSubtitle?: string;
    ButtonWABackgroundColor?: string;
    ButtonWABorderColor?: string;
    ButtonWATextColor?: string;
    ButtonWALogoColor?: string;
    PhoneChannels?: string[];
    IdentifierFieldInitialValue?: string;
    IdentifierFieldDisabled?: string;
    SkipIdentifierForm?: string;
    SkipIdentifierFormWithValue?: string;
    RedirectURL?: string;
    SkipRedirectURL?: boolean;
    CaptchaRequired?: boolean;
    Styles?: Styles;
    OnError?: (error: any) => void;
    OnBegin?: OnBeginHandler;
    CotterUserID?: String;
    AuthRequestText?: Object;
    AuthenticationMethod?: String;
    TermsOfServiceLink?: String;
    PrivacyPolicyLink?: String;
    WebAuthnEnabled?: boolean;
    RegistrationText?: WebAuthnRegistrationText;
    LoginText?: WebAuthnLoginText;
    OriginalResponse?: any;
    ErrorDisplay?: string;
    CotterBackendURL?: string;
    AlternativeMethod?: string;
    Identifier?: string;
    RegisterWebAuthn?: boolean;
    IdentifierType?: string;
    AuthenticationMethodName?: string;
    SocialConnectText?: SocialLoginConnectText;
    SocialLoginProviders?: string[];
}
export interface OnBeginPayload {
    auth_required: boolean;
    device_name: string;
    device_type: "BROWSER";
    identifier: string;
    identifier_type: "EMAIL" | "PHONE";
}
export interface VerifySuccess {
    email?: String;
    phone?: String;
    oauth_token: OAuthToken;
    user: User;
    identifier?: String;
    status?: String;
}
export interface Styles {
    form_container: any;
    loadingImg: any;
    input_label: any;
    verification_label: any;
    pin_row: any;
    pin_input: any;
    verification_subtitle: any;
    error: any;
    input_row_container: any;
    input_row: any;
    input_text_container_default: any;
    input_text: any;
    input_text_container: any;
    country_code: any;
    country_code_blank: any;
    input_text_p: any;
    check_input: any;
}
export interface SocialLoginConnectText {
    title: string;
    subtitle: string;
    button: string;
    buttonSkip: string;
    theme: string;
}
export declare type SocialLoginProviders = "GITHUB";
