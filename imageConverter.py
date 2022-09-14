from PIL import Image

im = Image.open('mapa.png')
pix = im.load()
width, height = im.size
out = []

for y in range(0, height):
    for x in range(0, width):
        r, g, b = pix[x, y]
        if(r == 0 and g == 0 and b == 255):
            out.append(8)
        elif(r == 255 and g == 255 and b == 0):
            out.append(9)
        elif(r == 255 and g == 255 and b == 255):
            out.append(1)
        elif(r == 0 and g == 0 and b == 0):
            out.append(0)
        elif(r == 255 and g == 0 and b == 0):
            out.append(3)
        elif(r == 0 and g == 255 and b == 0):
            out.append(2)

print(out)