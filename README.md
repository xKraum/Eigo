# Eigo SRS

## Setup
* Use *[Node 16](https://nodejs.org/en/blog/release/v16.16.0)*. The development is being done on *v16.13.2*.
* Run `npm install` in Eigo **root** and in **/server** directories.

## Environment variables
#### A .env file should be created in the root directory.
* REACT_APP_NODE_SERVER_URL: The IP where the NodeJS Server is running.
  * Examples: `https://api.example.com:5000` `http://192.168.1.35:5000`