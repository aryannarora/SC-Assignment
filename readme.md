# SC Assignment

### Setup

1. Clone the project in any directory on your computer.
2. Run command `npm install` to download all the dependencies.
3. Create a `.env` file. Refer `.env.example` in this repository for details.
4. Run `npm start`.

### Scripts

  * `npm start` - To start the app
  * `npm run lint` - To run the linter
  * `npm test` - To run the tests

### Instructions for making requests

**NOTE: All invalid requests to any end point will result in an error.**

**Use POSTMAN or any other application like it.**

#### For `/login`

Given User name and password, this route will return JWT.

Make a **POST** request with `'Content-type': 'application/x-www-form-urlencoded' `.
The request body must contain username and password.
For username, use "**uid**" as the key.
For Password, use "**pwd**" as the key.

Valid succesful request will return a json object with key "**token**" containg the **JWT**.

#### For `/pathchify` (Protected Route)

Given a JSON Object and a json patch, this route will apply the patch and return the resultant object.

Make a **POST** request with `'Content-type': 'application/json'`.
The request must contain JSON object on which the patch is to be applied and the actual patch that will be applied.
For JSON object, use key "**json**".
For Patch, use key "**patch**".

Example: 
```
{
    "json" : {
        "baz": "qux",
        "foo": "bar"
    },
    "patch": [
        {"op": "replace", "path": "/baz", "value": "boo"},
        {"op": "add", "path": "/hello", "value": ["world"]},
        {"op": "remove", "path": "/foo"}
    ]
}
```

**Note: Send raw data in JSON form**

#### For `/download` (Protected Route)

Given an image url, this route will download the image to the correspondind url onto the server, resize the image to a 50 x 50 thumbnail, return the thumnail to user.

Make a **POST** request with `'Content-type': 'application/x-www-form-urlencoded' `.
Request body must contain the url of the image to downloaded.
Use key "**image**" to set the image url.
A successful request will downlaod the thumbnail on your computer.

** Note: All the downloaded files are kept inside `downloaded_images` folder. **

##### Note for Protected routes!

Protected routes requires authentication to be accessed.
For this, obtain a JWT from the `\login` with any arbitrary UserName and password and then use this token to get the authorization.
Send this token as a header to every request at any protected route.
**Header-key** : `authorization`.
The value of header should contain the word `Bearer` before the actual JWT.

Example:  "authorization": "Bearer ***your_json_web_token***" 

### Tools used

  * [**Bunyan**](https://github.com/trentm/node-bunyan) for logging.
    * Logs are saved under `logs` folder of this repo.
  * [**Mocha**](https://mochajs.org/) for testing.
  * [**Chai**](http://www.chaijs.com/) for assertion.
  * [**Babel**](https://babeljs.io/) for transpiling ES6 code.
  * [**Standard**](https://standardjs.com/) for code linting.

