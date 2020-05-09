import { createCanvas, loadImage } from "canvas";
import { GenerateWallpaperRequest } from "./model";

function shuffle(a: any[]) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const generateWallpaper = async (
  images: string[],
  options: GenerateWallpaperRequest
) => {
  const canvasWidth = options.width || 2560;
  const canvasHeight = options.height || 1600;
  const tiling = options.tiling || 0;
  // const compressed = options.compressed || false;
  const gap = options.gap || 0;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  const imagesToUse = shuffle(images);

  const width = canvasWidth / tiling;
  const height = width;

  let xpos = 0;
  let ypos = 0;

  const renderObjects = [];

  for (const coverImage of imagesToUse) {
    // console.log("Render album", {
    // 	xpos,
    // 	ypos,
    // 	width,
    // 	height,
    // 	canvasWidth,
    // 	canvasHeight
    // });
    if (ypos >= canvasHeight) {
      // console.log(`Render done with ${imageCounter} images`);
      break;
    }
    if (coverImage) {
      renderObjects.push({
        url: coverImage,
        xpos,
        ypos,
        width,
        height,
      });
      // loadAndRender(album, ctx, xpos, ypos, width, height, imageCounter);
      if (xpos >= canvasWidth - width) {
        // console.log("next row");
        xpos = 0;
        ypos = ypos + height + gap;
      } else {
        xpos += width + gap;
      }
    }
  }

  console.log("Using", renderObjects.length, "images");

  await Promise.all(
    renderObjects.map((o) =>
      loadAndRender(o.url, ctx, o.xpos, o.ypos, o.width, o.height)
    )
  );

  const base64Data = canvas.toDataURL().replace(/^data:image\/png;base64,/, "");

  return {
    preview: canvas.toDataURL("image/jpeg", 0.8),
    base64: base64Data,
  };
};

const loadAndRender = async (
  imageUrl: any,
  ctx: any,
  xpos: number,
  ypos: number,
  width: number,
  height: number
) => {
  try {
    const image = await loadImage(imageUrl);
    ctx.drawImage(image, xpos, ypos, width, height);
  } catch (e) {
    return null;
  }
};
