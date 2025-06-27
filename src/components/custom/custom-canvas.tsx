import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { images } from "@/lib/constants";


export default function CustomCanvas({ setCustomImage, handleGenerateDesign, isGenerating, isExtracting }: { setCustomImage: (image: string) => void, handleGenerateDesign: ({customImage}: {customImage: string}) => void, isGenerating: boolean, isExtracting: boolean }) {
    return (
        <div className="space-y-4 max-w-5xl mx-auto my-12 rounded-md ">
            <div className="flex items-center justify-center">
                <h3 className="text-lg font-medium text-foreground">Select a canvas for your design</h3>
            </div>
            <div className="max-h-[600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto hide-scrollbar rounded-md shadow-lg">
                {images.map((image) => (
                    <ImageCard key={image.id} image={image} setCustomImage={setCustomImage} handleGenerateDesign={handleGenerateDesign} isGenerating={isGenerating} isExtracting={isExtracting} />
                ))}
            </div>
        </div>
    )
}


const ImageCard = ({ image, setCustomImage, handleGenerateDesign, isGenerating, isExtracting }: { image: { id: number, url: string }, setCustomImage: (image: string) => void, handleGenerateDesign: ({customImage}: {customImage: string}) => void, isGenerating: boolean, isExtracting: boolean }) => {
    return (
        <div className="flex gap-4 w-full h-full cursor-pointer">
            <Dialog>
                <DialogTrigger asChild>
                    <Image src={image.url} alt={`Image ${image.id}`} width={800} height={600} className="w-full h-full object-cover rounded-md" />
                </DialogTrigger>
                
                <DialogContent  className="max-w-5xl">
                    <Image src={image.url} alt={`Image ${image.id}`} width={800} height={600} className="w-full h-full object-cover" />
                    <div className="flex items-center justify-center">
                        <Button
                        onClick={() => {
                            setCustomImage(image.url);
                            handleGenerateDesign({customImage: image.url});
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                        disabled={isGenerating || isExtracting}
                        >
                           {isGenerating ? "Generating..." : isExtracting ? "Extracting..." : "Generate Design"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            
        </div>
    )
}