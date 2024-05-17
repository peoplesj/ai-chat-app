import { Manifest } from "deno-slack-sdk/mod.ts";
import { OriginalMsgListenerFunction } from "./functions/original_msg_listener_function.ts";
import OriginalMsgWorkflow from "./workflows/original_msg_workflow.ts";
import ThreadWorkflow from "./workflows/thread_workflow.ts";

export default Manifest({
  name: "ai-chat-app",
  description: "A conversational openAI Slack app",
  icon: "assets/robot-emoji.png",
  workflows: [OriginalMsgWorkflow, ThreadWorkflow],
  outgoingDomains: ["api.openai.com"],
  functions: [
    OriginalMsgListenerFunction,
  ],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "triggers:write",
    "reactions:read",
  ],
});
