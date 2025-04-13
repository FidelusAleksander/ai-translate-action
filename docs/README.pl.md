# AI Translate :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate)](https://github.com/FidelusAleksander/ai-translate/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.zh.md)

Github Action, który zapewnia tłumaczenie tekstu napędzane AI bezpośrednio w Twoich workflow.

- [AI Translate :globe\_with\_meridians:](#ai-translate-globe_with_meridians)
  - [Podstawowe użycie 🚀](#podstawowe-użycie-)
    - [Tłumacz tekst bezpośrednio](#tłumacz-tekst-bezpośrednio)
    - [Tłumacz plik tekstowy](#tłumacz-plik-tekstowy)
  - [Uprawnienia 🔒](#uprawnienia-)
  - [Dane wejściowe ⚙️](#dane-wejściowe-️)
  - [Dane wyjściowe 📤](#dane-wyjściowe-)
  - [Ciekawe przykłady 🎮](#ciekawe-przykłady-)
    - [Automatyczne tłumaczenie README na wiele języków](#automatyczne-tłumaczenie-readme-na-wiele-języków)

## Podstawowe użycie 🚀

### Tłumacz tekst bezpośrednio

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Tłumacz plik tekstowy

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text-file: README.md
    target-language: "French"
```

## Uprawnienia 🔒

Ta akcja wymaga co najmniej następujących ustawień uprawnień.

```yaml
permissions:
  models: read
```

## Dane wejściowe ⚙️

| Dane wejściowe | Opis | Wymagane | Domyślne |
|----------------|-------|----------|----------|
| `text` | Tekst do przetłumaczenia | Nie* | - |
| `text-file` | Ścieżka do pliku zawierającego tekst do przetłumaczenia | Nie* | - |
| `target-language` | Język docelowy tłumaczenia | Tak | - |
| `token` | Osobisty token dostępu | Nie | `${{ github.token }}` |
| `model` | Model AI do użycia. Zobacz [dostępne modele](https://github.com/marketplace?type=models) | Nie | `gpt-4o` |
| `custom-instructions` | Opcjonalne dodatkowe instrukcje do dostosowania zachowania tłumaczenia (np. "Nie tłumacz bloków kodu" lub "Zachowaj terminy techniczne w języku angielskim") | Nie | - |

\* Należy podać `text` lub `text-file`

## Dane wyjściowe 📤

| Dane wyjściowe | Opis |
|----------------|------|
| `translated-text` | Przetłumaczony tekst |

## Ciekawe przykłady 🎮

Wymyśliłeś sprytne użycie tej akcji? Otwórz PR, aby zaprezentować je tutaj światu!

### Automatyczne tłumaczenie README na wiele języków

Ta akcja może być używana do automatycznego tłumaczenia README na wiele języków, kiedykolwiek zostaną dokonane zmiany. Oto jak to repozytorium utrzymuje swoją dokumentację w synchronizacji:

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
        uses: FidelusAleksander/ai-translate@v1
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
```

Ten workflow automatycznie tłumaczy README na polski, hiszpański i chiński ilekroć zmiany zostaną wprowadzone do angielskiej wersji. Tworzy pull request z zaktualizowanymi tłumaczeniami, co umożliwia łatwą weryfikację zmian przed scaleniem.
