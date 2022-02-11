# casdoor-js-sdk

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/6f2ad052-7fc8-42e1-b40f-0ca2648530c2)](https://codebeat.co/projects/github-com-casdoor-casdoor-js-sdk-master)
[![GitHub Actions](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/release.yml)
[![GitHub Actions](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/build.yml/badge.svg)](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/casdoor/casdoor-js-sdk/badge.svg?branch=master)](https://coveralls.io/github/casdoor/casdoor-js-sdk?branch=master)
[![Release](https://img.shields.io/github/release/casdoor/casdoor-js-sdk.svg)](https://github.com/casdoor/casdoor-js-sdk/releases/latest)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/casdoor)

[npm-image]: https://img.shields.io/npm/v/casdoor-js-sdk.svg?style=flat-square

[npm-url]: https://npmjs.com/package/casdoor-js-sdk

[download-image]: https://img.shields.io/npm/dm/casdoor-js-sdk.svg?style=flat-square

[download-url]: https://npmjs.com/package/casdoor-js-sdk
This is Casdoor's SDK for js will allow you to easily connect your application to the Casdoor authentication system
without having to implement it from scratch.

Casdoor SDK is very simple to use. We will show you the steps below.

> Noted that this sdk has been applied to casnode, if you still don’t know how to use it after reading README.md, you can refer to it

## Installation

~~~shell script
# NPM
npm i casdoor-js-sdk

# Yarn
yarn add casdoor-js-sdk
~~~

## Init SDK

Initialization requires 5 parameters, which are all string type:

| Name (in order)  | Must | Description                                         |
| ---------------- | ---- | --------------------------------------------------- |
| serverUrl  | Yes  | your Casdoor server URL               |
| clientId         | Yes  | the Client ID of your Casdoor application                        |
| appName           | Yes  | the name of your Casdoor application |
| organizationName     | Yes  | the name of the Casdoor organization connected with your Casdoor application                    |
| redirectPath     | No  | the path of the redirect URL for your Casdoor application, will be `/callback` if not provided              |

```typescript
import {SDK, SdkConfig} from 'casdoor-nodejs-sdk'

const sdkConfig: SdkConfig = {
    serverUrl: "https://door.casbin.com",
    clientId: "014ae4bd048734ca2dea",
    appName: "app-casnode",
    organizationName: "casbin",
    redirectPath: "/callback",
}
const sdk = new SDK(sdkConfig)
// call sdk to handle
```
