import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { OriginalMsgListenerFunction } from "../functions/original_msg_listener_function.ts";

const OriginalMsgWorkflow = DefineWorkflow({
  callback_id: "original_msg_workflow",
  title: "Original message workflow",
  description:
    "Workflow listens for top level messages and creates responses to them",
  input_parameters: {
    properties: {
      message_ts: {
        type: Schema.types.string,
      },
      channel_id: {
        type: Schema.types.string,
      },
    },
    required: ["message_ts", "channel_id"],
  },
});

OriginalMsgWorkflow.addStep(OriginalMsgListenerFunction, {
  message_ts: OriginalMsgWorkflow.inputs.message_ts,
  channel_id: OriginalMsgWorkflow.inputs.channel_id,
});

export default OriginalMsgWorkflow;
