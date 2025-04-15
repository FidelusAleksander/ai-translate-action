# AI Translate Action :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate-action)](https://github.com/FidelusAleksander/ai-translate-action/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.zh.md)

GitHub Action, który umożliwia tłumaczenie tekstu przy wykorzystaniu sztucznej inteligencji bezpośrednio w ramach workflow.

- [AI Translate Action :globe\_with\_meridians:](#ai-translate-action-globe_with_meridians)
  - [Podstawowe zastosowanie 🚀](#podstawowe-zastosowanie-)
    - [Tłumaczenie tekstu bezpośrednio](#tłumaczenie-tekstu-bezpośrednio)
    - [Tłumaczenie pliku tekstowego](#tłumaczenie-pliku-tekstowego)
  - [Uprawnienia 🔒](#uprawnienia-)
  - [Wejścia ⚙️](#wejścia-️)
  - [Wyjścia 📤](#wyjścia-)
  - [Ciekawe przykłady 🎮](#ciekawe-przykłady-)
    - [Automatyczne tłumaczenie README na wiele języków](#automatyczne-tłumaczenie-readme-na-wiele-języków)

## Podstawowe zastosowanie 🚀

### Tłumaczenie tekstu bezpośrednio

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Tłumaczenie pliku tekstowego

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text-file: README.md
    target-language: "French"
```

## Uprawnienia 🔒

Do działania tej akcji wymagane są przynajmniej poniższe uprawnienia.

```yaml
permissions:
  models: read
```

## Wejścia ⚙️

| Wejście               | Opis                                                                                           | Wymagane | Domyślne |
|-----------------------|------------------------------------------------------------------------------------------------|----------|----------|
| `text`               | Tekst do przetłumaczenia                                                                       | Nie*     | -        |
| `text-file`          | Ścieżka do pliku z tekstem do przetłumaczenia                                                  | Nie*     | -        |
| `target-language`    | Język docelowy dla tłumaczenia                                                                 | Tak      | -        |
| `token`              | Personal access token                                                                          | Nie      | `${{ github.token }}` |
| `model`              | Model AI używany do tłumaczenia. Zobacz [dostępne modele](https://github.com/marketplace?type=models) | Nie      | `gpt-4o` |
| `custom-instructions` | Opcjonalne dodatkowe instrukcje, aby dostosować sposób tłumaczenia (np. „Nie tłumacz fragmentów kodu" lub „Zachowaj angielskie terminy techniczne”) | Nie      | -        |

\* Należy podać `text` lub `text-file`

## Wyjścia 📤

| Wyjście             | Opis                  |
|---------------------|-----------------------|
| `translated-text`   | Przetłumaczony tekst |

## Ciekawe przykłady 🎮

Masz pomysł na ciekawe zastosowanie tej akcji? Otwórz PR i pokaż je światu!

### Automatyczne tłumaczenie README na wiele języków

Akcja może być używana do automatycznego tłumaczenia README na wiele języków każdorazowo, gdy wprowadzane są zmiany. Poniżej znajduje się przykład, w jaki sposób dokumentacja tego repozytorium jest utrzymywana w synchronizacji:

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

Ten workflow automatycznie tłumaczy README na język hiszpański i chiński, gdy tylko wprowadzone zostaną zmiany w wersji angielskiej. Tworzy pull request z aktualizacjami tłumaczeń, co ułatwia przeglądanie zmian przed ich scaleniem.
