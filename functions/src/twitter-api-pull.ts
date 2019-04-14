import * as functions from "firebase-functions";
import * as rp from "request-promise";
import * as moment from 'moment';
import app from './app';
import { Tweet } from "./tweet.interface";
import { toQueryString } from './utils';
import { config } from './config';

const consumerApiKeys = {
  key: config.twitter.key,
  secret: config.twitter.secret,
};

const oAuth2TokenApiUrl = "https://api.twitter.com/oauth2/token";
const searchTweetApiUrl = "https://api.twitter.com/1.1/search/tweets.json";
const clientCredentials = Buffer.from(
  `${consumerApiKeys.key}:${consumerApiKeys.secret}`
).toString("base64");

export const pullTwitterApi = functions.pubsub
  .topic("pull-twitter-api")
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
    console.log('searchConfig', JSON.stringify(searchConfig));
    const queryParams = {
      q: encodeURIComponent(searchConfig.hashtags.join(" OR ")),
      result_type: "recent"
    };

    const bearerToken = await getBearerToken();

    const tweets = await rp.get({
      uri: encodeURI(`${searchTweetApiUrl}?${toQueryString(queryParams)} filter:safe`),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`
      },
      json: true,
    });

    const saveTweets = tweets.statuses
      .filter((t: Tweet) => t.entities.media)
      .map((t: Tweet) =>
        app
          .firestore()
          .collection(searchConfig.autoApprove ? "posts" :"tweets")
          .doc(`${t.id}`)
          .set({
            id: t.id,
            text: t.text.replace(/https:\/\/t.co\/\w*$/, ""),
            photo: t.entities.media[0].media_url_https,
            name: t.user.name,
            username: t.user.screen_name,
            profilePic: t.user.profile_image_url_https,
            createdAt: t.created_at,
            approved: searchConfig.autoApprove,
            removed: false,
            timestamp: moment(t.created_at, "ddd MMM DD hh:mm:ss Z YYYY").valueOf(),
            type: 'twitter',
          })
      );
    return Promise.all(saveTweets);
  });

async function getBearerToken() {
  const response = await rp.post({
    uri: oAuth2TokenApiUrl,
    headers: {
      Authorization: `Basic ${clientCredentials}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials",
    json: true,
  });

  if (response.token_type !== "bearer") {
    throw new Error(
      `Authentication on Twitter did not return bearer token, got ${
        response.token_type
      } instead`
    );
  }
  const bearerToken = response.access_token;

  return bearerToken;
}

