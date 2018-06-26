import requests
import sys, os
from rgbmatrix import Adafruit_RGBmatrix
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw
import time
import threading
import psutil
import logging
from logging.handlers import RotatingFileHandler
import BusTimeToDisplay


# Define running folder
if os.name == 'nt':
    ProgramFolder = 'C:\\Users\\rober\\ideaProjects\\HongKongBus\\src\\main\\HongKongBusPythonDisplay\\'
else:
    ProgramFolder = "/home/pi/Downloads/rpi-rgb-led-matrix-master/"

# Logging mechanism
myLogger = logging.getLogger('RotatingLogs')
myHandler = RotatingFileHandler(ProgramFolder + "CityBus.log", maxBytes=20000000, backupCount=5)
myHandler.setLevel(logging.INFO)
myHandler.setFormatter(logging.Formatter('(%(threadName)s) %(asctime)s %(message)s'))
myLogger.addHandler(myHandler)
myLogger.setLevel(logging.INFO)

# Define colors
DarkRed = (50, 0, 0)
LightRed = (100, 0, 0)
DarkWhite = (100, 100, 100)
PreciousCyan = (102, 245, 173)

# Global variable to be used between the 2 threads
NextArrivalTimes = []


def GetDisplayColor(busNumber):
    displayColor = (0, 0, 0)
    if busNumber == 11:
        displayColor = DarkRed
    if busNumber == 511:
        displayColor = LightRed
    return displayColor


def GetCityBusProcess():
    for myProcess in psutil.process_iter():
        if 'sudo' in myProcess.cmdline():
            if 'python' in myProcess.cmdline():
                if ProgramFolder + 'CityBus.py' in myProcess.cmdline() or 'CityBus.py' in myProcess.cmdline():
                    if myProcess.pid == os.getppid():
                        myLogger.debug(
                            "Found sudo, python, and CityBuys.py process, but only current process, no already "
                            "running one")
                    else:
                        myLogger.debug("Found CityBuys.py process")
                        return myProcess
                else:
                    myLogger.debug("Found sudo and python, but not CityBus")
            else:
                myLogger.debug("Found sudo, but not python")
    return None


def RefreshBusTimeData():
    global NextArrivalTimes

    FoundArrivalTimes = []
    while True:
        try:
            FoundArrivalTimes = []
            response = requests.get('https://hong-kong-bus.herokuapp.com/nextBusesTimes')
            data = response.json()
            for obj in data:
                FoundArrivalTimes.append(
                    BusTimeToDisplay.BusTimeToDisplay(obj.get('busNumber'), obj.get('arrivalTime'), obj.get('distance'),
                                                      GetDisplayColor(obj.get('busNumber'))))
            myLogger.info("RefreshBusTimeData while True Loop started")

        except:
            myLogger.exception("Couldn't GET the BusTimeData")

        finally:
            if len(FoundArrivalTimes) > 0:
                NextArrivalTimes = sorted(FoundArrivalTimes,
                                          key=lambda myBusTime: myBusTime.arrivalTime.replace("00:", "24:"))


def KeepDisplayUpdated():
    global NextArrivalTimes
    # Rows and chain length are both required parameters:
    matrix = Adafruit_RGBmatrix(32, 2)

    localNextArrivalTimesToAvoidConcurrencyIssues = []

    myLogger.info("Starting KeepDisplayUpdated")
    fontSize = 10
    # font = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSans.ttf", fontSize)
    # font = ImageFont.truetype("/home/pi/Downloads/5by7.ttf", fontSize)
    # font = ImageFont.truetype("/home/pi/Downloads/ufonts.com_subway-ticker.ttf", fontSize)
    font = ImageFont.truetype(ProgramFolder + "LEDCounter7.ttf", fontSize)
    displaying = 'arrivalTime'

    while True:
        myImage = Image.new("RGB", (64, 32), "black")
        myDraw = ImageDraw.Draw(myImage)
        myDraw.text((19, 0), time.strftime('%H:%M', time.localtime()), DarkWhite, font=font)

        localNextArrivalTimesToAvoidConcurrencyIssues = NextArrivalTimes

        if len(localNextArrivalTimesToAvoidConcurrencyIssues) == 0:
            myDraw.text((3, fontSize), "No bus", DarkRed, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues) == 1:
            if displaying == 'arrivalTime':
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
            else:
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues) == 2:
            if displaying == 'arrivalTime':
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
            else:
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues) == 3:
            if displaying == 'arrivalTime':
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[2].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
            else:
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[2].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
        else:
            if displaying == 'arrivalTime':
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[2].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
                myDraw.text((35, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[3].arrivalTime,
                            localNextArrivalTimesToAvoidConcurrencyIssues[3].color, font=font)
            else:
                myDraw.text((3, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35, fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[2].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
                myDraw.text((35, fontSize * 2), localNextArrivalTimesToAvoidConcurrencyIssues[3].distance,
                            localNextArrivalTimesToAvoidConcurrencyIssues[3].color, font=font)

        myLogger.info("DisplayUpdated : Before RGBMatrix.Clear")
        matrix.Clear()

        myLogger.info("DisplayUpdated : Before RGBMatrix.SetImage")
        matrix.SetImage(myImage.im.id, 0, 0)

        if displaying == 'arrivalTime':
            myLogger.debug("KeepDisplayUpdated sleeping for 3 seconds")
            time.sleep(3)
            myLogger.debug("KeepDisplayUpdated arrivalTime SLEEP DONE")
            displaying = 'distance'
        else:
            myLogger.debug("KeepDisplayUpdated sleeping for 1 second")
            time.sleep(1)
            myLogger.debug("KeepDisplayUpdated distance SLEEP DONE")
            displaying = 'arrivalTime'


def ThreadManager():
    # wakes up every 5 minutes to check if the 2 threads are running
    # restarts missing ones if needed

    myRefreshBusTimeDataThread = threading.Thread(name='RefreshBusTimeData', target=RefreshBusTimeData)
    myKeepDisplayUpdatedThread = threading.Thread(name='KeepDisplayUpdated', target=KeepDisplayUpdated)

    while True:
        if not myRefreshBusTimeDataThread.isAlive():
            myRefreshBusTimeDataThread.start()
            myLogger.info('RefreshBusTimeData started')
        if not myKeepDisplayUpdatedThread.isAlive():
            myKeepDisplayUpdatedThread.start()
            myLogger.info('KeepDisplayUpdated started')
        time.sleep(300)


try:
    # Create 1 thread as follows    
    myThreadManagerThread = threading.Thread(name='ThreadManager', target=ThreadManager)

    if os.name=='nt':
        myThreadManagerThread.start()
        print("CityBus started")
        myLogger.warning("CityBus ThreadManager Started")
    else:
        myProcess = GetCityBusProcess()
        if len(sys.argv) < 2:
            print("Wrong arguments, you need to specify start or stop")
            myLogger.error("Wrong argument, only start and stop are supported")
            sys.exit()

        # If process is running already
        if myProcess is not None:
            if sys.argv[1] == "start":
                print("CityBus is already running, cannot start a second time")
                myLogger.error("CityBus is already running, cannot start a second time")
            elif sys.argv[1] == "stop":
                myLogger.warning("CityBus stopping")
                myProcess.terminate()
                print("CityBus stopped")
            else:
                print("Wrong argument, only start and stop are supported")
                myLogger.error("Wrong argument, only start and stop are supported")
        else:
            if sys.argv[1] == "start":
                myLogger.warning('Starting')
                myThreadManagerThread.start()
                print("CityBus started")
                myLogger.warning("CityBus ThreadManager Started")
            elif sys.argv[1] == "stop":
                print("CityBus is not running, cannot stop it")
                myLogger.error("CityBus is not running, cannot stop it")
            else:
                print("Wrong argument, only start and stop are supported")
                myLogger.error("Wrong argument, only start and stop are supported")
except:
    myLogger.exception("Unable to run the program")
