import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

exports.createActivity = functions
    .region("europe-west1")
    .firestore
    .document("users/{userId}/activities/{activityId}")
    .onCreate(async (snap, context) => {
      const jiraIntegration = (await db.doc(`users/${context.params.userId}`)
          .get())
          .data()
          ?.integrations.jira;

      if (jiraIntegration) {
        const email = jiraIntegration.email;
        const host = jiraIntegration.host;
        const apiKey = jiraIntegration.apiKey;
        const projectKey = (jiraIntegration.projectKey as string)
            ?.toLowerCase();
        const ticket = (snap.data().ticket as string)?.toLowerCase();

        if (host && projectKey && apiKey && ticket?.startsWith(projectKey)) {
          const params: { [key: string]: string } = {"fields": "summary"};
          const url = new URL(`https://${host}/rest/api/2/issue/${ticket}`);

          Object.keys(params).forEach(
              (param) => url.searchParams.append(param, params[param])
          );

          const credentials = Buffer
              .from(`${email}:${apiKey}`, "utf-8")
              .toString("base64");
          const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${credentials}`,
          };
          const response = await fetch(url, {
            method: "get",
            headers,
          });

          const summary = (await response.json())?.fields?.summary;

          if (summary) {
            return snap.ref.set({summary}, {merge: true});
          }

          return null;
        }
      }

      return null;
    });

exports.createUserObject = functions
    .region("europe-west1")
    .auth.user()
    .onCreate((event) => {
      functions.logger.info(event);
      const doc = admin.firestore().doc(`/users/${event.uid}`);
      doc.set({integrations: {}});
      return null;
    });

exports.stamp = functions
    .https
    .onCall((data, context) => {
      if (context.auth) {
        // Authentication / user information is automatically added to the request.
        const uid = context.auth.uid;
        const name = context.auth.token.name || null;
        const picture = context.auth.token.picture || null;
        const email = context.auth.token.email || null;
        functions.logger.info(uid);
        functions.logger.info(name);
        functions.logger.info(picture);
        functions.logger.info(email);
      }
    });
