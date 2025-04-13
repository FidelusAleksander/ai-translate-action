# AI Translate :globe_with_meridians:

[![Run Tests](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml/badge.svg)](https://github.com/FidelusAleksander/ai-translate/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/FidelusAleksander/ai-translate)](https://github.com/FidelusAleksander/ai-translate/releases)

[![English](https://img.shields.io/badge/English-README.md-blue)](https://github.com/FidelusAleksander/ai-translate/blob/main/README.md) [![Polish](https://img.shields.io/badge/Polish-docs/README.pl.md-red)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.pl.md) [![Spanish](https://img.shields.io/badge/Spanish-docs/README.es.md-yellow)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.es.md) [![Chinese](https://img.shields.io/badge/Chinese-docs/README.zh.md-green)](https://github.com/FidelusAleksander/ai-translate/blob/main/docs/README.zh.md)

Una GitHub Action que proporciona traducción de texto basada en IA directamente en tus flujos de trabajo.

- [AI Translate :globe\_with\_meridians:](#ai-translate-globe_with_meridians)
  - [Uso Básico 🚀](#uso-básico-)
    - [Traducir texto directamente](#traducir-texto-directamente)
    - [Traducir un archivo de texto](#traducir-un-archivo-de-texto)
  - [Permisos 🔒](#permisos-)
  - [Entradas ⚙️](#entradas-️)
  - [Salidas 📤](#salidas-)
  - [Ejemplos Geniales 🎮](#ejemplos-geniales-)
    - [Traducción automática de README a varios idiomas](#traducción-automática-de-readme-a-varios-idiomas)

## Uso Básico 🚀

### Traducir texto directamente

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text: "Hello, world!"
    target-language: "Spanish"
```

### Traducir un archivo de texto

```yaml
- uses: FidelusAleksander/ai-translate@v1
  with:
    text-file: README.md
    target-language: "French"
```

## Permisos 🔒

Esta acción requiere al menos que se establezcan los siguientes permisos.

```yaml
permissions:
  models: read
```

## Entradas ⚙️

| Entrada | Descripción | Requerido | Por defecto |
|---------|-------------|-----------|-------------|
| `text` | El texto a traducir | No* | - |
| `text-file` | Ruta a un archivo que contiene el texto a traducir | No* | - |
| `target-language` | El idioma al que se traducirá el texto | Sí | - |
| `token` | Token de acceso personal | No | `${{ github.token }}` |
| `model` | El modelo de IA a usar. Consulte [modelos disponibles](https://github.com/marketplace?type=models) | No | `gpt-4o` |
| `custom-instructions` | Instrucciones adicionales opcionales para personalizar el comportamiento de la traducción (ej., "No traducir bloques de código" o "Mantener los términos técnicos en inglés") | No | - |

\* Se debe proporcionar `text` o `text-file`

## Salidas 📤

| Salida | Descripción |
|--------|-------------|
| `translated-text` | El texto traducido |

## Ejemplos Geniales 🎮

¿Se te ocurrió un uso ingenioso para esta acción? ¡Abre un PR para mostrarlo aquí al mundo!

### Traducción automática de README a varios idiomas

Esta acción se puede utilizar para traducir automáticamente tu README a varios idiomas cada vez que se realicen cambios. Este es el flujo de trabajo que este repositorio utiliza para mantener su documentación actualizada:

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
            Esta PR actualiza todas las traducciones del README:

            Los cambios fueron generados automáticamente utilizando la acción [ai-translate](https://github.com/FidelusAleksander/ai-translate).
          branch: docs/update-readme-translations
          add-paths: "docs/README*"
          delete-branch: true
          labels: |
            documentation
```

Este flujo de trabajo traduce automáticamente el README a polaco, español y chino cada vez que se realizan cambios en la versión en inglés. Crea una pull request con las traducciones actualizadas, lo que facilita la revisión de los cambios antes de fusionarlos.
