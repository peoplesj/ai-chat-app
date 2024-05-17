import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import EmailWorkflow from "../workflows/email_workflow.ts";

const emailTrigger: Trigger<typeof EmailWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "New message trigger",
  description: "A message trigger, responds only to Jeremiah in #ai-chats",
  workflow: `#/workflows/${EmailWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["C0736PKA9JB"], // TODO: Must set this to an internal channel
    filter: {
      root: {
        operator: "AND",
        inputs: [{
          operator: "NOT",
          inputs: [{
            // Filter out posts by apps
            statement: "{{data.user_id}} == null",
          }],
        }, {
          // Filter out thread replies
          statement: "{{data.thread_ts}} == null",
        }],
      },
      version: 1,
    },
  },
  inputs: {
    message_ts: {
      value: "{{data.message_ts}}",
    },
    channel_id: {
      value: "{{data.channel_id}}",
    },
  },
};

export default emailTrigger;
