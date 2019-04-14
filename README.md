# Event on Air

Event-on-air is a social media wall that is primarily meant to encourage/show social media engagement during events, especially used to hype the crowd when waiting for events/talks to start. Although there are providers who already does this, they usually costly and you cannot control the update frequency if you're on the free plan.

A demo is available [here](https://event-on-air-ebc25.firebaseapp.com/)

This repository is the backend of the app that runs on Firebase Cloud Functions and some Cloud Scheduler stuff, and entirely serverless! (yay)


# Pre-requisites
1. Since the app pulls data from Twitter, you must apply for a twitter developer account [here](https://developer.twitter.com/en/apply-for-access.html)
2. Blaze plan for Firebase is required, since we wil be using Cloud Functions to communitate with external APIs.
3. Firebase account. (duh)


# Initial Set up
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
firebase use empty-proj
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
6. Go to `config.ts` to change the twitter api keys. You should have a developer account with twitter.
7. Deploy the functions and security rules to Firebase.
```
firebase deploy
```
8. Migrate data to firestore. Navigate to `\functions` folder then run
```
npm run setup
```

# Instagram Setup
You must complete the intial setup before continuing.
