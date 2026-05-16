import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * Deletes a file from the uploads directory given its URL or filename.
 * @param imageUrl The URL of the image (e.g., /api/uploads/filename.jpg) or the filename itself.
 */
export async function deleteUpload(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  try {
    // Extract filename from URL if necessary
    // Example: /api/uploads/1715856445000-image.jpg -> 1715856445000-image.jpg
    const filename = imageUrl.startsWith('/api/uploads/') 
      ? imageUrl.substring('/api/uploads/'.length) 
      : imageUrl;

    // Prevent directory traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = join(process.cwd(), 'uploads', safeFilename);

    await unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error: any) {
    // If file doesn't exist, we don't care much, but we log other errors
    if (error.code !== 'ENOENT') {
      console.error(`Error deleting file ${imageUrl}:`, error);
    }
  }
}
