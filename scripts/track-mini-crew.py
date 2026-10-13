"""Extract contact coordinates from the keyed Flow video atlases."""
from pathlib import Path
import json
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
tracks = {}
for name, width in [('push',156),('pull',144),('carry',112),('walk',132),('carryRelease',112),('pushRelease',156)]:
    filename=name.replace('Release','-release')
    atlas=np.array(Image.open(root/'public/assets/mini-sirac'/f'{filename}.webp').convert('RGBA'))
    frames=[]
    for index in range(144):
        x=index%12*width; y=index//12*240
        frame=atlas[y:y+240,x:x+width]
        r,g,b,a=np.moveaxis(frame.astype(float),-1,0)
        skin=(a>200)&(r>g*1.07)&(r>b*1.12)&(r>70)
        yy,xx=np.indices(a.shape)
        if name=='push': skin &= (xx>width*.56)&(yy<240*.58)&(yy>240*.18)
        elif name=='pull': skin &= (xx<width*.6)&(yy>240*.25)&(yy<240*.65)
        elif name=='carry': skin &= yy<240*.18
        else: skin=(a>220)&(yy>240*.3)&(yy<240*.55)
        sy,sx=np.where(skin)
        if len(sx):
            # Palms at the outer contact edge, not the face or forearms.
            if name=='push': edge=sx>np.percentile(sx,80)
            elif name=='pull': edge=sx<np.percentile(sx,25)
            elif name=='carry': edge=sy<np.percentile(sy,25)
            else: edge=np.ones(len(sy),dtype=bool)
            hx=float(np.median(sx[edge]));hy=float(np.median(sy[edge]))
        else:
            hx,hy=(width*.92,240*.34) if name=='push' else (width*.18,240*.39) if name=='pull' else (width*.57,240*.045)
        feet=(a>220)&(yy>240*.72)
        fy,fx=np.where(feet)
        floor=float(np.percentile(fy,99)) if len(fy) else 236
        bottom=feet&(yy>floor-4)
        by,bx=np.where(bottom)
        footx=float(np.median(bx)) if len(bx) else width*.5
        torso=(a>200)&(yy>240*.4)&(yy<240*.6)
        bodyy,bodyx=np.where(torso)
        center=float(np.median(bodyx)) if len(bodyx) else width*.5
        headmask=(a>200)&(np.abs(xx-center)<width*.15)&(yy<240*.5)
        rows=np.where(headmask.sum(axis=1)>max(8,width*.07))[0]
        head=float(rows[0]) if len(rows) else 20
        frames.append([round(hx/width,4),round(hy/240,4),round(footx/width,4),round(floor/240,4),round(center/width,4),round(head/240,4)])
    tracks[name]=frames
out=root/'src/data/miniCrewContacts.json'
out.write_text(json.dumps(tracks,separators=(',',':'))+'\n')
print(out)
for name,f in tracks.items():
    print(name, 'hand range', np.min(np.array(f)[:,:2],axis=0), np.max(np.array(f)[:,:2],axis=0))
