import * as core from "@actions/core";
import * as fs from "fs";
import { generateAIResponse } from "./ai";

async function run() {
  try {
    const promptFile = core.getInput("prompt-file");
    const promptText = core.getInput("prompt");
    const token = core.getInput("token", { required: true });
    const model = core.getInput("model", { required: true });

    let prompt: string;
    if (promptFile) {
      if (!fs.existsSync(promptFile)) {
        throw new Error(`Prompt file not found: ${promptFile}`);
      }
      prompt = fs.readFileSync(promptFile, "utf8");
    } else if (promptText) {
      prompt = promptText;
    } else {
      throw new Error(
        "Either 'prompt' or 'prompt-file' input must be provided",
      );
    }

    // Generate AI response
    console.log(`Prompting ${model} AI model`);
    const response = await generateAIResponse(prompt, model, token);

    // Set output and log response
    core.setOutput("text", response);
    core.startGroup("AI Response");
    console.log(response);
    core.endGroup();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
