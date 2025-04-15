# Acción de Traducción AI :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate-action/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate-action)](https://github.com/FidelusAleksander/ai-translate-action/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate-action/blob/main/docs/README.zh.md)

Una GitHub Action que ofrece traducción de texto impulsada por IA directamente en tus flujos de trabajo.

- [Acción de Traducción AI :globe\_with\_meridians:](#acción-de-traducción-ai-globe_with_meridians)
  - [Uso Básico 🚀](#uso-básico-)
    - [Traducir texto directamente](#traducir-texto-directamente)
    - [Traducir un archivo de texto](#traducir-un-archivo-de-texto)
  - [Permisos 🔒](#permisos-)
  - [Entradas ⚙️](#entradas-️)
  - [Salidas 📤](#salidas-)
  - [Ejemplos Geniales 🎮](#ejemplos-geniales-)
    - [Traducción automática del README a múltiples idiomas](#traducción-automática-del-readme-a-múltiples-idiomas)

## Uso Básico 🚀

### Traducir texto directamente

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Traducir un archivo de texto

```yaml
- uses: FidelusAleksander/ai-translate-action@v1
  with:
    text-file: README.md
    target-language: "French"
```

## Permisos 🔒

Esta acción requiere como mínimo los siguientes permisos establecidos.

```yaml
permissions:
  models: read
```

## Entradas ⚙️

| Entrada | Descripción | Obligatoria | Predeterminada |
|---------|-------------|-------------|----------------|
| `text` | El texto a traducir | No* | - |
| `text-file` | Ruta a un archivo que contiene el texto a traducir | No* | - |
| `target-language` | El idioma al que traducir el texto | Sí | - |
| `token` | Token de acceso personal | No | `${{ github.token }}` |
| `model` | El modelo de IA a usar. Ver [modelos disponibles](https://github.com/marketplace?type=models) | No | `gpt-4o` |
| `custom-instructions` | Instrucciones adicionales opcionales para personalizar el comportamiento de la traducción (por ejemplo, "No traduzcas bloques de código" o "Conserva los términos técnicos en inglés") | No | - |

\* Se debe proporcionar `text` o `text-file`

## Salidas 📤

| Salida | Descripción |
|--------|-------------|
| `translated-text` | El texto traducido |

## Ejemplos Geniales 🎮

¿Se te ocurrió un uso ingenioso de esta acción? ¡Abre un PR para compartirlo aquí con el mundo!

### Traducción automática del README a múltiples idiomas

Esta acción se puede usar para traducir automáticamente tu README a múltiples idiomas siempre que se realicen cambios. Así es como este repositorio mantiene su documentación sincronizada:

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

Este flujo de trabajo traduce automáticamente el README a español y chino cada vez que se realizan cambios en la versión en inglés. Crea un pull request con las traducciones actualizadas, lo que facilita la revisión de los cambios antes de fusionarlos.
