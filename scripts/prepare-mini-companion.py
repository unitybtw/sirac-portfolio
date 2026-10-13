"""Key a Flow companion plate and pack 8 seconds at 16 fps into a WebP atlas.
Usage: python3 scripts/prepare-mini-companion.py input.mp4 sit-phone|stand-run|wave-point
"""
from pathlib import Path
import sys
import cv2
import numpy as np
from PIL import Image

name=sys.argv[2]
x,w,width=(300,720,160) if name=='wave-point' else (380,600,134)
cap=cv2.VideoCapture(sys.argv[1]);atlas=np.zeros((1280,width*16,4),np.uint8)
for index in range(128):
    cap.set(cv2.CAP_PROP_POS_FRAMES,int(index*1.5))
    ok,frame=cap.read()
    if not ok: raise RuntimeError(f'Missing frame {index}')
    rgb=cv2.cvtColor(cv2.resize(frame[:720,x:x+w],(width,160)),cv2.COLOR_BGR2RGB)
    r,g,b=np.moveaxis(rgb.astype(float),-1,0)
    alpha=(255*np.clip((np.maximum(r,b)+35-g)/20,0,1)).astype(np.uint8)
    rgb[:,:,1]=np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2]))
    atlas[index//16*160:(index//16+1)*160,index%16*width:(index%16+1)*width]=np.dstack([rgb,alpha])
root=Path(__file__).resolve().parents[1]/'public/assets/mini-sirac'
if name=='stand-run':
    held=np.array(Image.open(root/'sit-phone.webp').convert('RGBA'))
    atlas[:160,:width]=held[7*160:8*160,8*width:9*width]  # Source frame 180.
Image.fromarray(atlas).save(root/f'{name}.webp',quality=88,method=4)
Image.fromarray(atlas).save(f'/private/tmp/{name}-atlas.png')
print(root/f'{name}.webp')
