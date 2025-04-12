import { translateText } from "../src/ai";
import { OpenAI } from "openai";

// Mock the OpenAI module
jest.mock("openai");

describe("translateText", () => {
  const mockToken = "test-token";
  const mockModel = "gpt-4o";
  const mockText = "Hello, world!";
  const mockTargetLanguage = "Spanish";

  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));
  });

  it("should translate text successfully", async () => {
    const mockTranslation = "¡Hola, mundo!";
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: mockTranslation } }],
    });

    const translation = await translateText(
      mockText,
      mockTargetLanguage,
      mockModel,
      mockToken,
    );

    expect(translation).toBe(mockTranslation);
    expect(mockCreate).toHaveBeenCalledWith({
      model: mockModel,
      messages: [
        {
          role: "system",
          content: expect.stringContaining(mockTargetLanguage),
        },
        {
          role: "user",
          content: mockText,
        },
      ],
    });
  });

  it("should throw an error when no translation is generated", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    await expect(
      translateText(mockText, mockTargetLanguage, mockModel, mockToken),
    ).rejects.toThrow("No translation was generated by the AI model");
  });

  it("should handle API errors properly", async () => {
    const errorMessage = "API Error";
    mockCreate.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      translateText(mockText, mockTargetLanguage, mockModel, mockToken),
    ).rejects.toThrow(`Failed to translate text: ${errorMessage}`);
  });
});
