# AI Translate :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate)](https://github.com/FidelusAleksander/ai-translate/releases)

A GitHub Action that provides AI-powered text translation directly in your workflows.

- [AI Translate :globe\_with\_meridians:](#ai-translate-globe_with_meridians)
  - [Basic Usage 🚀](#basic-usage-)
    - [Translate text directly](#translate-text-directly)
    - [Translate from a file](#translate-from-a-file)
  - [Permissions 🔒](#permissions-)
  - [Inputs ⚙️](#inputs-️)
  - [Outputs 📤](#outputs-)
  - [Cool examples 🎮](#cool-examples-)

## Basic Usage 🚀

### Translate text directly

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Translate from a file

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text-file: .github/texts/content.md
    target-language: "French"
```

## Permissions 🔒

This action requires at minimum the following permissions set.

```
permissions:
  models: read
```

## Inputs ⚙️

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `text` | The text to translate | No* | - |
| `text-file` | Path to a file containing the text to translate | No* | - |
| `target-language` | The language to translate the text into | Yes | - |
| `token` | Personal access token | No | `${{ github.token }}` |
| `model` | The AI model to use. See [available models](https://github.com/marketplace?type=models) | No | `gpt-4o` |
| `custom-instructions` | Optional additional instructions to customize translation behavior (e.g., "Don't translate code blocks" or "Keep technical terms in English") | No | - |

\* Either `text` or `text-file` must be provided

## Outputs 📤

| Output | Description |
|--------|-------------|
| `translated-text` | The translated text |

## Cool examples 🎮

Have you come up with a clever use of this action? Open a PR to showcase it here for the world to see!
