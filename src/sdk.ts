export interface sdkConfig {
    serverUrl: string, // your Casdoor URL, like the official one: https://door.casbin.com
    clientId: string, // your Casdoor OAuth Client ID
    appName: string, // your Casdoor application name, like: "app-built-in"
    organizationName: string // your Casdoor organization name, like: "built-in"
}

// reference: https://github.com/casdoor/casdoor-go-sdk/blob/90fcd5646ec63d733472c5e7ce526f3447f99f1f/auth/jwt.go#L19-L32
export interface accountSession {
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

    public getSignupUrl() {
        return `${this.config.serverUrl.trim()}/signup/${this.config.appName}`;
    }

    public getSigninUrl(redirectUri: string = `${window.location.origin}/callback`): string {
        const scope = "read";
        const state = this.config.appName;
        return `${this.config.serverUrl.trim()}/login/oauth/authorize?client_id=${this.config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    }

    public getUserProfileUrl(userName: string, account: accountSession) {
        let param = "";
        if (account !== undefined && account !== null) {
            param = `?access_token=${account.accessToken}`;
        }
        return `${this.config.serverUrl.trim()}/users/${this.config.organizationName}/${userName}${param}`;
    }

    public getMyProfileUrl(account: accountSession) {
        let param = "";
        if (account !== undefined && account !== null) {
            param = `?access_token=${account.accessToken}`;
        }
        return `${this.config.serverUrl.trim()}/account${param}`;
    }
}

export default Sdk;
