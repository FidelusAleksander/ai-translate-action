# AI 翻译操作 :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate-action)](https://github.com/FidelusAleksander/ai-translate-action/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.zh.md)

一个直接在您的工作流中提供 AI 驱动文本翻译的 GitHub 操作。

- [AI 翻译操作 :globe\_with\_meridians:](#ai-翻译操作-globe_with_meridians)
  - [基本用法 🚀](#基本用法-)
    - [直接翻译文本](#直接翻译文本)
    - [翻译文本文件](#翻译文本文件)
  - [权限 🔒](#权限-)
  - [输入 ⚙️](#输入-️)
  - [输出 📤](#输出-)
  - [酷炫示例 🎮](#酷炫示例-)
    - [自动将 README 翻译为多种语言](#自动将-readme-翻译为多种语言)

## 基本用法 🚀

### 直接翻译文本

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### 翻译文本文件

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
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

## 输入 ⚙️

| 输入项               | 描述                                                 | 是否必填 | 默认值                 |
|---------------------|----------------------------------------------------|--------|---------------------|
| `text`             | 要翻译的文本                                           | 否*     | -                   |
| `text-file`        | 包含要翻译文本的文件路径                                    | 否*     | -                   |
| `target-language`  | 翻译目标语言                                           | 是      | -                   |
| `token`            | 个人访问令牌                                           | 否      | `${{ github.token }}` |
| `model`            | 使用的 AI 模型，详见[可用模型](https://github.com/marketplace?type=models) | 否      | `gpt-4o`           |
| `custom-instructions` | 自定义翻译行为的说明（例如，“不要翻译代码块”或“保留技术术语为英文”）       | 否      | -                   |

\* `text` 和 `text-file` 至少需提供一个

## 输出 📤

| 输出项               | 描述                                   |
|---------------------|--------------------------------------|
| `translated-text`  | 翻译后的文本                             |

## 酷炫示例 🎮

您是否想出了使用此操作的有趣方法？打开 PR 与世界分享吧！

### 自动将 README 翻译为多种语言

此操作可用于在 README 发生更改时，自动将其翻译为多种语言。以下是本存储库如何使其文档保持同步的示例：

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

此工作流会在 README 的英文版本发生更改时，自动将其翻译为波兰语、西班牙语和中文。它会创建一个包含更新后翻译内容的 Pull Request，使您能够轻松审核更改后再合并。
