from PIL import Image
import numpy as np, sys, os
CARD=(238,238,238)
def key(src, dst, W=604, H=800):
    im=Image.open(src).convert("RGB")
    s=max(W/im.width,H/im.height)
    r=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    r=r.crop(((r.width-W)//2,0,(r.width-W)//2+W,H))        # top-anchored, keeps heads
    a=np.asarray(r).astype(np.float32)
    mn=a.min(axis=2)
    t=np.clip((mn-228.0)/24.0,0,1)[...,None]               # feathered white->card
    out=a*(1-t)+np.array(CARD,dtype=np.float32)*t
    Image.fromarray(out.astype(np.uint8)).save(dst,"JPEG",quality=82,optimize=True,progressive=True)
    return os.path.getsize(dst)//1024
if __name__=="__main__":
    print(key(sys.argv[1], sys.argv[2]), "KB")
