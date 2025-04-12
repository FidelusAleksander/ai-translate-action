# AI Translate :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate)](https://github.com/FidelusAleksander/ai-translate/releases)

A GitHub Action that provides AI-powered text translation directly in your workflows.

- [AI Translate :globe_with_meridians:](#ai-translate-globe_with_meridians)
  - [Basic Usage 🚀](#basic-usage-)
    - [Translate text directly](#translate-text-directly)
    - [Translate from a file](#translate-from-a-file)
  - [Permissions 🔒](#permissions-)
  - [Inputs ⚙️](#inputs-️)
  - [Outputs 📤](#outputs-)
  - [Cool examples 🎮](#cool-examples-)
    - [Translate Documentation](#translate-documentation)

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
| `model` | The AI model to use. See [available models](https://github.com/marketplace?type=models) | No | `gpt-4` |

\* Either `text` or `text-file` must be provided

## Outputs 📤

| Output | Description |
|--------|-------------|
| `translated-text` | The translated text |

## Cool examples 🎮

Have you come up with a clever use of this action? Open a PR to showcase it here for the world to see!

### Translate Documentation

Automatically translate your documentation when changes are made:

```yaml
name: Translate Documentation
on:
  push:
    paths:
      - 'docs/en/**'
    branches:
      - main

permissions:
  contents: write
  models: read

jobs:
  translate-docs:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: [Spanish, French, German]
    steps:
      - uses: actions/checkout@v4

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v35
        with:
          files: docs/en/**

      - name: Translate Documentation
        uses: FidelusAleksander/ai-translate@v1
        id: translate
        with:
          text-file: ${{ steps.changed-files.outputs.all_changed_files }}
          target-language: ${{ matrix.language }}

      - name: Update translated documentation
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'docs: update ${{ matrix.language }} translation'
          body: 'Automated translation update for ${{ matrix.language }} documentation'
          branch: translate-docs-${{ matrix.language }}
          base: main
          commit-message: 'docs: update ${{ matrix.language }} translation'
          add-paths: |
            docs/${{ matrix.language }}/**
```
