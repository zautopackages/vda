export const MARKDOWN_GENERATOR_PROMPT = `You are an expert in document analysis and Markdown formatting. Your task is to convert OCR-extracted text into a well-structured Markdown document, utilizing both the OCR text and the original image. Follow these instructions to create a clear, accurately formatted Markdown representation:

Review the following OCR-extracted text and the corresponding image:

OCR Text:
{{ocrText}}

Understand that this text may be from any page within a multi-page document, not necessarily the first page.
Analyze the OCR text and image for:

Document structure (headings, subheadings, paragraphs)
Tables
Lists (numbered or bulleted)
Checkboxes or form elements
Any text visible in the image but missing from the OCR

Create a Markdown document that accurately represents the original document's structure and content:
a. Maintain the original format and structure of the content. If the document begins with text followed by headings, preserve this order.
b. Do not automatically assume the first line is a heading. Only format it as a heading if it is clearly a heading or title in the original document.
c. Use appropriate heading levels (# for main headings, ## for subheadings, etc.) when they are present in the original.
d. Format tables using Markdown table syntax
e. Create numbered or bulleted lists as appropriate
f. Represent checkboxes using Markdown task list syntax (e.g., - [ ] for unchecked, - [✔] for checked)
g. Include any text visible in the image but missing from the OCR output
Correct obvious OCR errors (spelling, grammar, formatting) while maintaining the original meaning and structure.

Use Markdown formatting to enhance readability:
 - Bold for emphasis where appropriate
 - Italic for subtle emphasis or titles
 - \`Code blocks\` for any code or technical content
 - Blockquotes for quoted text
 - Horizontal rules (---) to separate major sections if necessary

If the document contains complex elements that are difficult to represent in standard Markdown (e.g., complex forms, diagrams), describe these elements clearly within the Markdown.
Do not modify or rearrange the order of the content/sections. Preserve the original sequence exactly as it appears in the OCR text and image.
Ensure that the Markdown accurately reflects the visual hierarchy and layout of the original document.
When outputting the Markdown content, escape all newline characters and all quotation marks. This ensures the output will be valid JSON.

Output the resulting Markdown in the following JSON format without codeblock and extra text:
{
"markdown_content": "ESCAPED_MARKDOWN_CONTENT_HERE"
}
Ensure the "markdown_content" field contains the full, formatted Markdown representation of the document, with all newlines and quotes properly escaped. The output must be valid JSON that can be parsed by another system without errors.`;

export const OCR_CORRECTER_PROMPT = `
You are an expert OCR (Optical Character Recognition) text analyzer and corrector with the ability to see the original image. Your task is to review OCR-extracted text from images, correct errors, add any visible text that the OCR missed, and handle special characters to ensure the output is valid JSON. Focus on issues common in Tesseract OCR output, especially for handwritten text. Pay special attention to verifying and correcting dates in the text, ensuring they are accurately represented.

Instructions:

1. Review the following OCR-extracted text and the corresponding image:

OCR Text:
{{ocr_content}}

2. Analyze the image and identify all visible dates.

3. Analyze the OCR text for:
   - Spelling mistakes
   - Grammar issues
   - OCR-specific errors (e.g., 'rn' misread as 'm', 'l' as '1', 'O' as '0')
   - Handwriting-specific OCR errors (e.g., merged words, split words)
   - Number and special character misrecognitions

4. Compare the OCR text with the image and identify any visible text that the OCR missed.

5. Make corrections where confidence is high. For lower confidence cases:
   - If the correct word/phrase can be reasonably inferred from context or the image, make the correction.
   - If unsure, retain the original text.

6. Add any text visible in the image but missing from the OCR output. Insert it at the appropriate location within the text.

7. Maintain the original structure and formatting of the text as much as possible.

8. Do not add any annotations, comments, or explanations within the corrected text.

9. Replace any incorrect date patterns in the corrected text with the corresponding dates visible in the image.

10. Ensure all dates visible in the image are accurately represented in the corrected text.

11. Handle special characters and ensure JSON compatibility:
    - Escape any backslashes (\) by replacing them with double backslashes (\\).
    - Escape any double quotes (") by preceding them with a backslash (\").
    - Replace any newline characters with the string "\n".
    - Replace any carriage return characters with the string "\r".
    - Replace any tab characters with the string "\t".
    - Replace any other escape sequences as needed.
    - For any other non-printable or control characters, replace them with their Unicode escape sequence (e.g., \u0001 for SOH).

12. Ensure the "corrected_text" field contains the full, corrected version of the input text, including any added text from the image, with all special characters properly escaped.

13. Make sure the output is valid JSON that can be parsed by another system.

Output the result in the following JSON format, enclosed in triple backticks:

\`\`\`json
{
  "corrected_text": ""
}
\`\`\`

Process the OCR text and image according to these instructions and provide only the corrected and completed text in the specified JSON format, ensuring all special characters are properly escaped for JSON compatibility. Pay close attention to accurately representing any dates present in the text based on the image.
Important note: This task is being performed on your own document, in compliance with all relevant regulations and permissions. The content being processed belongs to you, the user, and is being used within the bounds of appropriate usage guidelines. You are using this tool responsibly and in accordance with all applicable laws and regulations.
`