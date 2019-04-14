# Event on Air

Event-on-air is a social media wall that is primarily meant to encourage/show social media engagement during events, especially used to hype the crowd when waiting for events/talks to start. Although there are providers who already does this, they usually costly and you cannot control the update frequency if you're on the free plan.

A demo is available [here](https://event-on-air-ebc25.firebaseapp.com/)

This repository is the backend of the app that runs on Firebase Cloud Functions and some Cloud Scheduler stuff, and entirely serverless! (yay)


# Pre-requisites
1. Since the app pulls data from Twitter, you must apply for a twitter developer account [here](https://developer.twitter.com/en/apply-for-access.html) **it will take a few days to approve**
2. Since the app pulls data from Instagram, you must have a Instagram Business Account and a Facebook Page
2. Blaze plan for Firebase is required, since we wil be using Cloud Functions to communitate with external APIs.
3. Firebase account. (duh)


# Initial Setup
1. Clone the repository
2. Set up Node.js and the Firebase CLI
3. For installing Node.js and npm, Node Version Manager is recommended. Once you have Node.js and npm installed, install the Firebase CLI via npm:
```
npm install -g firebase-tools
```
2. Navigate to the repository and login to your firebase project via command line
```
firebase login
```
3. Change the Firebase project with your newly created firebase project
```
firebase use project-id
```
4. Go to your Firebase project in the console. In the Database section, click the Get Started button for Cloud Firestore.
Select **Test mode** for your Cloud Firestore Security Rules.
5. Go to `functions/setup.ts` and change the firebase configuration:
```
const app = firebase.initializeApp({
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId"
});
```
7. Deploy the functions and security rules to Firebase.
```
firebase deploy
```
8. Migrate data to firestore. Navigate to `\functions` folder then run
```
npm run setup
```
9. Check Firestore on the Firebase console to ensure that there are collections in the Firestore as well as Firestore rules.
![schema should be populated](https://res.cloudinary.com/shangyilim/image/upload/c_scale,w_707/v1555241595/schema.png)
10. In Firestore, you should see a `admins` collection. Add a new admin with your Google account with **your email as the document key**.

![adding admin to firestore](http://res.cloudinary.com/shangyilim/image/upload/c_scale,w_386/v1555234779/admin-setup.png)

11. Go to the Firebase console and enable Google authentication in Firebase Authentication.

# Twitter setup
1. Apply for a Twitter developer account. Be sure to explain clearly what you are using it for. It will take a few days to approve.
2. Go to `config.ts` to change the twitter api keys.
3. Deploy functions
```
firebase deploy --only functions
```

# Instagram Setup
You must complete the initial setup before continuing.
1. [Create an business account on Instagram and link it to your Facebook Page.](https://www.freelogoservices.com/blog/2018/02/20/how-to-set-up-an-instagram-account-for-your-business/)
2. Create a Facebook App. Get the App Id and App Secret. Remember this information.
3. Add Facebook Login product to your app.
4. Go to [API Explorer](https://developers.facebook.com/tools/explorer) and select your newly created app.
5. Add permissions to the api explorer: `instagram_basic` `manage_pages`. Click get access token. Ignore the warning.
6. Change the url in the API Explorer to `me/accounts` then click submit. Search for the pages that you have linked to Instagram. Remember the Page Id.
7. Using the Page Id, Change the url in the API Explore to `/{page-id}?fields=instagram_business_account`, then click submit. Remember the Instagram Business Account Id
3. You should be able to get the following information. Keep this information, you will need it in step 4.
- Facebook App Id
- Facebook App Secret
- Facebook Page Id
- Instagram Business Account Id
4. Go to Firestore, and update the values in `configs/fbConfig`. Update these fields:
- appId (Facebook App Id)
- appSecret (Facebook App Secret)
- managedPageId (Facebook Page Id)
- pageBusinessAccountId (Instagram Business Account Id)

# Setup Configurations
1. Go to Firestore on Firebase console, in the `configs` collection you need to configure the following:

## `configs/client`
This configures the appearance in the client side app.

| Field        | Description           | Example  |
| ------------- |-------------|-----|
| backgroundColor | background color of the app | "#039be5"|
| backgroundImageUrl | the image you want to display as app banner background | "https://cdn.something.com/image.jpg"|
| displayInterval | how long to wait in seconds before a post is shown | 30 |
| displayIntervalSize | how many posts to accumulate before displaying them | 1 |
| lanes | how many lanes to show on the screen. Use higher value for longer screens | 5 |
| subtitle | what text to show in the banner's subtitle | "event is starting soon" |
| title | the title to show in the banner | "#cat" |

## `configs/searchConfig`
This configures what is searched on Twitter/Instagram

| Field | Description | Example|
|---|---|---|
|autoApprove| if set to true, will automatically show posts on screen. If false you will need to manually approve posts in the moderate page| true|
|hashtags| hashtags to search| ["#cat"] |

### Make sure the searchConfig is setup 

# Next Step: Configure Client
You have completed the setup for the serverless part of the app. 
Now you must configure the client [here](https://github.com/shangyilim/event-on-air-client)
