import Sdk from '../src';

const sdkConfig = {
    serverUrl: 'https://door.casbin.com',
    clientId: '014ae4bd048734ca2dea',
    appName: 'app-casnode',
    organizationName: 'casbin',
    redirectPath: '/callback',
};

describe('sdk constructor', () => {
    it('with full configs', () => {
        const sdk = new Sdk(sdkConfig);

        const instanceConfig = sdk['config'];
        expect(instanceConfig.serverUrl).toEqual(sdkConfig.serverUrl);
        expect(instanceConfig.clientId).toEqual(sdkConfig.clientId);
        expect(instanceConfig.appName).toEqual(sdkConfig.appName);
        expect(instanceConfig.organizationName).toEqual(sdkConfig.organizationName);
        expect(instanceConfig.redirectPath).toEqual(sdkConfig.redirectPath);
    });

    it('config withou redirectPath', () => {
        let config = {
            ...sdkConfig,
            redirectPath: undefined,
        };
        const sdk = new Sdk(sdkConfig);

        const instanceConfig = sdk['config'];
        expect(instanceConfig.redirectPath).toEqual('/callback');
    });
});

describe('getSigninUrl', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('redirectPath with relative path', () => {
        const sdk = new Sdk(sdkConfig);

        expect(sdk.getSigninUrl()).toContain(
            `redirect_uri=${encodeURIComponent(
                window.location.origin + sdkConfig.redirectPath
            )}`
        );
    });

    it('redirectPath with fully path', () => {
        const config = {
            ...sdkConfig,
            redirectPath: 'http://localhost:6001/other-callback',
        };
        const sdk = new Sdk(config);

        expect(sdk.getSigninUrl()).toContain(
            `redirect_uri=${encodeURIComponent(config.redirectPath)}`
        );
    });

    it('with fixed state', () => {
        const state = 'test-state';
        const sdk = new Sdk(sdkConfig);
        sessionStorage.setItem('casdoor-state', state);
        expect(sdk.getSigninUrl()).toContain(`state=${state}`);
    });

    it('with random state', () => {
        const sdk = new Sdk(sdkConfig);
        const url = sdk.getSigninUrl();
        const state = sessionStorage.getItem('casdoor-state');
        expect(url).toContain(`state=${state}`);
    });
});
