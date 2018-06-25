import requests
import sys
import os
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
myHandler = RotatingFileHandler(ProgramFolder+"CityBus.log", maxBytes=20000000, backupCount=5)
myHandler.setLevel(logging.INFO)
myHandler.setFormatter(logging.Formatter('(%(threadName)s) %(asctime)s %(message)s'))
myLogger.addHandler(myHandler)
myLogger.setLevel(logging.INFO)

# Define colors
DarkRed = (50, 0, 0)
LightRed = (100, 0, 0)
DarkWhite = (100, 100, 100)
PreciousCyan = (102,245,173)

# Bus Line configs -- TODO read a list from fileConfig
BusStopConfigs = [BusStopConfig.BusStopConfig(511,  'Loong Fung Terrace, Tai Hang Road',  '002529',  14, LightRed),  \
                  BusStopConfig.BusStopConfig(11,  'Loong Fung Terrace, Tai Hang Road',  '002529',  32, DarkRed)]

# Global variable to be used between the 2 threads
NextArrivalTimes = []

def GetCityBusProcess():
    for myProcess in psutil.process_iter():
        if 'sudo' in myProcess.cmdline():
            if 'python' in myProcess.cmdline():
                if ProgramFolder+'CityBus.py' in myProcess.cmdline() or 'CityBus.py' in myProcess.cmdline():
                    if myProcess.pid==os.getppid():
                        myLogger.debug("Found sudo, python, and CityBuys.py process, but only current process, no already running one")
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
        response = requests.get('http://localhost:8080/nextBusesTimes')
        data = response.json()
        for obj in data:
            print(obj.get('busNumber'))
            print(obj.get('arrivalTime'))
            print(obj.get('distance'))
        myLogger.info("RefreshBusTimeData while True Loop started")
        try:
            print("toto")
        except:
            myLogger.exception("Couldn't GET the BusTimeData")

        # finally:
        #     if len(FoundArrivalTimes)>0:
        #         NextArrivalTimes = sorted(FoundArrivalTimes, key=lambda myBusTime: myBusTime.arrivalTime24H)
        # myLogger.info("RefreshBusTimeData sleeping for 20 seconds")
        time.sleep(20)
        myLogger.info("RefreshBusTimeData SLEEP DONE - End of my loop, let's go to the next one; NextArrivalTimes = %s",  NextArrivalTimes)

def KeepDisplayUpdated():
    global NextArrivalTimes
    localNextArrivalTimesToAvoidConcurrencyIssues = []

    localNextArrivalTimesToAvoidConcurrencyIssues = NextArrivalTimes
    for busTimeToDisplay in localNextArrivalTimesToAvoidConcurrencyIssues:
        print(BusTimeToDisplay.BusTimeToDisplay(busTimeToDisplay.busNumber,busTimeToDisplay.arrivalTime,busTimeToDisplay.distance,DarkRed))


def ThreadManager():
    #wakes up every 5 minutes to check if the 2 threads are running
    #restarts missing ones if needed

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

    myProcess = GetCityBusProcess()
    if len(sys.argv) < 2:
        print ("Wrong arguments, you need to specify start or stop")
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
