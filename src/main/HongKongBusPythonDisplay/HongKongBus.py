import requests
import sys, os
from bs4 import BeautifulSoup
# from rgbmatrix import Adafruit_RGBmatrix
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw
import time
import threading
import psutil
import logging
from logging.handlers import RotatingFileHandler
import BusStopConfig
import BusTimeToDisplay

# Define running folder
# ProgramFolder = "/home/pi/Downloads/rpi-rgb-led-matrix-master/"
ProgramFolder = ""

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


def GetCityBusProcess():
    for myProcess in psutil.process_iter():
        if 'sudo' in myProcess.cmdline():
            if 'python' in myProcess.cmdline():
                if ProgramFolder + 'CityBus.py' in myProcess.cmdline() or 'CityBus.py' in myProcess.cmdline():
                    if myProcess.pid == os.getppid():
                        myLogger.debug(
                            "Found sudo, python, and CityBuys.py process, but only current process, no already running one")
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
            response = requests.get('https://hong-kong-bus.herokuapp.com/getNextBusesTimes')
            data = response.json()
            for obj in data:
                FoundArrivalTimes.append(
                    BusTimeToDisplay.BusTimeToDisplay(obj.get('busNumber'), obj.get('arrivalTime'), obj.get('distance'),
                                                      DarkRed if obj.get('busNumber') == 11 else LightRed))
            myLogger.info("RefreshBusTimeData while True Loop started")

        except:
            myLogger.exception("Couldn't GET the BusTimeData")

        finally:
            if len(FoundArrivalTimes) > 0:
                NextArrivalTimes = sorted(FoundArrivalTimes, key=lambda myBusTime: myBusTime.arrivalTime)
        myLogger.info("RefreshBusTimeData sleeping for 20 seconds")
        time.sleep(20)
        myLogger.info("RefreshBusTimeData SLEEP DONE - End of my loop, let's go to the next one; NextArrivalTimes = %s",
                      NextArrivalTimes)


def KeepDisplayUpdated():
    global NextArrivalTimes
    localNextArrivalTimesToAvoidConcurrencyIssues = []

    myLogger.info("Starting KeepDisplayUpdated")

    while True:
        localNextArrivalTimesToAvoidConcurrencyIssues = NextArrivalTimes
        for busTimeToDisplay in localNextArrivalTimesToAvoidConcurrencyIssues:
            print(BusTimeToDisplay.BusTimeToDisplay(busTimeToDisplay.busNumber, busTimeToDisplay.arrivalTime,
                                                    busTimeToDisplay.distance, DarkRed))
        myLogger.info("DisplayUpdated sleeping for 20 seconds")
        time.sleep(20)


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

    myLogger.warning('Starting')
    myThreadManagerThread.start()
    print("CityBus started")
    myLogger.warning("CityBus ThreadManager Started")
except:
    myLogger.exception("Unable to run the program")
