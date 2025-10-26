import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const loadResult = reader.result;
        if (typeof loadResult === 'string') {
          resolve(loadResult);
        } else {
          reject(new Error('File reader did not return a string result.'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  }

  extractBase64Payload(dataUrl: string): string {
    const commaIndex = dataUrl.indexOf(',');
    return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  }

  toDataUrl(base64: string, mimeType?: string): string {
    if (!base64) {
      return '';
    }
    if (base64.startsWith('data:')) {
      return base64;
    }
    const resolvedMime = mimeType ?? this.detectMimeType(base64);
    return `data:${resolvedMime};base64,${base64}`;
  }

  resetFileInput(fileInput?: HTMLInputElement): void {
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private detectMimeType(base64: string): string {
    const signatures: Record<string, string> = {
      '/9j/': 'image/jpeg',
      'iVBOR': 'image/png',
      'R0lGOD': 'image/gif',
      'Qk': 'image/bmp'
    };

    const signature = Object.keys(signatures).find(sig => base64.startsWith(sig));
    return signature ? signatures[signature] : 'image/png';
  }
}
