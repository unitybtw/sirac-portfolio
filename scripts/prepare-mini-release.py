"""Build a transparent release atlas from a 720p Flow plate.
Usage: python3 scripts/prepare-mini-release.py input.mp4 push|carry
"""
import sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

pose=sys.argv[2]
x,y,w,h,width=(410,38,432,664,156) if pose=='push' else (480,44,312,672,112)
cap=cv2.VideoCapture(sys.argv[1])
atlas=np.zeros((2880,width*12,4),np.uint8)
for i in range(144):
    ok,frame=cap.read()
    if not ok: raise RuntimeError(f'Missing frame {i}')
    rgb=cv2.cvtColor(cv2.resize(frame[y:y+h,x:x+w],(width,240)),cv2.COLOR_BGR2RGB)
    r,g,b=np.moveaxis(rgb.astype(float),-1,0)
    alpha=(255*np.clip((np.maximum(r,b)+35-g)/20,0,1)).astype(np.uint8)
    rgb[:,:,1]=np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2]))
    atlas[i//12*240:(i//12+1)*240,i%12*width:(i%12+1)*width]=np.dstack([rgb,alpha])
# The first frame is exactly the held source pose used by the site.
held=Image.open(Path(__file__).resolve().parents[1]/'public/assets/mini-sirac'/f'{pose}.webp').convert('RGBA')
index=82 if pose=='push' else 59
atlas[:240,:width]=np.array(held)[index//12*240:(index//12+1)*240,index%12*width:(index%12+1)*width]
out=Path(__file__).resolve().parents[1]/'public/assets/mini-sirac'/f'{pose}-release.webp'
Image.fromarray(atlas).save(out,quality=88,method=4)
Image.fromarray(atlas).save(f'/private/tmp/{pose}-release-atlas.png')
print(out)
