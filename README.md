# NTS mix

A web app for creating YouTube playlists from NTS mixes.

## Getting started

```
$ git clone git@github.com:tedigc/nts-mix.git
$ yarn
$ yarn start
```

### Enabling YouTube Data API v3

Before you actually start working with YouTube, you'll need to create a project using the Google Developer Console and obtain both an API key and an OAuth Client ID. Follow the steps below to get started.

#### Creating a project

1. Head to the [Google Developer Console](https://console.developers.google.com)
2. Create a new project
3. Ensure your project is selected, and from the menu on the left hand side of the dashboard, select "Library".
4. Search for "YouTube" and select the result "YouTube Data API v3".
5. Click "enable" to add it to your project, then return to the dashboard.

#### Obtaining an API key

1. Navigate to the "Credentials" page using the menu on the left hand side of the dashboard.
2. Click the "Create Credentials" button and select "API Key".
3. Click "Restrict Key" and give your key a sensible name, and apply any restrictions _(restrictions aren't necessary but are useful for security purposes)_
4. Save your changes and return to the "Credentials" page

#### Obtaining an OAuth2 Client ID

1. Click the "Create Credentials" button and select "OAuth client ID".
2. Click the "Configure consent screen" button and provide the necessary product name and email address. Click save.
3. Select "Web Application" as the application type, name your client ID, and apply necessary restrictions.

#### Linking credentials to code

1. Create a file `config.js` in the directory `client/src/` and populate it with the following:

```
export default {
  apiKey: '<YOUR_API_KEY_HERE>',
  clientId: '<YOUR_CLIENT_ID_HERE>'
};
```

**NOTE**: Ensure you keep your authorisation credentials out of your version control. Do not remove `config.js` or either of the `build` directories from the `.gitignore` file.

---

Author: [tedigc](https://github.com/tedigc)
