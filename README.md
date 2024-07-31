# General Purpose Package for VDA

This package provides general-purpose functionalities for processing images to extract OCR content and convert it to Markdown. It is designed to be used as a base for building industry-specific applications.

## Features

- **OCR Extraction**: Extracts text from image buffers using Tesseract and corrects it with an LLM.
- **Markdown Conversion**: Converts extracted OCR content into Markdown format.

## Installation

To install this package, use npm:

```sh
npm install @zauto/vda
```

## Environment Variables

The package requires the following environment variables to be set.You can create a `.env` file in the root of your project to set these variables:

```sh
AWS_ACCESS_KEY='your-aws-access-key'
AWS_SECRET_KEY='your-aws-secret-key'
MARKDOWN_MODEL='your-markdown-model'
OCR_MODEL='your-ocr-model'
```

## Supported Models

The package supports the following models:

- anthropic.claude-3-sonnet-20240229-v1:0
- anthropic.claude-3-5-sonnet-20240620-v1:0
- anthropic.claude-3-haiku-20240307-v1:0
- mistral.mixtral-8x7b-instruct-v0:1
- meta.llama3-8b-instruct-v1:0


Ensure that the models in environment variable is set to one of the supported models.

## Usage

### MainService

The `MainService` provides methods to process images, extract OCR content, and convert it to Markdown.

#### Methods

- **processImage(fileBuffer: Buffer): Promise<ProcessImageResponse>**
  - Processes an image buffer to extract OCR content and convert it to Markdown.
  - **Parameters**:
    - `fileBuffer`: The buffer of the file to be processed.
  - **Returns**: An object containing the extracted OCR content and converted Markdown content.

- **extractOcrFromImage(fileBuffer: Buffer): Promise<LlmResponse>**
  - Extracts OCR content from a file buffer.
  - **Parameters**:
    - `fileBuffer`: The buffer of the file to be processed.
  - **Returns**: An object containing the extracted OCR content.

- **convertToMarkdownFromOcr(fileBuffer: Buffer, ocrContent: string): Promise<LlmResponse>**
  - Converts OCR content to Markdown format.
  - **Parameters**:
    - `fileBuffer`: The buffer of the file to be processed.
    - `ocrContent`: The OCR content to be converted.
  - **Returns**: An object containing the converted Markdown content.
