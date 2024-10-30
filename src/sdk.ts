// Copyright 2021 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import PKCE from 'js-pkce';
import ITokenResponse from "js-pkce/dist/ITokenResponse";
import IObject from "js-pkce/dist/IObject";
import {jwtDecode, JwtHeader} from "jwt-decode";

export interface SdkConfig {
    serverUrl: string, // your Casdoor server URL, e.g., "https://door.casbin.com" for the official demo site
    clientId: string, // the Client ID of your Casdoor application, e.g., "014ae4bd048734ca2dea"
    appName: string, // the name of your Casdoor application, e.g., "app-casnode"
    organizationName: string // the name of the Casdoor organization connected with your Casdoor application, e.g., "casbin"
    redirectPath?: string // the path of the redirect URL for your Casdoor application, will be "/callback" if not provided
    signinPath?: string // the path of the signin URL for your Casdoor applcation, will be "/api/signin" if not provided
    scope?: string // apply for permission to obtain the user information, will be "profile" if not provided
    storage?: Storage // the storage to store the state, will be sessionStorage if not provided
}

// reference: https://github.com/casdoor/casdoor-go-sdk/blob/90fcd5646ec63d733472c5e7ce526f3447f99f1f/auth/jwt.go#L19-L32
export interface Account {
    organization: string,
    username: string,
    type: string,
    name: string,
    avatar: string,
    email: string,
    phone: string,
    affiliation: string,
    tag: string,
    language: string,
    score: number,
    isAdmin: boolean,
    accessToken: string
}

export interface Role {
    owner: string,
    name: string,
    createdTime: string,
    displayName: string,
    description: string,
    roles: string[],
    domains: string[]
    isEnabled: boolean
}

export interface JwtPayload {
    owner: string;
    name: string;
    createdTime: string;
    updatedTime: string;
    deletedTime: string;
    id: string;
    type: string;
    password: string;
    passwordSalt: string;
    passwordType: string;
    displayName: string;
    firstName: string;
    lastName: string;
    avatar: string;
    avatarType: string;
    permanentAvatar: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    countryCode: string;
    region: string;
    location: string;
    address: string[];
    affiliation: string;
    title: string;
    idCardType: string;
    idCard: string;
    homepage: string;
    bio: string;
    language: string;
    gender: string;
    birthday: string;
    education: string;
    score: number;
    karma: number;
    ranking: number;
    isDefaultAvatar: boolean;
    isOnline: boolean;
    isAdmin: boolean;
    isForbidden: boolean;
    isDeleted: boolean;
    signupApplication: string;
    hash: string;
    preHash: string;
    accessKey: string;
    accessSecret: string;
    github: string;
    google: string;
    qq: string;
    wechat: string;
    facebook: string;
    dingtalk: string;
    weibo: string;
    gitee: string;
    linkedin: string;
    wecom: string;
    lark: string;
    gitlab: string;
    createdIp: string;
    lastSigninTime: string;
    lastSigninIp: string;
    preferredMfaType: string;
    recoveryCodes: null | string[];
    totpSecret: string;
    mfaPhoneEnabled: boolean;
    mfaEmailEnabled: boolean;
    ldap: string;
    properties: Record<string, unknown>;
    roles: Role[];
    permissions: Permission[];
    groups: string[];
    lastSigninWrongTime: string;
    signinWrongTimes: number;
    tokenType: string;
    tag: string;
    scope: string;
    iss: string;
    sub: string;
    aud: string[];
    exp: number;
    nbf: number;
    iat: number;
    jti: string;
}

export interface Permission {
    owner: string;
    name: string;
    createdTime: string;
    displayName: string;
    description: string;
    users: string[] | null;
    groups: string[];
    roles: string[];
    domains: string[];
    model: string;
    adapter: string;
    resourceType: string;
    resources: string[];
    actions: string[];
    effect: string;
    isEnabled: boolean;
    submitter: string;
    approver: string;
    approveTime: string;
    state: string;
}

class Sdk {
    private config: SdkConfig
    private pkce: PKCE

    constructor(config: SdkConfig) {
        this.config = config
        if (config.redirectPath === undefined || config.redirectPath === null) {
            this.config.redirectPath = "/callback";
        }

        if (config.scope === undefined || config.scope === null) {
            this.config.scope = "profile";
        }

        this.pkce = new PKCE({
            client_id: this.config.clientId,
            redirect_uri: `${window.location.origin}${this.config.redirectPath}`,
            authorization_endpoint: `${this.config.serverUrl.trim()}/login/oauth/authorize`,
            token_endpoint: `${this.config.serverUrl.trim()}/api/login/oauth/access_token`,
            requested_scopes: this.config.scope || "profile",
            storage: this.config.storage,
        });
    }

    getOrSaveState(): string {
        const state = sessionStorage.getItem("casdoor-state");
        if (state !== null) {
            return state;
        } else {
            const state = Math.random().toString(36).slice(2);
            sessionStorage.setItem("casdoor-state", state);
            return state;
        }
    }

    clearState() {
        sessionStorage.removeItem("casdoor-state");
    }

    public getSignupUrl(enablePassword: boolean = true): string {
        if (enablePassword) {
            sessionStorage.setItem("signinUrl", this.getSigninUrl());
            return `${this.config.serverUrl.trim()}/signup/${this.config.appName}`;
        } else {
            return this.getSigninUrl().replace("/login/oauth/authorize", "/signup/oauth/authorize");
        }
    }

    public getSigninUrl(): string {
        const redirectUri = this.config.redirectPath && this.config.redirectPath.includes('://') ? this.config.redirectPath : `${window.location.origin}${this.config.redirectPath}`;
        const state = this.getOrSaveState();
        return `${this.config.serverUrl.trim()}/login/oauth/authorize?client_id=${this.config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${this.config.scope}&state=${state}`;
    }

    public getUserProfileUrl(userName: string, account: Account): string {
        let param = "";
        if (account !== undefined && account !== null) {
            param = `?access_token=${account.accessToken}`;
        }
        return `${this.config.serverUrl.trim()}/users/${this.config.organizationName}/${userName}${param}`;
    }

    public getMyProfileUrl(account: Account, returnUrl: String = ""): string {
        let params = "";
        if (account !== undefined && account !== null) {
            params = `?access_token=${account.accessToken}`;
            if (returnUrl !== "") {
                params += `&returnUrl=${returnUrl}`;
            }
        } else if (returnUrl !== "") {
            params = `?returnUrl=${returnUrl}`;
        }
        return `${this.config.serverUrl.trim()}/account${params}`;
    }

    public async signin(serverUrl: string, signinPath?: string, code?: string, state?: string): Promise<Response> {
        if (!code || !state) {
            const params = new URLSearchParams(window.location.search);
            code = params.get("code")!;
            state = params.get("state")!;
        }
        const expectedState = this.getOrSaveState();
        this.clearState();
        if (state !== expectedState) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        // @ts-ignore
                        status: "error",
                        msg: `invalid state parameter, expected: ${expectedState}, got: ${state}`,
                    });
                }, 10);
            });
        }

        return fetch(`${serverUrl}${signinPath || this.config.signinPath || '/api/signin'}?code=${code}&state=${state}`, {
            method: "POST",
            credentials: "include",
        }).then(res => res.json());
    }

    public isSilentSigninRequested(): boolean {
        const params = new URLSearchParams(window.location.search);
        return params.get("silentSignin") === "1";
    }

    public silentSignin(onSuccess: (message: any) => void, onFailure: (message: any) => void) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${this.getSigninUrl()}&silentSignin=1`;

        const handleMessage = (event: MessageEvent) => {
            if (window !== window.parent) {
                return null;
            }

            const message = event.data;
            if (message.tag !== "Casdoor" || message.type !== "SilentSignin") {
                return;
            }
            if (message.data === 'success') {
                onSuccess(message);
            } else {
                onFailure(message);
            }
        };
        window.addEventListener('message', handleMessage);
        document.body.appendChild(iframe);
    }

    public async popupSignin(serverUrl: string, signinPath?: string, callback?: (info: any) => any,) {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popupWindow = window.open(this.getSigninUrl() + "&popup=1", "login", `width=${width},height=${height},top=${top},left=${left}`);

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== this.config.serverUrl) {
                return;
            }

            if (event.data.type === "windowClosed" && callback) {
                callback("login failed");
            }

            if (event.data.type === "loginSuccess") {
                this.signin(serverUrl, signinPath, event.data.data.code, event.data.data.state)
                    .then((res: any) => {
                        sessionStorage.setItem("token", res.token);
                        window.location.reload();
                    });
                popupWindow!.close();
            }
        };

        window.addEventListener("message", handleMessage);
    }

    public async signin_redirect(additionalParams?: IObject): Promise<void> {
        window.location.assign(this.pkce.authorizeUrl(additionalParams));
    }

    public async exchangeForAccessToken(additionalParams?: IObject): Promise<ITokenResponse> {
        return this.pkce.exchangeForAccessToken(window.location.href, additionalParams);
    }

    public async getUserInfo(accessToken: string): Promise<Response> {
        return fetch(`${this.config.serverUrl.trim()}/api/userinfo`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        }).then(res => res.json()
        );
    }

    public parseAccessToken(accessToken: string): { header: JwtHeader, payload: JwtPayload } {
        try {
            const parsedHeader: JwtHeader = jwtDecode<JwtHeader>(accessToken, { header: true });
            const parsedPayload: JwtPayload = jwtDecode<JwtPayload>(accessToken);
            return { header: parsedHeader, payload: parsedPayload };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public refreshAccessToken(refreshToken: string): Promise<ITokenResponse> {
        return this.pkce.refreshAccessToken(refreshToken);
    }
}

export default Sdk;
