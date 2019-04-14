import * as functions from "firebase-functions";
import * as rp from "request-promise";
import { toQueryString } from "./utils";

const fbUrl = "https://graph.facebook.com/v2.10";

export const generateFbPermanentPageToken = functions.firestore
  .document("configs/fbConfig")
  .onUpdate(async (change, context) => {
    const before = change.before.data() as any;
    const after = change.after.data() as any;

    if (before.userAccessToken === after.userAccessToken) {
      console.log("skipping invocation due to unchanged accessToken");
      return;
    }

    if (!after.userAccessToken) {
      console.log("skippng invocation due to missing userAccessToken");
      return;
    }

    const queryString = toQueryString({
      grant_type: "fb_exchange_token",
      client_id: after.appId,
      client_secret: after.appSecret,
      fb_exchange_token: after.userAccessToken
    });

    const longLiveResponse = await rp.get(
      `${fbUrl}/oauth/access_token?${queryString}`,
      { json: true }
    );

    const longLiveToken = longLiveResponse.access_token;

    const managedAccounts = await rp.get(
      `${fbUrl}/me/accounts?access_token=${longLiveToken}`,
      { json: true }
    );

    const page = managedAccounts.data.find(
      (d: any) => d.id === after.managedPageId
    );

    if (!page) {
      throw new Error(
        `unable to find your managed page with pageId: ${after.managedPageId}`
      );
    }

    const pageAccessToken = page.access_token;

    const pageInfo = await rp.get(
      `${fbUrl}/${
        after.managedPageId
      }?fields=instagram_business_account&access_token=${pageAccessToken}`,
      { json: true }
    );

    const pageBusinessAccountId = pageInfo.instagram_business_account.id;

    return change.after.ref.update({
      pageAccessToken,
      pageBusinessAccountId,
    });
  });
