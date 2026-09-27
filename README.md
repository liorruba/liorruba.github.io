# liorruba.github.io

Source for [www.liorruba.com](https://www.liorruba.com). A single static `index.html`, served by GitHub Pages.

## Images

Pages load the `.webp` versions; the original `.png`/`.jpg` files are the fallback and open in the figure lightbox.
After adding or replacing a figure, regenerate its WebP files (Pillow):

```python
from PIL import Image, ImageOps
im = Image.open('images/NAME.png').convert('RGB')
im.resize((1200, round(im.height * 1200 / im.width))).save('images/NAME.webp', quality=84, method=6)
ImageOps.fit(im, (160, 160)).save('images/NAME-thumb.webp', quality=78)   # publication-list thumbnail
```

## Animated research clips

Any research figure can be swapped for a short looping clip; see the comment at the top of the Research
section in `index.html`. Clips play only while on screen, and visitors who prefer reduced motion see the
still poster with play controls.

- Aim for 8–12 s seamless loops, about 1200 px wide, no audio.
- Export frames (e.g. matplotlib `FuncAnimation`, or `savefig` in a loop to `frames/%04d.png`), then encode both formats:

```sh
ffmpeg -framerate 30 -i frames/%04d.png -vf "scale=1200:-2" -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart -an videos/NAME.mp4
ffmpeg -framerate 30 -i frames/%04d.png -vf "scale=1200:-2" -c:v libvpx-vp9 -b:v 0 -crf 36 -an videos/NAME.webm
```

Each should come out around 0.5–2 MB. Prefer this over GIF, which is 10–20× larger for the same clip.

### Sources

`animations/` holds the source for each clip: a self-contained canvas page (open it in a browser to preview
the loop live) and `render-frames.js`, which renders it to PNG frames with Playwright:

```sh
cd animations && node render-frames.js all dunes-wind 20.4   # name, loop length in s -> frames_dunes-wind/0000.png ...
cd animations && node render-frames.js all cold-traps 20
cd animations && node render-frames.js all autoencoder 20
cd animations && node render-frames.js all ripple-regime 40
cd animations && node render-frames.js all dune-detection 24
```

Then encode with the ffmpeg command above and copy the MP4 and a poster frame into `videos/`.
