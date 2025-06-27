export const prompt = `I have extracted the following raw text from an image. Please clean, structure, and align it in a visually appealing and readable format. Ensure:

- Proper line breaks, indentation, and spacing
- Use of headers, bold titles, and bullet points (if applicable)
- Align elements like prices, quantities, and dates in tabular or list format
- Maintain original intent and hierarchy of the content
- Make it look like a professionally formatted [document/poster/receipt/summary/medicine bill/etc.]
- Only remove unnecessary elements, do not add any introductory phrases like 'here is my answer...' or similar. Please return the arranged text in plain text format only with proper spacing, alignment, and line breaks. Avoid using Markdown or HTML tags. The output will be printed on a canvas.
`;



export const imagePresets = [
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Reel', width: 1080, height: 1920 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'Pinterest Pin', width: 1000, height: 1500 },
    { name: 'TikTok Video', width: 1080, height: 1920 },
    { name: 'Custom', width: 800, height: 400 },
];

export const images = [
    { id: 1, url: 'https://picsum.photos/id/1/800/600' },
    { id: 2, url: 'https://picsum.photos/id/10/800/600' },
    { id: 3, url: 'https://picsum.photos/id/100/800/600' },
    { id: 4, url: 'https://picsum.photos/id/1000/800/600' },
    { id: 5, url: 'https://picsum.photos/id/1005/800/600' },
    { id: 6, url: 'https://picsum.photos/id/1010/800/600' },
    { id: 7, url: 'https://picsum.photos/id/1015/800/600' },
    { id: 8, url: 'https://picsum.photos/id/1020/800/600' },
    { id: 9, url: 'https://picsum.photos/id/1025/800/600' },
    { id: 10, url: 'https://picsum.photos/id/1030/800/600' },
    { id: 11, url: 'https://picsum.photos/id/1035/800/600' },
    { id: 12, url: 'https://picsum.photos/id/1040/800/600' },
    { id: 13, url: 'https://picsum.photos/id/1045/800/600' },
    { id: 14, url: 'https://picsum.photos/id/1050/800/600' },
    { id: 15, url: 'https://picsum.photos/id/1055/800/600' },
    { id: 16, url: 'https://picsum.photos/id/1060/800/600' },
    { id: 17, url: 'https://picsum.photos/id/1065/800/600' },
    { id: 18, url: 'https://picsum.photos/id/1070/800/600' },
    { id: 19, url: 'https://picsum.photos/id/1075/800/600' },
    { id: 20, url: 'https://picsum.photos/id/1080/800/600' },
    { id: 21, url:'https://images.unsplash.com/photo-1750860306157-e6783c3e92bc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
];