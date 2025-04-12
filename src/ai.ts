import { OpenAI } from "openai";

export async function translateText(
  text: string,
  targetLanguage: string,
  model: string,
  token: string,
): Promise<string> {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: token,
  });

  const systemPrompt = `You are a highly skilled ${targetLanguage} translator.
    Your responsibilities:
    - Translate the provided text to ${targetLanguage}
    - Preserve the meaning, tone, formatting and style of the original text
    - Detect the source language automatically
    - Return only the translation, no explanations or notes

    You will receive the text to translate in the user message.`;

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No translation was generated by the AI model");
    }

    return response;
  } catch (error) {
    throw new Error(
      `Failed to translate text: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}
