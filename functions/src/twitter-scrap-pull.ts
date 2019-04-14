import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";
const puppeteer = require("puppeteer");
const app = admin.initializeApp();


exports.pullTwitter = functions
  .runWith({ memory: "1GB", timeoutSeconds: 60 })
  .pubsub.topic("pull-twitter")
  .onPublish(async message => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 600
    });

    await page.goto("https://twitter.com/hashtag/io19?src=hash&qf=off", { timeout: 60000});

    console.log("page has been loaded");
    //scroll until twitter is done lazy loading
    //  await autoScroll(page);
    const tweets = await page.evaluate(function() {
      //constant selector for the actual tweets on the screen
      const TWEET_SELECTOR = ".js-stream-tweet";

      //grab the DOM elements for the tweets
      const elements = Array.from(document.querySelectorAll(TWEET_SELECTOR));

      //create an array to return
      const ret = [] as any;

      //get the info from within the tweet DOM elements
      elements.forEach(element => {
        //object to store data
        const tweet = {} as any;

        //get picture of tweet
        const TWEET_PICTURE_SELECTOR = ".js-adaptive-photo > img";
        const pictureDom = element.querySelector(TWEET_PICTURE_SELECTOR);
        if (!pictureDom) {
          return;
        }
        tweet.photo = pictureDom.getAttribute("src");

        //get text of tweet
        const TWEET_TEXT_SELECTOR = ".tweet-text";
        tweet.text = element.querySelector(TWEET_TEXT_SELECTOR)!.textContent;

        //get avatar picture
        const TWEET_AVATAR_SELECTOR = ".avatar";
        tweet.avatar = element
          .querySelector(TWEET_AVATAR_SELECTOR)!
          .getAttribute("src");

        //get handle
        const TWEET_HANDLE_SELECTOR = ".username";
        tweet.handle = element.querySelector(
          TWEET_HANDLE_SELECTOR
        )!.textContent;

        //get timestamp
        const TWEET_TIMESTAMP_SELECTOR = ".tweet-timestamp";
        const twitterTimestamp = element
          .querySelector(TWEET_TIMESTAMP_SELECTOR)!
          .getAttribute("title");
        tweet.timeDisplay = twitterTimestamp;
        //get tweet id
        const TWEET_ID_SELECTOR = "data-tweet-id";
        tweet.id = element.getAttribute(TWEET_ID_SELECTOR);

        //add tweet data to return array
        ret.push(tweet);
      });
      return ret;
    });

    const allTweets = tweets.map((t: any) =>
      app
        .firestore()
        .collection("tweets")
        .doc(t.id)
        .set({
          ...t,
          timestamp: moment(t.twitterTimestamp, "h:mm A - D MMM YYYY").valueOf()
        })
    );
    return Promise.all(allTweets);
  });
