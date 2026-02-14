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

    it('generates unique cryptographic states', () => {
        const sdk = new Sdk(sdkConfig);
        
        // Clear session storage to force new state generation
        sessionStorage.clear();
        const url1 = sdk.getSigninUrl();
        const state1 = sessionStorage.getItem('casdoor-state');
        
        // Clear and generate another state
        sessionStorage.clear();
        const url2 = sdk.getSigninUrl();
        const state2 = sessionStorage.getItem('casdoor-state');
        
        // States should be different
        expect(state1).not.toEqual(state2);
        
        // State should be a valid hex string (32 characters for 16 bytes)
        expect(state1).toMatch(/^[0-9a-f]{32}$/);
        expect(state2).toMatch(/^[0-9a-f]{32}$/);
    });
});

describe('parseAccessToken', () => {
    it('should correctly parse JWT token', () => {
        const sdk = new Sdk(sdkConfig);

        const accessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlcnQtYnVpbHQtaW4iLCJ0eXAiOiJKV1QifQ.eyJvd25lciI6ImNhc2JpbiIsIm5hbWUiOiJhZG1pbiIsImNyZWF0ZWRUaW1lIjoiMjAyMC0wNy0xNlQyMTo0Njo1MiswODowMCIsInVwZGF0ZWRUaW1lIjoiMjAyNC0wMi0yMFQxMzo1MzoyNSswODowMCIsImRlbGV0ZWRUaW1lIjoiIiwiaWQiOiI5ZWIyMGY3OS0zYmI1LTRlNzQtOTlhYy0zOWUzYjlhMTcxZTgiLCJ0eXBlIjoibm9ybWFsLXVzZXIiLCJwYXNzd29yZCI6IiIsInBhc3N3b3JkU2FsdCI6IiIsInBhc3N3b3JkVHlwZSI6InBsYWluIiwiZGlzcGxheU5hbWUiOiJIZXJtYW5uIiwiZmlyc3ROYW1lIjoiIiwibGFzdE5hbWUiOiIiLCJhdmF0YXIiOiJodHRwczovL2Nkbi5jYXNiaW4uY29tL2Nhc2Rvb3IvYXZhdGFyL2Nhc2Jpbi9hZG1pbi5wbmc_dD0xNjk0MjU3ODU5ODUwOTAwMjAwIiwiYXZhdGFyVHlwZSI6IiIsInBlcm1hbmVudEF2YXRhciI6Imh0dHBzOi8vY2RuLmNhc2Jpbi5jb20vY2FzZG9vci9hdmF0YXIvY2FzYmluL2FkbWluLnBuZyIsImVtYWlsIjoiYWRtaW5AY2FzYmluLm9yZyIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJwaG9uZSI6IiIsImNvdW50cnlDb2RlIjoiIiwicmVnaW9uIjoiVVMiLCJsb2NhdGlvbiI6IlNKQyIsImFkZHJlc3MiOltdLCJhZmZpbGlhdGlvbiI6IiIsInRpdGxlIjoiIiwiaWRDYXJkVHlwZSI6IiIsImlkQ2FyZCI6IiIsImhvbWVwYWdlIjoiIiwiYmlvIjoi5b-D54y_5LiN5a6a77yM5oSP6ams5Zub6amw77yM57qi5YyFIiwibGFuZ3VhZ2UiOiIiLCJnZW5kZXIiOiIiLCJiaXJ0aGRheSI6IiIsImVkdWNhdGlvbiI6IiIsInNjb3JlIjo5ODgyLCJrYXJtYSI6MTYwLCJyYW5raW5nIjoxMCwiaXNEZWZhdWx0QXZhdGFyIjpmYWxzZSwiaXNPbmxpbmUiOnRydWUsImlzQWRtaW4iOnRydWUsImlzRm9yYmlkZGVuIjpmYWxzZSwiaXNEZWxldGVkIjpmYWxzZSwic2lnbnVwQXBwbGljYXRpb24iOiJhcHAtY2Fzbm9kZSIsImhhc2giOiIiLCJwcmVIYXNoIjoiIiwiYWNjZXNzS2V5IjoiIiwiYWNjZXNzU2VjcmV0IjoiIiwiZ2l0aHViIjoiIiwiZ29vZ2xlIjoiIiwicXEiOiIiLCJ3ZWNoYXQiOiJveFc5TzFSMXdHbS1uZU9OcDNOU1JXM0ppVm5RIiwiZmFjZWJvb2siOiIiLCJkaW5ndGFsayI6IiIsIndlaWJvIjoiIiwiZ2l0ZWUiOiIiLCJsaW5rZWRpbiI6IiIsIndlY29tIjoiIiwibGFyayI6IiIsImdpdGxhYiI6IiIsImNyZWF0ZWRJcCI6IiIsImxhc3RTaWduaW5UaW1lIjoiIiwibGFzdFNpZ25pbklwIjoiIiwicHJlZmVycmVkTWZhVHlwZSI6IiIsInJlY292ZXJ5Q29kZXMiOm51bGwsInRvdHBTZWNyZXQiOiIiLCJtZmFQaG9uZUVuYWJsZWQiOmZhbHNlLCJtZmFFbWFpbEVuYWJsZWQiOmZhbHNlLCJsZGFwIjoiIiwicHJvcGVydGllcyI6eyJiaW8iOiIiLCJjaGVja2luRGF0ZSI6IjIwMjQwMjAzIiwiZWRpdG9yVHlwZSI6InJpY2h0ZXh0IiwiZW1haWxWZXJpZmllZFRpbWUiOiIyMDIwLTA3LTE2VDIxOjQ2OjUyKzA4OjAwIiwiZmlsZVF1b3RhIjoiNTAiLCJsYXN0QWN0aW9uRGF0ZSI6IjIwMjQtMDItMjBUMTM6NTM6MjUrMDg6MDAiLCJsb2NhdGlvbiI6IiIsIm5vIjoiMjIiLCJvYXV0aF9RUV9kaXNwbGF5TmFtZSI6IiIsIm9hdXRoX1FRX3ZlcmlmaWVkVGltZSI6IiIsIm9hdXRoX1dlQ2hhdF9hdmF0YXJVcmwiOiJodHRwczovL3RoaXJkd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL1EwajRUd0dUZlRJUXowTWljanY3dzd4ZXUyVW5XMWRoZ0xPUHZaYkxJSmlieExLVTU2WURMcDQ3eVZROVl6dUVqMW5tYWRjYkprTnB3eWliNVd6MWZRTkp3LzEzMiIsIm9hdXRoX1dlQ2hhdF9kaXNwbGF5TmFtZSI6ImNhcm1lbiIsIm9hdXRoX1dlQ2hhdF9pZCI6Im94VzlPMVIxd0dtLW5lT05wM05TUlczSmlWblEiLCJvYXV0aF9XZUNoYXRfdXNlcm5hbWUiOiJjYXJtZW4iLCJvbmxpbmVTdGF0dXMiOiJmYWxzZSIsInBob25lVmVyaWZpZWRUaW1lIjoiIiwicmVuYW1lUXVvdGEiOiIzIiwidGFnbGluZSI6IiIsIndlYnNpdGUiOiIifSwicm9sZXMiOltdLCJwZXJtaXNzaW9ucyI6W3sib3duZXIiOiJjYXNiaW4iLCJuYW1lIjoicGVybWlzc2lvbi1jYXNpYmFzZS1hZG1pbiIsImNyZWF0ZWRUaW1lIjoiMjAyMy0wNi0yM1QwMToxNTowOSswODowMCIsImRpc3BsYXlOYW1lIjoiQ2FzaWJhc2UgQWRtaW4gUGVybWlzc2lvbiIsImRlc2NyaXB0aW9uIjoiIiwidXNlcnMiOm51bGwsImdyb3VwcyI6W10sInJvbGVzIjpbXSwiZG9tYWlucyI6WyJkZWZhdWx0Il0sIm1vZGVsIjoiRGVmYXVsdCIsImFkYXB0ZXIiOiIiLCJyZXNvdXJjZVR5cGUiOiJUcmVlTm9kZSIsInJlc291cmNlcyI6WyIvIl0sImFjdGlvbnMiOlsiQWRtaW4iXSwiZWZmZWN0IjoiQWxsb3ciLCJpc0VuYWJsZWQiOnRydWUsInN1Ym1pdHRlciI6ImFkbWluIiwiYXBwcm92ZXIiOiJhZG1pbiIsImFwcHJvdmVUaW1lIjoiMjAyMy0wNi0yM1QwMToxNTowOSswODowMCIsInN0YXRlIjoiQXBwcm92ZWQifV0sImdyb3VwcyI6W10sImxhc3RTaWduaW5Xcm9uZ1RpbWUiOiIyMDIzLTA4LTA4VDE4OjExOjA4WiIsInNpZ25pbldyb25nVGltZXMiOjAsInRva2VuVHlwZSI6ImFjY2Vzcy10b2tlbiIsInRhZyI6Ium5hem5hem5he-8jOabsumhueWQkeWkqeatjCIsInNjb3BlIjoicmVhZCIsImlzcyI6Imh0dHBzOi8vZG9vci5jYXNkb29yLmNvbSIsInN1YiI6IjllYjIwZjc5LTNiYjUtNGU3NC05OWFjLTM5ZTNiOWExNzFlOCIsImF1ZCI6WyIwYmE1MjgxMjFlYTg3YjNlYjU0ZCJdLCJleHAiOjE3MDkwMjk2OTcsIm5iZiI6MTcwODQyNDg5NywiaWF0IjoxNzA4NDI0ODk3LCJqdGkiOiJhZG1pbi9kZmUzM2Y0Ny04NGRjLTQxZjktOWE4OC03ZTU0ZWEzZTY5MjEifQ.f4l-lys7e34QEih4tJR0v5JpbIg1I8ljFoOnDnTe141UJ_ux9k2WqqCCw5g3EqwHLpiSgf_Q3ut7hgL-Ga911fLzJhSWDxx5nLfoKlQUaEu8mtz8MdleVCCytxAMxzJkeXcA7ng_QcXIFfKTRp6v5nUo8bVCp8nFfP9DJUD4irhaEwZqzJ6Y6xZRkn1YZht0j2ey39trn3cjWozKvNQNc-nSEik0UlPUO-VnQi8GnEy19C8rT6YltbboOYbmk7x57vOwecDhfUYoNdlseB3Ac3TXAHGVeCLyZWnLzU8JHNClzqqI-pUXKfQ5OGTkEBG8J2CKuzTG9cgHyAk5pA-B8Ea38rP5CNiUCbsaLR5o8bs0krJ9UJx-b52W4n8pSJmUUiE4qDCe_piesLERrTnQszFT_pG6aF_o5w0UN5Mr0houkDsqwj2sNa4oTtvkz1JuYGn1fqQ89jvPp9bGemyuI-N_gCjRecn7TKW-_1MrOYExboGCUsftY8K42PYtrpXY3hCLWx2IamMrU8fSbAqkBZym02EHEKoroCw269ejtL93ZhC6-eyljLl_Fb5NjF9infGxCRjaFco5M6k_ELKwnA5V65-OmTpT6Ti3ws6zhfs27ClZbFdtUB-HcYSMGNrqZbFdmH7ne1sKinwFsH51JAKSCCXyJOZsHMQ-RmugOAA';
        const result = sdk.parseAccessToken(accessToken);

        expect(result.header.alg).toEqual("RS256");
        expect(result.header.kid).toEqual("cert-built-in");
        expect(result.header.typ).toEqual("JWT");
        expect(result.payload.owner).toEqual("casbin");
        expect(result.payload.name).toEqual("admin");
    });
});
