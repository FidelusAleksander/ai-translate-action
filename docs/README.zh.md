# AI Translate :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate)](https://github.com/FidelusAleksander/ai-translate/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.zh.md)

一个 GitHub Action，可以在工作流程中提供 AI 驱动的文本翻译功能。

- [AI Translate :globe_with_meridians:](#ai-translate-globe_with_meridians)
  - [基本用法 🚀](#基本用法-)
    - [直接翻译文本](#直接翻译文本)
    - [翻译文本文件](#翻译文本文件)
  - [权限 🔒](#权限-)
  - [输入参数 ⚙️](#输入参数-️)
  - [输出参数 📤](#输出参数-)
  - [酷炫示例 🎮](#酷炫示例-)
    - [自动将 README 翻译成多种语言](#自动将-readme-翻译成多种语言)

## 基本用法 🚀

### 直接翻译文本

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### 翻译文本文件

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text-file: README.md
    target-language: "French"
```

## 权限 🔒

此操作至少需要设置以下权限。

```yaml
permissions:
  models: read
```

## 输入参数 ⚙️

| 输入参数 | 描述 | 必需 | 默认值 |
|-------|-------------|----------|---------|
| `text` | 需要翻译的文本 | 否* | - |
| `text-file` | 包含待翻译文本的文件路径 | 否* | - |
| `target-language` | 翻译目标语言 | 是 | - |
| `token` | 个人访问令牌 | 否 | `${{ github.token }}` |
| `model` | 使用的 AI 模型。查看 [可用模型](https://github.com/marketplace?type=models) | 否 | `gpt-4o` |
| `custom-instructions` | 可选的自定义指令，用以调整翻译行为（例如：“不要翻译代码块” 或 “保持技术术语为英语”） | 否 | - |

\* `text` 和 `text-file` 必须至少提供其中之一

## 输出参数 📤

| 输出参数 | 描述 |
|--------|-------------|
| `translated-text` | 翻译后的文本 |

## 酷炫示例 🎮

您是否想过此操作的巧妙用法？提交一个 PR，将您的创意展示给全世界！

### 自动将 README 翻译成多种语言

此操作可用于在 README 更新时，自动将其翻译成多种语言。以下是本存储库如何保持文档同步的方式：

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
        language: ["polish", "spanish", "chinese"]
        include:
          - language: "polish"
            file: "README.pl.md"
          - language: "spanish"
            file: "README.es.md"
          - language: "chinese"
            file: "README.zh.md"

    steps:
      - uses: actions/checkout@v4

      - name: Translate README
        uses: ./
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

            Changes were automatically generated using the [ai-translate](https://github.com/FidelusAleksander/ai-translate) action.
          branch: docs/update-readme-translations
          add-paths: "docs/README*"
          delete-branch: true
          labels: |
            documentation
            skip-release-notes
```

此工作流会在英文版本更新时，自动将 README 翻译成波兰语、西班牙语和中文，并创建一个包含更新翻译的拉取请求，让您可以轻松审阅更改后再进行合并。
