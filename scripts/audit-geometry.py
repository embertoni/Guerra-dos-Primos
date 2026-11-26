"""Audit clean-source fidelity and SVG interiors; render review artifacts."""
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, '.tools/python')
import cv2
import numpy as np
from PIL import Image, ImageDraw
from board_geometry import rasterize, path_polygons

ROOT = Path(__file__).resolve().parent.parent


def read_json(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8-sig'))


catalog = read_json('packages/shared/src/board/catalog.json')
geometry = read_json('packages/shared/src/board/geometry.json')
report = read_json('docs/mapa-auditoria.json')
config = read_json('scripts/board-trace-config.json')
source_bytes = (ROOT / report['source']).read_bytes()
assert hashlib.sha256(source_bytes).hexdigest() == report['sourceSha256']
assert source_bytes == (ROOT / 'apps/web/public/assets/tabuleiro-original.png').read_bytes()
source = np.array(Image.open(ROOT / report['source']).convert('RGB'))
size = (catalog['height'], catalog['width'])
interiors, regions, overlaps = {}, {}, []
preview = np.full((*size, 3), (9, 101, 142), np.uint8)

for territory in catalog['territories']:
    territory_id = territory['id']
    mask = rasterize(geometry[territory_id], size)
    # Exclude one pixel at shared raster boundaries from the overlap check.
    interior = cv2.erode(mask, np.ones((3, 3), np.uint8))
    for other_id, other in interiors.items():
        count = int(np.count_nonzero(interior & other))
        if count:
            overlaps.append([other_id, territory_id, count])
    interiors[territory_id] = interior
    regions[territory_id] = mask
    color = next(c['baseColor'] for c in catalog['continents']
                 if c['id'] == territory['continentId'])
    preview[mask > 0] = tuple(int(color[i:i + 2], 16) for i in (1, 3, 5))
    for path in geometry[territory_id]:
        polygons = [np.rint(p).astype(np.int32) for p in path_polygons(path)]
        cv2.polylines(preview, polygons, True, (24, 51, 66), 1, cv2.LINE_AA)

# Recompute against the actual files, so a stale report cannot hide an edit.
# This compares colored fills, excluding the source's black lines and ocean.
for metric in report['metrics']:
    continent_id = metric['continentId']
    difference = np.abs(source.astype(np.int16) - config['colors'][continent_id])
    original = np.all(difference <= config['colorTolerance'], axis=2)
    vector = np.zeros(size, np.uint8)
    for territory in catalog['territories']:
        if territory['continentId'] == continent_id:
            vector |= regions[territory['id']]
    iou = np.count_nonzero(original & vector) / np.count_nonzero(original | vector)
    assert round(iou, 6) == metric['intersectionOverUnion'], 'Stale audit: regenerate geometry'
    assert iou >= .995, f'Insufficient source coverage: {metric}'

assert not overlaps, f'Overlapping territory interiors: {overlaps}'
image = Image.fromarray(preview)
draw = ImageDraw.Draw(image)
for territory in catalog['territories']:
    position = territory['labelPosition']
    draw.text((position['x'], position['y']), str(territory['number']),
              fill='white', anchor='mm', font_size=28, stroke_width=1, stroke_fill='#152b3b')
image.save(ROOT / 'docs/mapa-vetor.png')

# Diagnostic colors show island membership rather than continent/player colors.
review = source.copy()
review_colors = {
    'oceania-01': (149, 87, 217), 'oceania-02': (45, 130, 231),
    'oceania-03': (243, 143, 46), 'oceania-04': (28, 185, 119),
}
for territory_id, color in review_colors.items():
    review[regions[territory_id] > 0] = color
islands = Image.fromarray(review)
draw = ImageDraw.Draw(islands)
for territory in catalog['territories']:
    if territory['continentId'] == 'oceania':
        position = territory['labelPosition']
        draw.text((position['x'], position['y']), str(territory['number']),
                  anchor='mm', font_size=24, fill='white', stroke_width=2, stroke_fill='black')
for island in report['islands']:
    if island['continentId'] == 'oceania' and island['center'][1] > 850:
        x, y = island['center']
        draw.text((x - 12, y - 18), str(island['number']), anchor='mm', font_size=20,
                  fill='white', stroke_width=2, stroke_fill='black')
islands.crop((1520, 540, 2000, 1000)).resize((960, 920)).save(ROOT / 'docs/ilhas-oceania.png')
print('Interior overlaps:', overlaps)
print('Source fill IoU:', [(m['continentId'], m['intersectionOverUnion']) for m in report['metrics']])
