"""Key a Flow companion plate and pack 8 seconds at 16 fps into a WebP atlas.
Usage: python3 scripts/prepare-mini-companion.py input.mp4 sit-phone|stand-run|wave-point
"""
from pathlib import Path
import sys
import json
import cv2
import numpy as np
from PIL import Image

name=sys.argv[2]
x,w,width,height=(300,720,160,160) if name=='wave-point' else (380,600,268,320)
cap=cv2.VideoCapture(sys.argv[1]);atlas=np.zeros((height*8,width*16,4),np.uint8)
for index in range(128):
    cap.set(cv2.CAP_PROP_POS_FRAMES,int(index*1.5))
    ok,frame=cap.read()
    if not ok: raise RuntimeError(f'Missing frame {index}')
    rgb=cv2.cvtColor(frame[:720,x:x+w],cv2.COLOR_BGR2RGB)
    r,g,b=np.moveaxis(rgb.astype(float),-1,0)
    alpha=(255*np.clip((np.maximum(r,b)+35-g)/20,0,1)).astype(np.uint8)
    rgb[:,:,1]=np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2]))
    keyed=Image.fromarray(np.dstack([rgb,alpha])).resize((width,height),Image.Resampling.LANCZOS)
    atlas[index//16*height:(index//16+1)*height,index%16*width:(index%16+1)*width]=np.array(keyed)
root=Path(__file__).resolve().parents[1]/'public/assets/mini-sirac'
if name=='stand-run':
    held=np.array(Image.open(root/'sit-phone-hd.webp').convert('RGBA'))
    atlas[:height,:width]=held[7*height:8*height,8*width:9*width]  # Source frame 180.
output_name=name if name=='wave-point' else f'{name}-hd'
Image.fromarray(atlas).save(root/f'{output_name}.webp',quality=95,method=4)
Image.fromarray(atlas).save(f'/private/tmp/{name}-atlas.png')
if name=='stand-run':
    floors=[]
    for index in range(128):
        alpha=atlas[index//16*height:(index//16+1)*height,index%16*width:(index%16+1)*width,3]
        rows=np.where((alpha>160).sum(axis=1)>3)[0]
        floors.append(round((int(rows[-1])+1)/height,5))
    (root.parents[2]/'src/data/miniCompanionRunFloor.json').write_text(json.dumps(floors)+'\n')
print(root/f'{output_name}.webp')
