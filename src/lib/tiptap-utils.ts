import { Editor } from '@tiptap/react';
import toast from 'react-hot-toast';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Checks if a mark exists in the editor schema
 *
 * @param markName - The name of the mark to check
 * @param editor - The editor instance
 */
export const isMarkInSchema = (markName: string, editor: Editor | null) =>
  editor?.schema.spec.marks.get(markName) !== undefined;

/**
 * Checks if a node exists in the editor schema
 *
 * @param nodeName - The name of the node to check
 * @param editor - The editor instance
 */
export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
  editor?.schema.spec.nodes.get(nodeName) !== undefined;

/**
 * Handles image upload with progress tracking and abort capability
 */
export const handleImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  const toastId = toast.loading('Đang tải ảnh lên...');

  try {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    // Setup progress tracking if callback provided
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress({ progress });
        }
      };
    }

    // Handle abort signal
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    const uploadPromise = new Promise<string>((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } catch (error) {
            console.log(error)
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Không thể tải ảnh lên'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };

      xhr.onabort = () => {
        reject(new Error('Upload cancelled'));
      };

      xhr.open('POST', '/api/cloudinary', true);
      xhr.send(formData);
    });

    const imageUrl = await uploadPromise;
    
    toast.dismiss(toastId);
    toast.success('Tải ảnh lên thành công');
    return imageUrl;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Không thể tải ảnh lên: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    console.error('Error uploading image:', error);
    return '/placeholder.svg';
  }
};

/**
 * Converts a File to base64 string
 */
export const convertFileToBase64 = (
  file: File,
  abortSignal?: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const abortHandler = () => {
      reader.abort();
      reject(new Error('Upload cancelled'));
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', abortHandler);
    }

    reader.onloadend = () => {
      if (abortSignal) {
        abortSignal.removeEventListener('abort', abortHandler);
      }

      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert File to base64'));
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
