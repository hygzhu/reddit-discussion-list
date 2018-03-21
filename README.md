# reddit-discussion-list

Grabs all Reddit discussion threads related to a specific manga title from /r/manga and lists them from newest to oldest

Since http fetch from localhost does not work for cross origin requests, a nodejs server has been set up to handle the request to reddit.com

Usage
```
//runs the client
cd client
yarn install
yarn start

//Runs the server that requests data
cd server
yarn install
yarn start
```
