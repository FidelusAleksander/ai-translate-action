# AI Translate Action :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate-action)](https://github.com/FidelusAleksander/ai-translate-action/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.zh.md)

A GitHub Action that provides AI-powered text translation directly in your workflows.

- [AI Translate Action :globe\_with\_meridians:](#ai-translate-action-globe_with_meridians)
  - [Basic Usage 🚀](#basic-usage-)
    - [Translate text directly](#translate-text-directly)
    - [Translate a text file](#translate-a-text-file)
  - [Permissions 🔒](#permissions-)
  - [Inputs ⚙️](#inputs-️)
  - [Outputs 📤](#outputs-)
  - [Cool examples 🎮](#cool-examples-)
    - [Auto-translate README to multiple languages](#auto-translate-readme-to-multiple-languages)

## Basic Usage 🚀

### Translate text directly

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Translate a text file

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text-file: README.md
    target-language: "French"
```

## Permissions 🔒

This action requires at minimum the following permissions set.

```yaml
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

### Auto-translate README to multiple languages

This action can be used to automatically translate your README into multiple languages whenever changes are made. Here's how this repository keeps its documentation in sync:

```yaml
name: Translate README

on:
  push:
    branches:
      - main
    paths:
      - "README.md"

permissions:
  contents: write
  pull-requests: write
  models: read

jobs:
  translate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: ["spanish", "chinese"]
        include:
          - language: "spanish"
            file: "README.es.md"
          - language: "chinese"
            file: "README.zh.md"

    steps:
      - uses: actions/checkout@v4

      - name: Translate README
        uses: FidelusAleksander/ai-translate-action@v1
        id: translate
        with:
          text-file: "README.md"
          target-language: ${{ matrix.language }}
          custom-instructions: "Keep technical terms in English. Don't translate code blocks"

      - name: Save translation
        run: |
          mkdir -p docs
          echo "$TRANSLATED_TEXT" | tee docs/${{ matrix.file }}
        env:
          TRANSLATED_TEXT: ${{ steps.translate.outputs.translated-text }}

      - name: Upload translation artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.file }}
          path: docs/${{ matrix.file }}

  create-pr:
    needs: translate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          path: docs
          merge-multiple: true
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "docs: update translations of README"
          title: "docs: update translations of README"
          body: |
            This PR updates all translations of the README:

            Changes were automatically generated using the [ai-translate-action](https://github.com/FidelusAleksander/ai-translate-action) action.
          branch: docs/update-readme-translations
          add-paths: "docs/README*"
          delete-branch: true
          labels: |
            documentation
```

This workflow automatically translates the README into Polish, Spanish, and Chinese whenever changes are made to the English version. It creates a pull request with the updated translations, making it easy to review the changes before merging.
