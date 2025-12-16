"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
    const handleUpload = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any) => {
            onChange(result.info.secure_url);
        },
        [onChange]
    );

    return (
        <CldUploadWidget
            uploadPreset="portfolio_preset" // Assuming a strict preset name or unsigned preset
            options={{
                maxFiles: 1
            }}
            onSuccess={handleUpload}
        >
            {({ open }) => {
                return (
                    <div
                        onClick={() => open?.()}
                        className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-gray-300 flex flex-col justify-center items-center h-64 w-full rounded-lg bg-gray-50 bg-cover"
                    >
                        {value ? (
                            <div className="relative w-full h-full">
                                <Image fill style={{ objectFit: 'cover' }} src={value} alt="Upload" className="rounded-lg" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); onChange("") }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                                    type="button" // Important to prevent form submission
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-neutral-600">
                                <ImagePlus size={50} />
                                <div className="font-semibold text-lg">Click to Upload</div>
                            </div>
                        )}
                    </div>
                );
            }}
        </CldUploadWidget>
    );
};

export default ImageUpload;
