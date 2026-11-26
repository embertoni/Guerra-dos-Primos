"""Trace the clean raster, preserving the existing 42 stable IDs and numbers.

Run from the repository root. Optional tooling: OpenCV in .tools/python.
Configuration, primary seeds and raster colors: board-trace-config.json.
Only geometry/version/colors are updated; territory identity and numbers are not
inferred, renumbered or copied from the image.
"""
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, '.tools/python')
import cv2
import numpy as np
from PIL import Image
from board_geometry import rasterize, trace_mask

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / 'scripts/board-trace-config.json').read_text(encoding='utf-8'))
CATALOG_PATH = ROOT / 'packages/shared/src/board/catalog.json'
CATALOG = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))
SOURCE = ROOT / CONFIG['source']
RGB = np.array(Image.open(SOURCE).convert('RGB'))
HEIGHT, WIDTH = RGB.shape[:2]
if [WIDTH, HEIGHT] != CONFIG['size'] or (WIDTH, HEIGHT) != (CATALOG['width'], CATALOG['height']):
    raise ValueError('Source dimensions changed: register the map before tracing.')


def seed_component(labels, territory, mask):
    point = CONFIG['seeds'].get(territory['id'], list(territory['labelPosition'].values()))
    x, y = point
    if labels[y, x]:
        return int(labels[y, x])
    # A seed may lie on a black outline, never jump farther than 12 source px.
    yy, xx = np.where(mask[max(0, y - 12):y + 13, max(0, x - 12):x + 13])
    if len(xx) == 0:
        raise ValueError(f'No land near seed: {territory["id"]}')
    xx, yy = xx + max(0, x - 12), yy + max(0, y - 12)
    nearest = np.argmin((xx - x) ** 2 + (yy - y) ** 2)
    return int(labels[yy[nearest], xx[nearest]])


def split_seeded_component(component, territories):
    # One-pixel gaps in a thin line can connect two countries. Erode only an
    # ambiguous body, find distinct cores, then restore ALL original land pixels
    # by nearest core distance. No manual partition clips a coastline.
    for radius in (1, 2):
        core = cv2.erode(component, np.ones((2 * radius + 1,) * 2, np.uint8))
        _, core_labels = cv2.connectedComponents(core, connectivity=4)
        seeds = [seed_component(core_labels, territory, core) for territory in territories]
        if len(set(seeds)) != len(seeds):
            continue
        distances = np.stack([
            cv2.distanceTransform((core_labels != seed).astype(np.uint8), cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
            for seed in seeds
        ])
        nearest = np.argmin(distances, axis=0)
        return {territory['id']: ((nearest == index) & (component > 0)).astype(np.uint8)
                for index, territory in enumerate(territories)}, radius
    raise ValueError('Unresolved open boundary: ' + ', '.join(t['id'] for t in territories))


geometry, satellites, repairs, metrics = {}, [], [], []
for continent in CATALOG['continents']:
    continent_id = continent['id']
    color = CONFIG['colors'][continent_id]
    # Near-identical fill shades occur in the edited PNG. Preserve dark borders
    # and water, while avoiding hundreds of false holes from one-channel noise.
    mask = np.all(np.abs(RGB.astype(np.int16) - color) <= CONFIG['colorTolerance'], axis=2).astype(np.uint8)
    count, labels, stats, centers = cv2.connectedComponentsWithStats(mask, connectivity=4)
    territories = [t for t in CATALOG['territories'] if t['continentId'] == continent_id]
    primary_components = {}
    for territory in territories:
        component_id = seed_component(labels, territory, mask)
        primary_components.setdefault(component_id, []).append(territory)
    primary = {}
    for component_id, members in primary_components.items():
        component = (labels == component_id).astype(np.uint8)
        if len(members) == 1:
            primary[members[0]['id']] = component
        else:
            split, radius = split_seeded_component(component, members)
            primary.update(split)
            repairs.append({'territories': [t['id'] for t in members], 'erosionRadiusPixels': radius,
                            'method': 'distinct cores + nearest-core reconstruction within original land'})
    distances = {id: cv2.distanceTransform((body == 0).astype(np.uint8), cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
                 for id, body in primary.items()}
    assigned = {id: body.copy() for id, body in primary.items()}
    ignored_pixels = 0
    for component_id in range(1, count):
        if component_id in primary_components:
            continue
        area = int(stats[component_id, cv2.CC_STAT_AREA])
        if area < CONFIG['minimumComponentPixels']:
            ignored_pixels += area
            continue
        island = labels == component_id
        candidates = sorted((float(distance[island].min()), id) for id, distance in distances.items())
        distance, owner = candidates[0]
        assigned[owner][island] = 1
        x, y, width, height = map(int, stats[component_id, :4])
        satellites.append({'continentId': continent_id, 'bounds': [x, y, width, height], 'pixels': area,
                           'center': [round(float(n), 2) for n in centers[component_id]], 'territoryId': owner,
                           'number': next(t['number'] for t in territories if t['id'] == owner),
                           'distancePixels': round(distance, 3), 'secondTerritoryId': candidates[1][1],
                           'secondDistancePixels': round(candidates[1][0], 3),
                           'nearTie': candidates[1][0] - distance < 2})
    union = np.zeros_like(mask)
    for id, region in assigned.items():
        paths = trace_mask(region, CONFIG['simplificationPixels'])
        if not paths:
            raise ValueError(f'Empty territory: {id}')
        geometry[id] = paths
        union |= rasterize(paths, mask.shape)
    intersection = int(np.count_nonzero(union & mask))
    total_union = int(np.count_nonzero(union | mask))
    metrics.append({'continentId': continent_id, 'sourceFillPixels': int(mask.sum()),
                    'vectorFillPixels': int(union.sum()), 'intersectionOverUnion': round(intersection / total_union, 6),
                    'sourcePixelsMissing': int(np.count_nonzero(mask & (union == 0))),
                    'extraPixels': int(np.count_nonzero(union & (mask == 0))), 'ignoredTinyPixels': ignored_pixels})
    continent['baseColor'] = '#' + ''.join(f'{channel:02x}' for channel in color)

CATALOG['version'] = CONFIG['version']
CATALOG['referenceImage'] = '/assets/tabuleiro-original.png'
CATALOG_PATH.write_text(json.dumps(CATALOG, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'packages/shared/src/board/geometry.json').write_text(json.dumps(geometry, indent=2) + '\n', encoding='utf-8')
report = {'version': CONFIG['version'], 'source': CONFIG['source'], 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
          'size': [WIDTH, HEIGHT], 'simplificationPixels': CONFIG['simplificationPixels'],
          'colorTolerance': CONFIG['colorTolerance'],
          'islandCriterion': 'minimum Euclidean border distance to primary body, within same continent; no island chaining',
          'boundaryRepairs': repairs, 'metrics': metrics, 'islands': satellites}
(ROOT / 'docs/mapa-auditoria.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
rows = ['# Inventário visual', '', f'Referência: `{CONFIG["source"]}`; numeração e IDs preservados do catálogo anterior.', '',
        '| ID estável | Número | Continente | Paths |', '|---|---:|---|---:|']
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}">',
       f'<rect width="{WIDTH}" height="{HEIGHT}" fill="#09658e"/>']
for territory in CATALOG['territories']:
    continent = next(c for c in CATALOG['continents'] if c['id'] == territory['continentId'])
    paths = geometry[territory['id']]
    rows.append(f'| {territory["id"]} | {territory["number"]} | {continent["name"]} | {len(paths)} |')
    svg.append(f'<g id="{territory["id"]}" fill="{continent["baseColor"]}" fill-rule="evenodd" stroke="#183342" stroke-width="2">')
    for path in paths:
        svg.append(f'<path d="{path}"/>')
    svg.append('</g>')
# Labels last, matching the application's separate number layer.
for territory in CATALOG['territories']:
    position = territory['labelPosition']
    svg.append(f'<text x="{position["x"]}" y="{position["y"]}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-weight="bold" font-size="28" fill="white" stroke="#152b3b" stroke-width="1.5" paint-order="stroke">{territory["number"]}</text>')
svg.append('</svg>')
(ROOT / 'docs/tabuleiro-vetorizado.svg').write_text('\n'.join(svg) + '\n', encoding='utf-8')
(ROOT / 'docs/inventario.md').write_text('\n'.join(rows) + '\n', encoding='utf-8')
print(f'Generated {len(geometry)} territories; {len(satellites)} satellite components')
print('Repairs:', repairs)
for metric in metrics:
    print(metric)
for island in satellites:
    if island['continentId'] == 'oceania':
        print('Oceania island:', island)
