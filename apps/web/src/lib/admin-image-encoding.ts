export interface EncodedAdminImage {
  blob: Blob;
  contentType: 'image/webp' | 'image/jpeg';
}

export async function encodeAdminImage(canvas: HTMLCanvasElement, quality = 0.88): Promise<EncodedAdminImage> {
  const webp = await encodeCanvas(canvas, 'image/webp', quality);
  if (webp?.type === 'image/webp') return { blob: webp, contentType: 'image/webp' };

  const jpegCanvas = document.createElement('canvas');
  jpegCanvas.width = canvas.width;
  jpegCanvas.height = canvas.height;
  const jpegContext = jpegCanvas.getContext('2d');
  if (!jpegContext) throw new Error('No se pudo preparar la imagen.');
  jpegContext.fillStyle = '#ffffff';
  jpegContext.fillRect(0, 0, jpegCanvas.width, jpegCanvas.height);
  jpegContext.drawImage(canvas, 0, 0);
  const jpeg = await encodeCanvas(jpegCanvas, 'image/jpeg', quality);
  if (jpeg?.type === 'image/jpeg') return { blob: jpeg, contentType: 'image/jpeg' };

  throw new Error('Este navegador no pudo preparar la imagen. Prueba con otro navegador o con un archivo JPG.');
}

function encodeCanvas(canvas: HTMLCanvasElement, type: 'image/webp' | 'image/jpeg', quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(resolve, type, quality);
    } catch {
      resolve(null);
    }
  });
}
