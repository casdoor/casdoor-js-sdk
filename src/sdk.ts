// Copyright 2021 The casbin Authors. All Rights Reserved.
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

export interface sdkConfig {
    serverUrl: string, // your Casdoor URL, like the official one: https://door.casbin.com
    clientId: string, // your Casdoor OAuth Client ID
    appName: string, // your Casdoor application name, like: "app-built-in"
    organizationName: string // your Casdoor organization name, like: "built-in"
}

// reference: https://github.com/casdoor/casdoor-go-sdk/blob/90fcd5646ec63d733472c5e7ce526f3447f99f1f/auth/jwt.go#L19-L32
export interface account {
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

class Sdk {
    private config: sdkConfig

    constructor(config: sdkConfig) {
        this.config = config
    }

    public getSignupUrl(enablePassword: boolean = true): string {
        if (enablePassword) {
            return `${this.config.serverUrl.trim()}/signup/${this.config.appName}`;
        } else {
            return this.getSigninUrl().replace("/login/oauth/authorize", "/signup/oauth/authorize");
        }
    }

    public getSigninUrl(): string {
        const redirectUri = `${window.location.origin}/callback`;
        const scope = "read";
        const state = this.config.appName;
        return `${this.config.serverUrl.trim()}/login/oauth/authorize?client_id=${this.config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    }

    public getUserProfileUrl(userName: string, account: account): string {
        let param = "";
        if (account !== undefined && account !== null) {
            param = `?access_token=${account.accessToken}`;
        }
        return `${this.config.serverUrl.trim()}/users/${this.config.organizationName}/${userName}${param}`;
    }

    public getMyProfileUrl(account: account): string {
        let param = "";
        if (account !== undefined && account !== null) {
            param = `?access_token=${account.accessToken}`;
        }
        return `${this.config.serverUrl.trim()}/account${param}`;
    }

    public signin(serverUrl: string): Promise<Response> {
        const params = new URLSearchParams(window.location.search);
        return fetch(`${serverUrl}/api/signin?code=${params.get("code")}&state=${params.get("state")}`, {
            method: "POST",
            credentials: "include",
        }).then(res => res.json());
    }
}

export default Sdk;
