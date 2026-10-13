"""Key a 720p Omni walk plate: python3 scripts/key-mini-walk.py input.mp4.
Requires OpenCV, NumPy and Pillow; outputs the keyed atlas for WebP encoding.
"""
import sys
import cv2,numpy as np
from PIL import Image
cap=cv2.VideoCapture(sys.argv[1]); atlas=np.zeros((2880,1584,4),np.uint8)
for i in range(144):
 ok,f=cap.read()
 if not ok:break
 rgb=cv2.cvtColor(cv2.resize(f[40:708,400:768],(132,240)),cv2.COLOR_BGR2RGB); r,g,b=np.moveaxis(rgb.astype(float),-1,0)
 mask=np.full((240,132),cv2.GC_PR_BGD,np.uint8)
 person=(r<95)&(g<110)&(b<100); skin=(r>g*1.1)&(r>b*1.2)&(r>70)
 mask[person|skin]=cv2.GC_PR_FGD;mask[(r<65)&(g<75)&(b<75)]=cv2.GC_FGD
 mask[:,0:4]=cv2.GC_BGD;mask[:,-4:]=cv2.GC_BGD;mask[0:3]=cv2.GC_BGD;mask[-2:]=cv2.GC_BGD
 cv2.grabCut(rgb,mask,None,np.zeros((1,65)),np.zeros((1,65)),2,cv2.GC_INIT_WITH_MASK)
 alpha=np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
 n,l,stats,c=cv2.connectedComponentsWithStats(alpha);alpha=(l==1+np.argmax(stats[1:,cv2.CC_STAT_AREA])).astype('uint8')*255
 rgb[:,:,1]=np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2]))
 atlas[i//12*240:(i//12+1)*240,i%12*132:(i%12+1)*132]=np.dstack([rgb,cv2.GaussianBlur(alpha,(3,3),.4)])
Image.fromarray(atlas).save('/private/tmp/mini-walk-clean.png')
f=Image.fromarray(atlas[960:1200,:132]);bg=Image.new('RGBA',f.size,'white');bg.alpha_composite(f);bg.convert('RGB').save('/private/tmp/walk-clean.jpg')
