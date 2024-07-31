export function extractJsonFromMarkdown(mdContent: string) {
    // Regular expression to match a JSON block within Markdown
    const jsonRegex = /```json([\s\S]*?)```/;

    // Extract JSON string
    const match = mdContent.match(jsonRegex);

    if (match && match[1]) {
        // Clean up whitespace and parse JSON
        try {
            const jsonString = match[1].trim();
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            return null;
        }
    } else {
        try {
            return JSON.parse(mdContent);
        } catch (e) {
            console.error('No JSON content found');
            return null;
        }
    }
}

export function removeNullValues(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj
            .map(item => removeNullValues(item))
            .filter(item => item !== null);
    }

    if (typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const value = removeNullValues(obj[key]);
            if (value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {} as any);
    }

    return obj;
}