export const prompt = `I have extracted the following raw text from an image. Please clean, structure, and align it in a visually appealing and readable format. Ensure:

- Proper line breaks, indentation, and spacing
- Use of headers, bold titles, and bullet points (if applicable)
- Align elements like prices, quantities, and dates in tabular or list format
- Maintain original intent and hierarchy of the content
- Make it look like a professionally formatted [document/poster/receipt/summary/medicine bill/etc.]
- Only remove unnecessary elements, do not add any introductory phrases like 'here is my answer...' or similar. Please return the arranged text in plain text format only with proper spacing, alignment, and line breaks. Avoid using Markdown or HTML tags. The output will be printed on a canvas.
`;