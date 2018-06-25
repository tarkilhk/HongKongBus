class Adafruit_RGBmatrix:
    nbPixels = 32
    howMany = 2

    def __init__(self, nbPixels=32, howMany=2):
        self.nbPixels = nbPixels
        self.howMany = howMany

    def Clear(self):
        print("RGBMatrix.Clear mock")

    def SetImage(self, myImage2, row, column):
        print("RGBMatrix.SetImage mock")
