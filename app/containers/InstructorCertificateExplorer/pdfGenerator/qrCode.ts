import QRCode from 'qrcode';

export async function createQRCode(url: string): Promise<ArrayBuffer> {
  return QRCode.toDataURL(url)
    .then(async dataUrl => {
      console.log(dataUrl);
      const res = await fetch(dataUrl);
      const bytes = await res.arrayBuffer();
      return bytes;
    })
    .catch(err => {
      console.error(err);
      return null;
    });
}
