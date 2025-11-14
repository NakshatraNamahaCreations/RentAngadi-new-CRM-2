

const compressImageToBase64 = async (url, maxSize = 500, quality = 1) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    return await new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");

        const scale = maxSize / Math.max(img.width, img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
    });
  } catch (err) {
    console.log("compress failed", err);
    return null;
  }
}

export { compressImageToBase64 }