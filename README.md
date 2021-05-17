# WEBXR NEST API

A REST API for the R&P WebXR application

## Built With 
- NEST.JS
- TypeScript

## Prerequisites
- [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- [Azure storage account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-create) to create storage blobs
- The lastest version of [Node.js](https://nodejs.org/en/download/) 

## Installation

1. Inside your Azure storage account
    - Navigate to Settings, select Access keys
    - Find the Connection String value under key1
    - Copy the value, later it will be added to your environment variable

2. Clone this repo
    
    ```git clone https://github.com/sara-sabr/WebXR-API.git```

3. Install the NPM packages
    
    ```npm install```

4. Create a `.env` file and add the following contents:
    ```
    # Port number
    PORT=3000

    # JWT KEY (change it)
    JWT_KEY=somesecretyouchoose

    # Account creds to API (change it)
    AUTH_USER=someuser
    AUTH_PASS=somepwd

    # Set this to true if using Azure App Service HTTPS offload
    IS_AZURE=false
    ```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Usage 
This application is created for the purpose of using API endpoints for Azure storage containers and blobs.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
"# WebXR-Nest_API" 
