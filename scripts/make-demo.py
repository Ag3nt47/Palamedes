"""Make the README GIF from real, unmodified app captures (requires Pillow)."""
from pathlib import Path
from PIL import Image

media = Path(__file__).resolve().parents[1] / 'docs' / 'media'
names = ['calculator', 'graphing', 'surface', 'solver', 'ml-lab', 'training', 'sandbox', 'handbook', 'settings']
frames = []
for name in names:
    image = Image.open(media / f'{name}.png').convert('RGB')
    image.thumbnail((1120, 770), Image.Resampling.LANCZOS)
    frames.append(image.quantize(colors=128, method=Image.Quantize.MEDIANCUT))
frames[0].save(media / 'palamedes-demo.gif', save_all=True, append_images=frames[1:], duration=[2400, 1800, 2000, 2600, 2300, 1800, 2200, 2400, 1800], loop=0, optimize=True, disposal=2)
print(f"Created {media / 'palamedes-demo.gif'}")
