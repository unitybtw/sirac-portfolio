"""Prepare keyed Flow drag clips, including collar/foot tracking for continuity."""
from pathlib import Path
import json
import cv2
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=root/'scratch/mini-sirac-drag'
metadata={}
for name,file in [('grab','grab.mp4'),('hold','hold-loop.mp4'),('release','release.mp4')]:
 cap=cv2.VideoCapture(str(source/file));frames=[];track=[]
 while True:
  ok,frame=cap.read()
  if not ok:break
  rgb=cv2.cvtColor(frame[:,400:880],cv2.COLOR_BGR2RGB)
  r,g,b=np.moveaxis(rgb.astype(float),-1,0)
  alpha=(255*np.clip((np.maximum(r,b)+35-g)/20,0,1)).astype(np.uint8)
  rgb[:,:,1]=np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2]))
  rgba=np.array(Image.fromarray(np.dstack([rgb,alpha])).resize((160,240),Image.Resampling.LANCZOS))
  rows=np.where((rgba[:,:,3]>170).sum(axis=1)>3)[0];top,bottom=int(rows[0]),int(rows[-1])+1
  track.append({'collar':round((top+(bottom-top)*.16)/240,5),'floor':round(bottom/240,5)})
  frames.append(rgba)
 atlas=np.zeros(((len(frames)+11)//12*240,1920,4),np.uint8)
 for i,frame in enumerate(frames):atlas[i//12*240:(i//12+1)*240,i%12*160:(i%12+1)*160]=frame
 Image.fromarray(atlas).save(root/f'public/assets/mini-sirac/drag-{name}.webp',quality=93,method=4)
 metadata[name]=track
(root/'src/data/miniDragContacts.json').write_text(json.dumps(metadata)+'\n')
