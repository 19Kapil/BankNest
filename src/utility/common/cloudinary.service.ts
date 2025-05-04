import { Injectable } from '@nestjs/common';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  // Upload a photo to Cloudinary
  async uploadPhoto(filePath: Buffer, userId: string): Promise<string> {
    try {
      const uploadResult = await new Promise<string>((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
          {
            folder: `user_kyc/${userId}`, // Folder structure by userId
            use_filename: true,
            unique_filename: false,
            resource_type: 'auto', // Automatically determine the file type (image, video, etc.)
          },
          (error, result) => {
            if (error) {
              reject(new Error('Cloudinary upload failed: ' + error.message));
            } else if (!result || !result.secure_url) {
              reject(new Error('Cloudinary upload failed: Missing result or secure_url.'));
            } else {
              resolve(result.secure_url); // Return the URL if successful
            }
          },
        );

        // Pipe the buffer content to Cloudinary's upload stream
        stream.end(filePath);
      });

      return uploadResult; // Return the secure URL of the uploaded file
    } catch (error) {
      throw new Error('Cloudinary upload failed: ' + error.message);
    }
  }
}
