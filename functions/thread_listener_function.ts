import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import OpenAI from "openai/mod.ts";
import { ChatCompletionMessageParam } from "openai/resources/mod.ts";

export const ThreadListenerDefinition = DefineFunction({
  callback_id: "listener_function",
  title: "listener text using AI",
  description:
    "A function that listens on a thread, pulls in the contents and uses AI to respond.",
  source_file: "functions/thread_listener_function.ts",
  input_parameters: {
    properties: {
      bot_id: {
        type: Schema.types.string,
        description: "User ID of the bot",
      },
      thread_ts: {
        type: Schema.types.string,
        description: "The thread timestamp",
      },
      channel_id: {
        type: Schema.types.string,
        description: "The channel Id",
      },
    },
    required: ["thread_ts", "channel_id", "bot_id"],
  },
});

export default SlackFunction(
  ThreadListenerDefinition,
  async ({ client, inputs, env }) => {
    // 1. Acknowledge user input and response with "thinking" message
    const thinkingResponse = await client.chat.postMessage({
      channel: inputs.channel_id,
      thread_ts: inputs.thread_ts,
      text:
        "Just a moment while I think of a response :hourglass_flowing_sand:",
    });

    if (!thinkingResponse.ok) {
      console.error("thinkingResponse.error", thinkingResponse.error);
    }

    // 2. Get message contents by pulling in all conversations in the thread
    //    and feed contents to AI model
    const conversationResponse = await client.conversations.replies({
      channel: inputs.channel_id,
      ts: inputs.thread_ts,
    });

    if (!conversationResponse.ok) {
      console.error("conversationResponse.error", conversationResponse.error);
    }

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

    const messages: ChatCompletionMessageParam[] = [
      {
        "role": "system",
        "content": `You are a helpful assistant.`,
      },
    ];

    for (let i = 1; i < conversationResponse.messages.length; i++) { // Start at 1, the first message
      const role = (conversationResponse.messages[i].user != inputs.bot_id)
        ? "user"
        : "assistant";
      messages.push({
        "role": role,
        "content": `${conversationResponse.messages[i].text}`,
      });
    }

    //TODO: Showcase the conversation between assistant and user
    console.log("completed msgs array", messages);

    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    // 3. Update "thinking" message with AI model contents
    const completionContent = chatCompletion.choices[0].message.content;

    const updateResponse = await client.chat.update({
      channel: inputs.channel_id,
      ts: thinkingResponse.ts,
      text: `${completionContent}`,
      mrkdwn: true,
    });

    if (!updateResponse.ok) {
      console.error(
        "thread listener update response error:",
        updateResponse.error,
      );
    }

    return {
      outputs: {},
    };
  },
);
