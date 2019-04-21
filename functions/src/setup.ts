
/*tslint:disable:no-import-side-effect*/
import * as firebase from "firebase/app";
import "firebase/firestore";

const app = firebase.initializeApp({
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId"
});

const eventHashtag = "#eventhashtag";

initialize().then(() => {
    console.log('created searchConfig');
    process.exit()
}).catch(error => {
    console.log('An error has occured', error);
});

async function initialize() {

    await app.firestore().collection("admins")
    .doc("your gmail address")
    .set({ email: "your gmail address"});

    await app.firestore()
        .collection("configs")
        .doc("client")
        .set({
            backgroundColor: "#039be5",
            backgroundImageUrl: "",
            displayIntervalSec: 30,
            displayIntervalSize: 1,
            lanes: 5,
            subtitle: eventHashtag,
            title: "Event title",
            startSpacewalk: false,
        });
    console.log('created clientConfig');
    await app.firestore()
        .collection("configs")
        .doc("fbConfig")
        .set({
            appId: "",
            appSecret: "",
            managedPageId: "",
            pageAccessToken: "",
            pageBusinessAccountId: "",
            userAccessToken: "",
        });

    console.log('created fbConfig');

    await app.firestore()
        .collection("configs")
        .doc("searchConfig")
        .set({
            autoApprove: true,
            hashtags: [
                eventHashtag
            ]
        });
};
