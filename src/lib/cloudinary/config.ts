import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export const uploadImage = async (file: File, folder: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            folder: folder,
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }).end(buffer);
    });
};
