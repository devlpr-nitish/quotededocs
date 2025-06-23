import Tesseract from "tesseract.js";

const SUPPORTED_LANGUAGES = [
    'eng', // English
    'rus', // Russian
    'chi_sim', // Chinese Simplified
    'chi_tra', // Chinese Traditional
    'jpn', // Japanese
    'ara', // Arabic
    'hin', // Hindi
    'mal', // Malayalam
    'tam', // Tamil
    'tel', // Telugu
    'kan', // Kannada
    'ben', // Bengali
    'guj', // Gujarati
    'pan', // Punjabi
    'urd', // Urdu
    'nep', // Nepali
];

export async function extractTextFromImageAllLanguages(file: File): Promise<string> {
    try {
        // Join all supported languages with '+' separator
        const allLanguages = SUPPORTED_LANGUAGES.join('+');

        const result = await Tesseract.recognize(file, allLanguages, {
            logger: (m) => console.log(m),
        });

        return result.data.text;
    } catch (error) {
        console.error('OCR failed:', error);
        throw new Error('Failed to extract text from image.');
    }
}