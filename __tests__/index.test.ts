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

const mockTranslateText = jest.fn();

jest.mock("@actions/core", () => mockCore);
jest.mock("fs", () => mockFs);
jest.mock("../src/ai", () => ({
  translateText: mockTranslateText,
}));

describe("GitHub Action", () => {
  const mockToken = "test-token";
  const mockModel = "test-model";
  const mockText = "Hello, world!";
  const mockTranslation = "¡Hola, mundo!";
  const mockTargetLanguage = "Spanish";

  beforeEach(() => {
    jest.resetAllMocks();
    mockTranslateText.mockResolvedValue(mockTranslation);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        case "target-language":
          return mockTargetLanguage;
        default:
          return "";
      }
    });
  });

  it("should work with text input", async () => {
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "text":
          return mockText;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        case "target-language":
          return mockTargetLanguage;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockTranslateText).toHaveBeenCalledWith(
      mockText,
      mockTargetLanguage,
      mockModel,
      mockToken,
    );
    expect(mockCore.setOutput).toHaveBeenCalledWith(
      "translated-text",
      mockTranslation,
    );
  });

  it("should work with text-file input", async () => {
    const textFilePath = "test-text.txt";
    const fileContent = "Hello from file";

    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(fileContent);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "text-file":
          return textFilePath;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        case "target-language":
          return mockTargetLanguage;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockFs.existsSync).toHaveBeenCalledWith(textFilePath);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(textFilePath, "utf8");
    expect(mockTranslateText).toHaveBeenCalledWith(
      fileContent,
      mockTargetLanguage,
      mockModel,
      mockToken,
    );
    expect(mockCore.setOutput).toHaveBeenCalledWith(
      "translated-text",
      mockTranslation,
    );
  });

  it("should throw error when text file doesn't exist", async () => {
    const textFilePath = "non-existent.txt";

    mockFs.existsSync.mockReturnValue(false);
    mockCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "text-file":
          return textFilePath;
        case "token":
          return mockToken;
        case "model":
          return mockModel;
        case "target-language":
          return mockTargetLanguage;
        default:
          return "";
      }
    });

    await import("../src/index");

    expect(mockCore.setFailed).toHaveBeenCalledWith(
      `Text file not found: ${textFilePath}`,
    );
  });

  it("should throw error when neither text nor text-file is provided", async () => {
    await import("../src/index");

    expect(mockCore.setFailed).toHaveBeenCalledWith(
      "Either 'text' or 'text-file' input must be provided",
    );
  });

  // Clear the module cache after each test
  afterEach(() => {
    jest.resetModules();
  });
});
