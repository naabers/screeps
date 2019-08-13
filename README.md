# Screeps
### Initial setup:

1) Install the dependencies
```
sudo npm install -g gulp
npm install
```
2) create credentials.js file with gulp options. This is setup to use gulp-screeps (https://www.npmjs.com/package/gulp-screeps) which has these options:
```
email - the email of your account (Private Servers Only)
password - the password of your account (Private Servers Only)
token - the token of your account (Official Server Only) - Get from your screeps account settings
branch (optional) - the branch you wish to commit the code to
ptr (optional) - use Public Test Realm
host (optional) - the url of the host
port (optional) - the port of the host
secure (optional) - if the host is using https instead of http
```
For example the contents might look like:
```
module.exports = {
  token: "iAMaTOKEN"
};
```

### How to push your code:
1) Run the gulp command screeps
```
gulp screeps
```