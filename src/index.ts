import * as core from "@actions/core";
import * as fs from "fs";
import { translateText } from "./ai";

async function run() {
  try {
    const textFile = core.getInput("text-file");
    const textContent = core.getInput("text");
    const token = core.getInput("token", { required: true });
    const model = core.getInput("model", { required: true });
    const targetLanguage = core.getInput("target-language", { required: true });

    let text: string;
    if (textFile) {
      if (!fs.existsSync(textFile)) {
        throw new Error(`Text file not found: ${textFile}`);
      }
      text = fs.readFileSync(textFile, "utf8");
    } else if (textContent) {
      text = textContent;
    } else {
      throw new Error(
        "Either 'text' or 'text-file' input must be provided",
      );
    }

    // Translate text
    console.log(`Using ${model} AI model to translate to ${targetLanguage}`);
    const translatedText = await translateText(
      text,
      targetLanguage,
      model,
      token
    );

    // Set output and log response
    core.setOutput("translated-text", translatedText);
    core.startGroup("Translation Result");
    console.log(translatedText);
    core.endGroup();
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
