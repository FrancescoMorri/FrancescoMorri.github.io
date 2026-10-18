/*
 * Load this file with a normal script tag. It exposes window.Pixelate.
 *
 * const source = await Pixelate.loadImage(fileInput.files[0]);
 * const pattern = Pixelate.process(source, { factor: 4, threshold: 128, angle: 0 });
 * Pixelate.drawGrid(gridCanvas, pattern);
 * Pixelate.drawColors(colorCanvas, pattern, {
 *   blackColor: "darkgreen", whiteColor: "lightyellow"
 * });
 *
 * Reuse source when controls change. Reuse pattern when only colors change.
 * pattern.data contains row-major cells: 0 = black, 255 = white.
 * pattern.width and pattern.height give the cell counts after cropping.
 * Positive angles rotate counterclockwise. Factor must be an integer >= 1.
 * Threshold accepts numbers from 0 to 255. Values >= threshold become white.
 * Canvas sizes use 16 pixels per cell. Preserve their aspect ratio with CSS.
 * Browser image decoding can differ from Pillow for profiles and lossy formats.
 */
(function (root) {
  "use strict";

  async function loadImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      // Treat transparency as white, as on the pattern background.
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, canvas.width, canvas.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const clamp = (v, max) => Math.max(0, Math.min(max, v));

  function cubic(a, b, c, d, t) {
    return b + t * (-a + c + t * (2 * (a - b) + c - d + t * (-a + b - c + d)));
  }

  function rotate(data, width, height, angle) {
    angle = ((angle % 360) + 360) % 360;
    if (angle === 0) return { data, width, height };
    if (angle % 90 === 0) {
      const w = angle === 180 ? width : height;
      const h = angle === 180 ? height : width;
      const out = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const sx = angle === 90 ? width - 1 - y : angle === 180 ? width - 1 - x : y;
          const sy = angle === 90 ? x : angle === 180 ? height - 1 - y : height - 1 - x;
          out[y * w + x] = data[sy * width + sx];
        }
      }
      return { data: out, width: w, height: h };
    }
    // Match Pillow's expanded inverse affine transform and bicubic sampling.
    const radians = -angle * Math.PI / 180;
    const a = Number(Math.cos(radians).toFixed(15));
    const b = Number(Math.sin(radians).toFixed(15));
    const d = -b;
    let c = width / 2 - a * width / 2 - b * height / 2;
    let f = height / 2 - d * width / 2 - a * height / 2;
    const corners = [[0, 0], [width, 0], [width, height], [0, height]];
    const xs = corners.map(([x, y]) => a * x + b * y + c);
    const ys = corners.map(([x, y]) => d * x + a * y + f);
    const w = Math.ceil(Math.max(...xs)) - Math.floor(Math.min(...xs));
    const h = Math.ceil(Math.max(...ys)) - Math.floor(Math.min(...ys));
    c += a * (width - w) / 2 + b * (height - h) / 2;
    f += d * (width - w) / 2 + a * (height - h) / 2;
    const out = new Uint8Array(w * h);
    out.fill(255);
    for (let y = 0; y < h; y++) {
      let sx = a * 0.5 + b * (y + 0.5) + c;
      let sy = d * 0.5 + a * (y + 0.5) + f;
      for (let x = 0; x < w; x++, sx += a, sy += d) {
        if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
        const ix = Math.floor(sx - 0.5);
        const iy = Math.floor(sy - 0.5);
        const tx = sx - 0.5 - ix;
        const ty = sy - 0.5 - iy;
        const rows = [];
        for (let j = -1; j <= 2; j++) {
          const offset = clamp(iy + j, height - 1) * width;
          rows.push(cubic(
            data[offset + clamp(ix - 1, width - 1)],
            data[offset + clamp(ix, width - 1)],
            data[offset + clamp(ix + 1, width - 1)],
            data[offset + clamp(ix + 2, width - 1)], tx
          ));
        }
        out[y * w + x] = Math.trunc(clamp(cubic(...rows, ty), 255));
      }
    }
    return { data: out, width: w, height: h };
  }

  function boxResize(data, width, height, w, h) {
    // Pillow uses two passes with 22-bit weights and rounding after each pass.
    function pass(input, iw, ih, size, horizontal) {
      const length = horizontal ? iw : ih;
      if (length === size) return input;
      const ow = horizontal ? size : iw;
      const oh = horizontal ? ih : size;
      const out = new Uint8Array(ow * oh);
      const scale = length / size;
      for (let n = 0; n < size; n++) {
        const center = (n + 0.5) * scale;
        const start = Math.max(0, Math.trunc(center - scale / 2 + 0.5));
        const end = Math.min(length, Math.trunc(center + scale / 2 + 0.5));
        const selected = [];
        for (let k = start; k < end; k++) {
          const distance = (k - center + 0.5) / scale;
          if (distance > -0.5 && distance <= 0.5) selected.push(k);
        }
        const weight = Math.round(4194304 / selected.length);
        for (let line = 0; line < (horizontal ? ih : iw); line++) {
          let sum = 2097152;
          for (const k of selected) {
            sum += input[horizontal ? line * iw + k : k * iw + line] * weight;
          }
          out[horizontal ? line * ow + n : n * ow + line] = clamp(Math.floor(sum / 4194304), 255);
        }
      }
      return out;
    }
    return pass(pass(data, width, height, w, true), w, height, h, false);
  }

  function process(source, { factor = 4, threshold = 128, angle = 0 } = {}) {
    if (!Number.isInteger(factor) || factor < 1) {
      throw new RangeError("Factor must be an integer of at least 1.");
    }
    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 255) {
      throw new RangeError("Threshold must be between 0 and 255.");
    }
    if (!Number.isFinite(angle)) throw new RangeError("Angle must be a finite number.");
    const { width, height, data } = source;
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 ||
        !data || data.length !== width * height * 4) {
      throw new TypeError("Source must contain a width, a height, and RGBA pixel data.");
    }
    const gray = new Uint8Array(width * height);
    for (let i = 0; i < gray.length; i++) {
      const p = i * 4;
      const alpha = data[p + 3] / 255;
      const r = Math.round(data[p] * alpha + 255 * (1 - alpha));
      const g = Math.round(data[p + 1] * alpha + 255 * (1 - alpha));
      const b = Math.round(data[p + 2] * alpha + 255 * (1 - alpha));
      gray[i] = Math.floor((19595 * r + 38470 * g + 7471 * b + 32768) / 65536);
    }
    const rotated = rotate(gray, width, height, angle);
    const w = Math.max(1, Math.floor(rotated.width / factor));
    const h = Math.max(1, Math.floor(rotated.height / factor));
    const small = boxResize(rotated.data, rotated.width, rotated.height, w, h);
    let left = w, top = h, right = -1, bottom = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        small[i] = small[i] >= threshold ? 255 : 0;
        if (small[i] === 0) {
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
      }
    }
    const hasBlack = right >= 0;
    left = hasBlack ? Math.max(0, left - 1) : 0;
    top = hasBlack ? Math.max(0, top - 1) : 0;
    right = hasBlack ? Math.min(w - 1, right + 1) : w - 1;
    bottom = hasBlack ? Math.min(h - 1, bottom + 1) : h - 1;
    const outWidth = right - left + 1;
    const outHeight = bottom - top + 1;
    const out = new Uint8Array(outWidth * outHeight);
    for (let y = 0; y < outHeight; y++) {
      out.set(small.subarray((y + top) * w + left, (y + top) * w + left + outWidth), y * outWidth);
    }
    return { width: outWidth, height: outHeight, data: out, hasBlack };
  }

  function draw(canvas, pattern, blackColor, whiteColor, cellSize, grid) {
    if (!Number.isInteger(cellSize) || cellSize < 2) {
      throw new RangeError("Cell size must be an integer of at least 2.");
    }
    canvas.width = pattern.width * cellSize;
    canvas.height = pattern.height * cellSize;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = whiteColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = blackColor;
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x < pattern.width; x++) {
        if (pattern.data[y * pattern.width + x] === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    if (grid) {
      const displayWidth = canvas.getBoundingClientRect().width || canvas.width;
      const lineWidth = Math.max(1, canvas.width / displayWidth);
      ctx.fillStyle = "#808080";
      for (let x = 0; x <= pattern.width; x++) {
        const width = lineWidth * (x % 5 === 0 ? 3 : 1);
        ctx.fillRect(x * cellSize - width / 2, 0, width, canvas.height);
      }
      for (let y = 0; y <= pattern.height; y++) {
        const width = lineWidth * (y % 5 === 0 ? 3 : 1);
        ctx.fillRect(0, y * cellSize - width / 2, canvas.width, width);
      }
    }
  }

  function drawGrid(canvas, pattern, { cellSize = 16 } = {}) {
    draw(canvas, pattern, "black", "white", cellSize, true);
  }

  function drawColors(canvas, pattern, {
    blackColor = "darkgreen", whiteColor = "lightyellow", cellSize = 16
  } = {}) {
    draw(canvas, pattern, blackColor, whiteColor, cellSize, false);
  }

  root.Pixelate = { loadImage, process, drawGrid, drawColors };
})(globalThis);
