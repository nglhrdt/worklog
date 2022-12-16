import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import
{DocumentData, DocumentReference, QueryDocumentSnapshot}
  from "firebase-admin/firestore";
import {setSeconds, setMilliseconds} from "date-fns";

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
    .region("europe-west1")
    .https
    .onCall(async (_, context) => {
      if (context.auth) {
        const uid = context.auth.uid;

        const snapshot = await getLastWotkTimeEntryForUser(uid);

        if (snapshot !== undefined) {
          if (snapshot.data().end) {
            functions.logger.info("create new");
            await createWorkTimeEntry(uid);
          } else {
            functions.logger.info("update");
            snapshot.ref.update({end: new Date()});
          }
        } else {
          functions.logger.info("create initial");
          await createWorkTimeEntry(uid);
        }
      }
    });

/**
 *
 * @param {string} userId user id to get the last entry for
 * @return {Promise<QueryDocumentSnapshot<DocumentData> | undefined>} the
 * last work time entry for the given user
 */
async function getLastWotkTimeEntryForUser(userId: string):
  Promise<QueryDocumentSnapshot<DocumentData> | undefined> {
  return db
      .collection(`users/${userId}/work-times`)
      .orderBy("start", "asc")
      .limitToLast(1)
      .get()
      .then((querySnapshot) => querySnapshot.docs[0]);
}

/**
 * get the current date without seconds
 * @return {Date} the current date with a precision of a minute
 */
function getDateWithoutSeconds(): Date {
  return setMilliseconds(setSeconds(new Date(), 0), 0);
}

/**
 * adds a new work time entry for the given user id
 * @param {string} userId the user id to create the entry for
 * @return {Promise<DocumentReference<DocumentData>>} the
 * created work time entry
 */
async function createWorkTimeEntry(userId: string)
  : Promise<DocumentReference<DocumentData>> {
  return db
      .collection(`users/${userId}/work-times`)
      .add({start: getDateWithoutSeconds(), type: "work"});
}
