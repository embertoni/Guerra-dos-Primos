"""Pixel audit of path interiors; excludes a 2px boundary tolerance."""
import sys, json
sys.path.insert(0, '.tools/python')
import cv2
import numpy as np
from PIL import Image, ImageDraw
catalog=json.load(open('packages/shared/src/board/catalog.json',encoding='utf-8'))
geometry=json.load(open('packages/shared/src/board/geometry.json',encoding='utf-8'))
masks=[]
preview=Image.new('RGB',(2000,1075),'#09658e')
draw=ImageDraw.Draw(preview)
for t in catalog['territories']:
    mask=np.zeros((1075,2000),np.uint8)
    for path in geometry[t['id']]:
        points=[tuple(map(int,p.split(','))) for p in path[1:-2].split(' L')]
        cv2.fillPoly(mask,[np.array(points,np.int32)],1)
        color=next(c['baseColor'] for c in catalog['continents'] if c['id']==t['continentId'])
        draw.polygon(points,fill=color,outline='#102c40',width=2)
    masks.append(cv2.erode(mask,np.ones((5,5),np.uint8)))
    draw.text((t['labelPosition']['x'],t['labelPosition']['y']),str(t['number']),fill='white',anchor='mm',font_size=32,stroke_width=1,stroke_fill='black')
overlaps=[]
for i,a in enumerate(masks):
    for j in range(i):
        count=int(np.count_nonzero(a&masks[j]))
        if count>0: overlaps.append((catalog['territories'][j]['number'],catalog['territories'][i]['number'],count))
print('Interior overlaps (territory, territory, pixels):',overlaps)
preview.save('docs/mapa-vetor.png')
if overlaps: sys.exit(1)
