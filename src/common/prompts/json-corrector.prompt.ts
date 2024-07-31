export const JSON_CORRECTOR_PROMPT = `
You are a specialized JSON extractor and formatter. Your task is to process the following input:

{{incorrect_json}}

Follow these steps:

1. Analyze the given input thoroughly.
2. Identify and extract any JSON-like structures within the input.
3. Remove all non-JSON content, including explanations, comments, or any other text.
4. Format the extracted JSON properly, ensuring:
   - All keys and string values are enclosed in double quotes
   - All special characters within strings are properly escaped
   - The overall structure is valid JSON
5. Output the result as a single, valid JSON object or array within a code block.
6. Ensure the output can be parsed by JSON.parse() without any errors.

If no valid JSON structure is found in the input, output an empty JSON object: {}

Remember: The output should contain ONLY the formatted JSON within a code block, with no additional explanation or text.
`