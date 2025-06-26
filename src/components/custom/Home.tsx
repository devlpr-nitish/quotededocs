"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Text, Download } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { extractTextFromImageAllLanguages } from "@/lib/extractText";
import { Skeleton } from "@/components/ui/skeleton";
import generateText from "@/lib/ai-text";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

export default function HomePage() {

    // Separate state variables for each form field
    const [text, setText] = useState('Hello World!');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(24);
    const [color, setColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(400);
    const [textAlign, setTextAlign] = useState('center');
    const [fontWeight, setFontWeight] = useState('normal');
    const [image, setImage] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    const [imageUrl, setImageUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedPreset, setSelectedPreset] = useState<string>('Custom');

    const [useAi, setUseAi] = useState(false);

    // Ref for the preview section
    const previewRef = useRef<HTMLDivElement>(null);

    // Image size presets for social media platforms
    const imagePresets = [
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

    const applyPreset = (preset: { name: string; width: number; height: number }) => {
        setWidth(preset.width);
        setHeight(preset.height);
        setSelectedPreset(preset.name);
        toast.success(`Applied ${preset.name} size`);
    };


    const handleGenerateDesign = async () => {
        setIsGenerating(true);

        // Scroll to preview section
        if (previewRef.current) {
            previewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        try {
            let aiText = text;
            if (useAi) {
                aiText = await generateText(text);
                console.log(aiText);
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: aiText,
                    fontFamily,
                    fontSize,
                    color,
                    backgroundColor,
                    width,
                    height,
                    textAlign,
                    fontWeight,
                }),
            });




            if (!response.ok) {
                throw new Error('Failed to generate design');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);


            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }

            setImageUrl(url);

            // Scroll to bottom element
            setTimeout(() => {
                if (previewRef.current) {
                    previewRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    });
                }
            }, 100);

            toast.success('Design generated successfully!');
        } catch (error) {
            console.error('Error generating design:', error);
            toast.error('Failed to generate design. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };


    const downloadImage = (): void => {
        if (imageUrl) {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = `quotedocs-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const { data: session } = useSession();
    const handleAitoggle = (checked: boolean) => {
        if (checked && !session) {
            toast.error('Please sign in to use AI');
            return;
        }
        setUseAi(checked);
    }
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold text-foreground mb-4">       Convert Handwritten Text to <span className="text-primary">Beautiful</span> Designs
                </h1>
                <p className="text-muted-foreground text-sm md:text-lg mb-8">
                    Upload your handwritten image, extract text, and style it to create
                    stunning visuals to share anywhere.
                </p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
            >
                <Card className="p-6 shadow-lg">
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Upload className="text-primary" />
                            <p className="font-semibold text-foreground">Upload Handwritten Image</p>
                        </div>
                        <Input type="file" accept="image/*" onChange={(e) => {
                            setImage(e.target.files?.[0] || null);
                            if (e.target.files?.[0]) {
                                setIsExtracting(true);
                                extractTextFromImageAllLanguages(e.target.files[0]).then((text) => {
                                    setText(text);
                                    toast.success('Text extracted successfully!');
                                }).catch((error) => {
                                    toast.error('Failed to extract text from image.');
                                    console.error('OCR failed:', error);
                                }).finally(() => {
                                    setIsExtracting(false);
                                });
                            }
                        }} />

                        <div className="flex items-center gap-3">
                            <Text className="text-primary" />
                            <p className="font-semibold text-foreground">Extracted Text</p>
                        </div>
                        {isExtracting ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ) : (
                            <textarea
                                placeholder="Your extracted text will appear here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 border rounded-md resize-none min-h-[100px] bg-background text-foreground border-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                rows={4}
                            />
                        )}

                        <div className="flex items-center gap-3">
                            <Checkbox id="ai-generated" className="cursor-pointer border-primary" checked={useAi} onCheckedChange={(checked) => handleAitoggle(checked === 'indeterminate' ? false : checked)} />
                            <label htmlFor="ai-generated" className="text-sm font-medium text-foreground cursor-pointer">Use <span className="text-primary font-bold">AI</span> to align and structure the text</label>
                        </div>
                    </CardContent>
                </Card>

                <Card className="p-6 shadow-lg">
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground">Font Family</label>
                                <select className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                                    <option value="Arial">Arial</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Poppins">Poppins</option>
                                    <option value="Courier New">Courier New</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Font Size</label>
                                <Input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    min="8"
                                    max="200"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Font Weight</label>
                                <select className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="300">300</option>
                                    <option value="400">400</option>
                                    <option value="500">500</option>
                                    <option value="600">600</option>
                                    <option value="700">700</option>
                                    <option value="800">800</option>
                                    <option value="900">900</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Text Align</label>
                                <select className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                    <option value="justify">Justify</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Text Color</label>
                                <input type="color" className="w-full h-10 p-1 border border-input rounded-md bg-background" value={color} onChange={(e) => setColor(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Background Color</label>
                                <input type="color" className="w-full h-10 p-1 border border-input rounded-md bg-background" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                            </div>
                        </div>

                        {/* Image Size Presets */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Image Size Presets</label>
                            <div className="grid grid-cols-2 gap-2">
                                {imagePresets.map((preset) => (
                                    <Button
                                        key={preset.name}
                                        variant={selectedPreset === preset.name ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => applyPreset(preset)}
                                        className={`text-xs h-8${selectedPreset === preset.name ? " bg-primary hover:bg-primary/90 text-primary-foreground" : ""}`}
                                    >
                                        {preset.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground">Width</label>
                                <Input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    min="100"
                                    max="3000"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground">Height</label>
                                <Input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    min="100"
                                    max="3000"
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer" onClick={handleGenerateDesign} disabled={isGenerating || isExtracting}>
                            {isExtracting ? 'Extracting Text...' : isGenerating ? 'Generating Design...' : 'Generate Design'}
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                ref={previewRef}
                className="mt-12 max-w-5xl mx-auto text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                viewport={{ once: true }}
            
            >
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Preview</h3>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[300px] flex items-center justify-center bg-muted/50 relative">
                        {isGenerating ? (
                            <div className="space-y-4 w-full max-w-md">
                                <Skeleton className="h-64 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4 mx-auto" />
                                    <Skeleton className="h-4 w-1/2 mx-auto" />
                                </div>
                            </div>
                        ) : imageUrl ? (
                            <>
                                <button
                                    onClick={downloadImage}
                                    className="absolute top-2 right-2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors shadow-lg z-10"
                                    title="Download Image"
                                >
                                    <Download className="w-4 h-4 cursor-pointer" />
                                </button>
                                <div className="text-center">
                                    <img
                                        src={imageUrl}
                                        alt="Generated text image"
                                        className="max-w-full max-h-96 mx-auto border border-border rounded shadow-lg"
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">Generate an image to see preview</p>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="mt-12 max-w-5xl mx-auto text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
            >
            </motion.div>
        </div>
    );
}

