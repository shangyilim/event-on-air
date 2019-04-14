import * as functions from "firebase-functions";
import app from "./app";


export const approveTwitterPosts = functions.firestore
  .document("tweets/{id}")
  .onUpdate(async (change, context) => {
    const tweetId = context.params.id;

    const tweet = change.after!.data()!;

    if (change.before!.data()!.approved || !tweet.approved) {
      return false;
    }

    return app
      .firestore()
      .collection("posts")
      .doc(tweetId)
      .set({
        ...tweet,
        removed: false
      });
  });


export const approveInstagramPosts = functions.firestore
.document("instagrams/{id}")
.onUpdate(async (change, context) => {
  const instagramId = context.params.id;

  const instagram = change.after!.data()!;

  if (change.before!.data()!.approved || !instagram.approved) {
    return false;
  }

  return app
    .firestore()
    .collection("posts")
    .doc(instagramId)
    .set({
      ...instagram,
      removed: false
    });
});
