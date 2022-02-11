import Sdk from '../src';

test('new sdk', () => {
    const sdkConfig = {
        serverUrl: "https://door.casbin.com",
        clientId: "014ae4bd048734ca2dea",
        appName: "app-casnode",
        organizationName: "casbin",
        redirectPath: "/callback",
    }
    const sdk = new Sdk(sdkConfig)
})
