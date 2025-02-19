# NodeJs/Typescript API Boilerplate
### For Enterprise

## Running the app

> **NOTE**: These instructions require [MongoDB](https://docs.mongodb.com/manual/installation/) and [Node.js](https://nodejs.org/en/download/) to be installed on your environment.

### Clone the Repository:

```sh
git clone https://github.com/ofuochi/node-typescript-boilerplate.git
cd node-typescript-boilerplate
```

### Create Your Branch

```sh
git checkout -b <INSERT-BRANCH-NAME>
```

### Install Dependencies:

```sh
npm install
```

### Copy Files
#### Sample `env` File into a `.env` File:

```sh
cp env.sample .env
```

### Run the App:

```sh
npm run start
```

### Open:

```sh
http://localhost:3000/api/v1/tenants
```

### Run Tests:

```sh
npm run test
```

## REST Services

The application exposes a few REST endpoints which requires you to pass `x-tenant-id` header. First call the tenant endpoint `/api/v1/tenant` to get all the available tenants. Use any of the tenant IDs as the value for `x-tenant-id`

-   `HTTP` `GET` `/api/v1/tenats`
-   `HTTP` `GET` `/api/v1/tenats/:query`
-   `HTTP` `GET` `/api/v1/secured` (Requires a valid `x-auth-token` header)

You can use the following code snippet to call the secured endpoint:

```js
fetch("http://localhost:3000/api/v1/secure", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "x-tenant-id": "TENANT_ID",
        "x-auth-token": "SOME_VALID_CREDENTIAL"
    }
})
    .then(r => {
        if (r.status === 200) {
            r.json().then(j => console.log(j));
        } else {
            console.log("ERROR", r.status);
        }
    })
    .catch(e => console.log(e));
```

You can use the following code snippet to call the secured endpoint with an invalid `x-auth-token` header:

```js
fetch("http://localhost:3000/api/v1/secure", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "x-tenant-id": "TENANT_ID",
        "x-auth-token": "SOME_WRONG_CREDENTIAL"
    }
})
    .then(r => {
        if (r.status === 200) {
            r.json().then(j => console.log(j));
        } else {
            console.log("ERROR", r.status);
        }
    })
    .catch(e => console.log(e));
```
