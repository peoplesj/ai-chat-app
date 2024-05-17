import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerEventTypes, TriggerTypes } from "deno-slack-api/mod.ts";
import OriginalMsgWorkflow from "../workflows/original_msg_workflow.ts";

const originalMsgTrigger: Trigger<typeof OriginalMsgWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "New message trigger",
  description: "A message trigger, responds only to Jeremiah in #ai-chats",
  workflow: `#/workflows/${OriginalMsgWorkflow.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["C0736PKA9JB"], // TODO: Must set this to an internal channel
    filter: {
      version: 1,
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

export default originalMsgTrigger;
