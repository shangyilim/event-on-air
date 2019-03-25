import * as functions from "firebase-functions";
import * as rp from "request-promise";
import app from "./app";
import { Instagram } from "./instagram.interface";

const facebookApi = "https://graph.facebook.com";

export const pullInstagramApi = functions.pubsub
  .topic("pull-instagram-api")
  .onPublish(async message => {
    const searchConfig = await app
      .firestore()
      .collection("configs")
      .doc("searchConfig")
      .get()
      .then(snapshot => snapshot.data());

    if (!searchConfig) {
      throw new Error("configs/searchConfig not found in firestore");
    }
    console.log("searchConfig", JSON.stringify(searchConfig));
    if (!searchConfig.hashtags) {
      return;
    }
    const hashtag = searchConfig.hashtags[0].replace("#", "");

    const fbConfig = await app
      .firestore()
      .doc("configs/fbConfig")
      .get()
      .then(s => s.data());

    if (!fbConfig) {
      throw new Error("fbConfig is required");
    }

    if (!fbConfig.pageAccessToken || !fbConfig.managedPageId) {
      throw new Error("pageAccessToken and managedPageId is required");
    }

    const hashtagId = await rp
      .get(
        `${facebookApi}/ig_hashtag_search?user_id=${
          fbConfig.pageBusinessAccountId
        }&q=${hashtag}&access_token=${fbConfig.pageAccessToken}`,
        { json: true }
      )
      .then(response => response.data[0].id);

    const recentInstagramPosts = await rp.get(
      `${facebookApi}/${hashtagId}/recent_media?user_id=${
        fbConfig.pageBusinessAccountId
      }&fields=id,media_url,caption&access_token=${fbConfig.pageAccessToken}`,
      { json: true }
    );

    const instagrams = recentInstagramPosts.data
      .filter((i: Instagram) => i.media_url)
      .map((i: Instagram) =>
        app
          .firestore()
          .collection(searchConfig.autoApprove ? "posts":"instagrams")
          .doc(`${i.id}`)
          .set({
            id: i.id,
            text: i.caption,
            photo: i.media_url,
            approved: searchConfig.autoApprove,
            removed: false,
            timestamp: (new Date()).getTime(),
            type: 'instagram'
          })
      );

    return Promise.all(instagrams);
  });
