import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { RaceResult } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "result/select":
      selectResult(message[1], user).then((raceResult) =>
        apply((model) => ({ ...model, raceResult }))
      );
      break;
      case "result/save":
        saveResult(message[1], user)
          .then((result) =>
            apply((model) => ({ ...model, result }))
          )
          .then(() => {
            const { onSuccess } = message[1];
            if (onSuccess) onSuccess();
          })
          .catch((error: Error) => {
            const { onFailure } = message[1];
            if (onFailure) onFailure(error);
          });
        break;
    case "athlete/select":
    // put the rest of your cases here
    default:
        console.warn(`Unhandled Auth message: ${message[0]}`);
  }
}

function selectResult(
    msg: { raceId: string },
    user: Auth.User
  ) {
    return fetch(`/api/races/${msg.raceId}`, {
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) {
          return response.json();
        }
        return undefined;
      })
      .then((json: unknown) => {
        if (json) {
          console.log("Result:", json);
          return json as RaceResult;
        }
      });
}

function saveResult(
    msg: {
      raceId: string;
      athleteId: number;
      result: RaceResult;
    },
    user: Auth.User
  ) {
    return fetch(`/api/races/${msg.raceId}/individual-results/${msg.athleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...Auth.headers(user)
      },
      body: JSON.stringify(msg.result)
    })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        else
          throw new Error(
            `Failed to save result for ${msg.raceId}`
          );
      })
      .then((json: unknown) => {
        if (json) return json as RaceResult;
        return undefined;
      });
  }