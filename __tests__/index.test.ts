const mockCore = {
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
};

const mockFs = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
};

const mockGenerateAIResponse = jest.fn();

jest.mock("@actions/core", () => mockCore);
jest.mock("fs", () => mockFs);
jest.mock("../src/ai", () => ({
  generateAIResponse: mockGenerateAIResponse,
}));

describe("GitHub Action", () => {
  const mockToken = "test-token";
  const mockModel = "test-model";
  const mockPrompt = "test prompt";
  const mockResponse = "test response";

  beforeEach(() => {
    jest.resetAllMocks();
    mockGenerateAIResponse.mockResolvedValue(mockResponse);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        default:
          return "";
      }
    });
  });

  it("should work with prompt input", async () => {
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "prompt":
          return mockPrompt;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      mockPrompt,
      mockModel,
      mockToken,
    );
    expect(mockCore.setOutput).toHaveBeenCalledWith("text", mockResponse);
  });

  it("should work with prompt-file input", async () => {
    const promptFilePath = "test-prompt.txt";
    const fileContent = "prompt from file";

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(fileContent);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "prompt-file":
          return promptFilePath;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockFs.existsSync).toHaveBeenCalledWith(promptFilePath);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(promptFilePath, "utf8");
    expect(mockGenerateAIResponse).toHaveBeenCalledWith(
      fileContent,
      mockModel,
      mockToken,
    );
    expect(mockCore.setOutput).toHaveBeenCalledWith("text", mockResponse);
  });

  it("should throw error when prompt file doesn't exist", async () => {
    const promptFilePath = "non-existent.txt";

    mockFs.existsSync.mockReturnValue(false);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "prompt-file":
          return promptFilePath;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockCore.setFailed).toHaveBeenCalledWith(
      `Prompt file not found: ${promptFilePath}`,
    );
  });

  it("should throw error when neither prompt nor prompt-file is provided", async () => {
    await import("../src/index");

    expect(mockCore.setFailed).toHaveBeenCalledWith(
      "Either 'prompt' or 'prompt-file' input must be provided",
    );
  });

  // Clear the module cache after each test
  afterEach(() => {
    jest.resetModules();
  });
});
