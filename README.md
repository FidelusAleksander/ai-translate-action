# Ask AI :robot:

[![Run Tests](https://github.com/FidelusAleksander/ask-ai/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ask-ai/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ask-ai)](https://github.com/FidelusAleksander/ask-ai/releases)

A GitHub Action that lets you ask AI questions directly in your workflows.

- [Ask AI :robot:](#ask-ai-robot)
  - [Basic Usage 🚀](#basic-usage-)
    - [Provide prompt directly](#provide-prompt-directly)
    - [Load a prompt from a file](#load-a-prompt-from-a-file)
  - [Permissions 🔒](#permissions-)
  - [Inputs ⚙️](#inputs-️)
  - [Outputs 📤](#outputs-)
  - [Cool examples 🎮](#cool-examples-)
    - [Respond to Issues](#respond-to-issues)

## Basic Usage 🚀

### Provide prompt directly

```yaml
- uses: FidelusAleksander/ask-ai@v1
  with:
    prompt: "What is the meaning of life?"
```

### Load a prompt from a file

```yaml
- uses: FidelusAleksander/ask-ai@v1
  with:
    prompt-file: .github/prompts/my-prompt.md
```

## Permissions 🔒

This actions requires at minimum the following permissions set.

```
permissions:
  models: read
```

## Inputs ⚙️

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `prompt` | The text prompt to send to the AI | No* | - |
| `prompt-file` | Path to a file containing the prompt | No* | - |
| `token` | Personal access token | No | `${{ github.token }}` |
| `model` | The AI model to use. See [available models](https://github.com/marketplace?type=models) | No | `gpt-4o` |

\* Either `prompt` or `prompt-file` must be provided

## Outputs 📤

| Output | Description |
|--------|-------------|
| `text` | The AI's response to your prompt |

## Cool examples 🎮

Have you come up with a clever use of this action? Open a PR to showcase it here for the world to see!

### Respond to Issues

Respond to opened issues for extra information

```yaml
name: AI Issue Responder
on:
  issues:
    types: [opened]

permissions:
  issues: write
  models: read

jobs:
  respond-to-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Ask AI
        id: ask-ai
        uses: ./
        with:
          model: gpt-4o
          prompt: |
            Respond to this GitHub issue. Your response should be ready to post as a comment. Don't respond with anything other than the comment text.

            AUTHOR: ${{ github.event.issue.user.login }}
            TITLE: ${{ github.event.issue.title }}
            DESCRIPTION: ${{ github.event.issue.body }}

            Follow these guidelines:
            1. Thank the user for opening the issue
            2. Determine the issue type:
                - If it's a bug report, ask for any missing information (steps to reproduce, expected vs actual behavior, environment details)
                - If it's a feature request, acknowledge the idea's value and ask for use cases if none were provided
            3. Sign of as "AI Assistant"

      - name: Comment on issue
        uses: peter-evans/create-or-update-comment@v3
        with:
          issue-number: ${{ github.event.issue.number }}
          body: |
            ## 👋 Hello there!

            ${{ steps.ask-ai.outputs.text }}

            _This is an automated response from our AI assistant. A human maintainer will review your issue soon._
