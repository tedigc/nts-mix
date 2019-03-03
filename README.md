# NTS mix (currently down for maintenance)

A web app for creating music playlists, webscraped from NTS mixes, and powered by Google's YouTube v3 API.

[NTS Radio](https://www.nts.live/) is an online radio station based in London with studios in Los Angeles, Shanghai and Manchester. Broadcasting underground music live, 24/7.

Below are some of my favourite mixes. To try them with the app, just follow the link and paste the URL into NTS mix, then hit "search".

* [DJ Koze & Róisín Murphy - London, 04.05.18](https://www.nts.live/shows/guests/episodes/dj-koze-roisin-murphy-4th-may-2018)
* [Floating Points & Four Tet - Live from Love International - Tisno, 06.08.18](https://www.nts.live/shows/love-international-2018/episodes/floating-points-four-tet-live-from-love-international-2nd-july-2018)
* [Bonobo - Los Angeles, 24.06.15](https://www.nts.live/shows/bonobo/episodes/bonobo-24thjune-2015)

---

To get started:

```
$ git clone https://github.com/tedigc/nts-mix
$ npm run setup
$ npm start
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
3. Click "Restrict Key" and give your key a sensible name, and apply any restrictions *(restrictions aren't necessary but are useful for security purposes)*
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
