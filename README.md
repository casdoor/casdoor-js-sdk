# casdoor-js-sdk

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/6f2ad052-7fc8-42e1-b40f-0ca2648530c2)](https://codebeat.co/projects/github-com-casdoor-casdoor-js-sdk-master)
[![GitHub Actions](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/release.yml/badge.svg)](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/release.yml)
[![GitHub Actions](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/build.yml/badge.svg)](https://github.com/casdoor/casdoor-js-sdk/actions/workflows/build.yml)
[![Coverage Status](https://codecov.io/gh/casdoor/casdoor-js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/casdoor/casdoor-js-sdk)
[![Release](https://img.shields.io/github/release/casdoor/casdoor-js-sdk.svg)](https://github.com/casdoor/casdoor-js-sdk/releases/latest)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/casdoor)

[npm-image]: https://img.shields.io/npm/v/casdoor-js-sdk.svg?style=flat-square

[npm-url]: https://npmjs.com/package/casdoor-js-sdk

[download-image]: https://img.shields.io/npm/dm/casdoor-js-sdk.svg?style=flat-square

[download-url]: https://npmjs.com/package/casdoor-js-sdk
This is Casdoor's SDK for js will allow you to easily connect your application to the Casdoor authentication system
without having to implement it from scratch.

Casdoor SDK is very simple to use. We will show you the steps below.

## Usage in NPM environment

### Installation

~~~shell script
# NPM
npm i casdoor-js-sdk

# Yarn
yarn add casdoor-js-sdk
~~~

### Init SDK

Initialization requires 5 parameters, which are all string type:

| Name (in order)  | Must | Description                                         |
| ---------------- | ---- | --------------------------------------------------- |
| serverUrl  | Yes  | your Casdoor server URL               |
| clientId         | Yes  | the Client ID of your Casdoor application                        |
| appName           | Yes  | the name of your Casdoor application |
| organizationName     | Yes  | the name of the Casdoor organization connected with your Casdoor application                    |
| redirectPath     | No  | the path of the redirect URL for your Casdoor application, will be `/callback` if not provided              |

```typescript
import {SDK, SdkConfig} from 'casdoor-js-sdk'

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

## Usage in vanilla Javascript

### Import and init SDK

Initialization parameters are consistent with the previous node.js section:

```html
<!--init the SDK-->
<script type="module">
  //Import from cdn(you can choose the appropriate cdn source according to your needs), or just from the local(download the casdoor-js-sdk first)
  import SDK from 'https://unpkg.com/casdoor-js-sdk@latest/lib/esm/sdk.js'
  const sdkConfig = {
    serverUrl: "https://door.casbin.com",
    clientId: "014ae4bd048734ca2dea",
    appName: "app-casnode",
    organizationName: "casbin",
    redirectPath: "/callback",
  }
  window.sdk = new SDK(sdkConfig)
</script>
```

### Call functions in SDK

```html
<script type="text/javascript">
  function gotoSignUpPage() {
    window.location.href = sdk.getSigninUrl()
  }
</script>
```

## API reference interface

#### Get sign up url

```typescript
getSignupUrl(enablePassword)
```

Return the casdoor url that navigates to the registration screen

#### Get sign in url

```typescript
getSigninUrl()
```

Return the casdoor url that navigates to the login screen

#### Get user profile page url

```typescript
getUserProfileUrl(userName, account)
```

Return the url to navigate to a specific user's casdoor personal page

#### Get my profile page url

```typescript
getMyProfileUrl(account)
```

#### Sign in

```typescript
signin(serverUrl)
```

Handle the callback url from casdoor, call the back-end api to complete the login process

## More examples

To see how to use casdoor frontend SDK with casdoor backend SDK, you can refer to examples below:

[casnode](https://github.com/casbin/casnode): casdoor-js-sdk + casdoor-go-sdk

[casdoor-python-vue-sdk-example](https://github.com/casdoor/casdoor-python-vue-sdk-example): casdoor-vue-sdk + casdoor-python-sdk



A more detailed description can be moved to:[casdoor-sdk](https://casdoor.org/docs/how-to-connect/sdk)
