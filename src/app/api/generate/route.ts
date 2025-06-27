import { createCanvas, CanvasRenderingContext2D, loadImage } from 'canvas';
import { NextRequest, NextResponse } from 'next/server';



interface ImageGenerationRequest {
    text: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold' | 'lighter';
    customImage?: string;
}

interface ImageGenerationResponse {
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body: ImageGenerationRequest = await request.json();

        let {
            text,
            fontFamily = 'Arial',
            fontSize = 48,
            color = '#000000',
            backgroundColor = '#ffffff',
            width = 800,
            height = 400,
            textAlign = 'center',
            fontWeight = 'normal',
            customImage
        } = body;

        // Validate required fields
        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required' } as ImageGenerationResponse,
                { status: 400 }
            );
        }

        console.log(customImage);
        if (customImage) {
            const image = await loadImage(customImage);
            height = image.height;
            width = image.width;
            const imageCanvas = createCanvas(width, height);
            const ctx = imageCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = textAlign === 'center' ? imageCanvas.width / 2 :
                textAlign === 'right' ? imageCanvas.width - 20 : 20;
            const textY = imageCanvas.height / 2;

            ctx.fillText(text, textX, textY);

            const buffer = imageCanvas.toBuffer('image/png');
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=31536000',
                },
            });
        }



        // Validate dimensions
        if (width < 50 || width > 2000 || height < 50 || height > 2000) {
            return NextResponse.json(
                { error: 'Width and height must be between 50 and 2000 pixels' } as ImageGenerationResponse,
                { status: 400 }
            );
        }

        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

        // Set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Configure text styling
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'middle';

        // Handle text wrapping for long text
        const maxWidth = width - 40; // 20px padding on each side
        const lines = wrapText(ctx, text, maxWidth);

        console.log(ctx);
        // Calculate starting Y position for centered text
        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        const startY = (height - totalTextHeight) / 2 + lineHeight / 2;

        // Draw each line
        lines.forEach((line: string, index: number) => {
            const y = startY + (index * lineHeight);
            const x = textAlign === 'center' ? width / 2 :
                textAlign === 'right' ? width - 20 : 20;

            ctx.fillText(line, x, y);
        });

        // Convert to buffer
        const buffer = canvas.toBuffer('image/png');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
        });

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' } as ImageGenerationResponse,
            { status: 500 }
        );
    }
}

// Helper function to wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;

        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}