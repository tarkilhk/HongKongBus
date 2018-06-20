import requests
import sys,  os
from bs4 import BeautifulSoup
from rgbmatrix import Adafruit_RGBmatrix
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw
import time
import threading
import psutil
import logging
from logging.handlers import RotatingFileHandler
import busStopConfig
import busTimeToDisplay

# Define running folder
ProgramFolder = "/home/pi/Downloads/rpi-rgb-led-matrix-master/"

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
busStopConfigs = [busStopConfig.busStopConfig(511,  'Loong Fung Terrace, Tai Hang Road',  '002529',  14, LightRed),  \
                  busStopConfig.busStopConfig(11,  'Loong Fung Terrace, Tai Hang Road',  '002529',  32, DarkRed)]

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
    sessions = {}
    myCookies = {}

    for myBusStopConfig in busStopConfigs:
        # First we need to get a session from the website, by opening our the webpage for our bus route
        sessions[myBusStopConfig] = requests.Session()
        sessions[myBusStopConfig].get("http://mobile.nwstbus.com.hk/text/routesearch.php?textOnly=true&search_mode=&intLangID=2&routenumber="+str(myBusStopConfig.busNumber),  timeout=5)
        myLogger.info("RefreshBusTimeData Session.Get Done")

        myCookies[myBusStopConfig] = {'PHPSESSID':sessions[myBusStopConfig].cookies['PHPSESSID'], \
                                      'FIRSTBUSWEBSYSTEM':sessions[myBusStopConfig].cookies['FIRSTBUSWEBSYSTEM']}
        
        myLogger.debug("COOKIES = %s",myCookies)
#        myCookies[myBusStopConfig] = {'PHPSESSID':'jlraa6vdmn54i218gqn3vkno51', 'FIRSTBUSWEBSYSTEM':'bf5def11507fbfaff95e430666e319d6FB58da7d2a61e41'}

    myLogger.debug("SESSIONS = %s",sessions)
    
    FoundArrivalTimes = []
    while True:
        myLogger.info("RefreshBusTimeData while True Loop started")
        FoundArrivalTimes = []
        for myBusStopConfig in busStopConfigs:
            myLogger.info("Starting Bus Lookup for Bus #%s", myBusStopConfig.busNumber)
            try:
##                ## GET STOP IN ROUTE ( = USELESS, BUT NEEDED TO START THE WORKFLOW)
##                req = requests.Request('GET',"http://mobile.nwstbus.com.hk/text/getstopinroute.php?lid=0&l=1",  cookies=myCookies[myBusStopConfig])
##                prepared = req.prepare()
##                myLogger.info("PREPARED HEADERS = %s", prepared.headers)
##                myLogger.info("PREPARED BODY = %s", prepared.body)
##                tmp = sessions[myBusStopConfig].send(prepared)
###                tmp = requests.Session().get("http://mobile.nwstbus.com.hk/text/getstopinroute.php?lid=0&l=1",  cookies=myCookies[myBusStopConfig],  timeout=5)
###                tmp = sessions[myBusStopConfig].get("http://mobile.nwstbus.com.hk/text/getstopinroute.php?lid=0&l=1",  cookies=myCookies[myBusStopConfig])
##                myLogger.info("GET GetStopInRoute + Cookie done - Res = %s",  tmp)
##                myLogger.info("GET GetStopInRoute + Cookie done - Answer LENGTH = %s",  len(tmp.text))


                ## 1 ## SET ETA SESSION ( = VALIDATE SESSION)
                req = requests.Request('GET',"http://mobile.nwstbus.com.hk/text/set_etasession.php?info=" + \
                                                   str(myBusStopConfig.busNumber) + "||" + \
                                                   myBusStopConfig.stopId + "||" + \
                                                   str(myBusStopConfig.stopNumber) + "||O||" + \
                                                   str(myBusStopConfig.busNumber) + "-CEF-1||" + \
                                                   "&sysid=1",  cookies=myCookies[myBusStopConfig])
                prepared = req.prepare()
                myLogger.debug("PREPARED HEADERS = %s", prepared.headers)
                myLogger.debug("PREPARED BODY = %s", prepared.body)
                tmp = sessions[myBusStopConfig].send(prepared)
#                tmp=sessions[myBusStopConfig].get("http://mobile.nwstbus.com.hk/text/set_etasession.php?info=11||002529||14||O||11-CEF-1&sysid=1",  cookies=myCookies[myBusStopConfig],  timeout=5)
#                tmp= sessions[myBusStopConfig].get("http://mobile.nwstbus.com.hk/text/set_etasession.php?info=" + \
#                                                   str(myBusStopConfig.busNumber) + "||" + \
#                                                   myBusStopConfig.stopId + "||" + \
#                                                   str(myBusStopConfig.stopNumber) + "||O||" + \
#                                                   str(myBusStopConfig.busNumber) + "-CEF-1||" + \
#                                                   "&sysid=1",  cookies=myCookies[myBusStopConfig],  timeout=5)
                myLogger.debug("GET set ETA session - Res = %s",  tmp)
                if tmp.status_code <> 200:
                    myLogger.error("ERROR during GET 'set_etasession' : %s",tmp)

                ## 2 ## GET ETA ( = GET BUS TIMES)
                req = requests.Request('GET',"http://mobile.nwstbus.com.hk/text/geteta.php?l=1",  cookies=myCookies[myBusStopConfig])
                prepared = req.prepare()
                myLogger.debug("PREPARED HEADERS = %s", prepared.headers)
                myLogger.debug("PREPARED BODY = %s", prepared.body)
                answer = sessions[myBusStopConfig].send(prepared)
#                answer = sessions[myBusStopConfig].get ("http://mobile.nwstbus.com.hk/text/geteta.php?l=1",  cookies=myCookies[myBusStopConfig],  timeout=5)
                myLogger.debug("GET getETA Data retrieved - Res = %s",  answer)
                if answer.status_code <> 200:
                    myLogger.error("ERROR during GET 'geteta' : %s",answer)
                if len(answer.text) < 10:
                    myLogger.warning("Answer of GET 'geteta' is too short : %s",answer.text)

                myLogger.info("After retrieved data of bus #%s", myBusStopConfig.busNumber)
                
                # Fourth we just need to parse the HTML
                soup = BeautifulSoup(answer.text, 'html.parser')
                
                myLogger.debug("SOUP = %s", soup)
                table = soup.find("table")
                for row in table.findAll('tr'):
                    cells = row.findAll('td')
                    if cells[0].find(text=True):
                        if cells[0].find(text=True).startswith("No departure estimated in the next"):
                            myLogger.info("Bus %s : No departure estimated in the next 60 minutes at bus stop %s", myBusStopConfig.busNumber, myBusStopConfig.stopId)
##                            FoundArrivalTimes.append(busTimeToDisplay.busTimeToDisplay(myBusStopConfig.busNumber, "No bus", myBusStopConfig.displayColor))
                        else:
                            if cells[0].find(text=True)[0] not in "1234567890":
                                ## ADD A CONCEPT OF FRESHNESS OF RETRIEVED DATA
                                ## ONLY CLEAR ARRAY IF FRESHNESS IS TOO OLD
                                ## OR EVEN BETTER
                                ## REMOVE ALL BUSTIMETODISPLAY where BusNumber is the same -> LAMBDA ?!?

                                #FoundArrivalTimes[:] = []
                                #FoundArrivalTimes.append(busTimeToDisplay.busTimeToDisplay(myBusStopConfig.busNumber, "NoSVC", myBusStopConfig.displayColor))

                                myLogger.warning("Retrieved text instead of a time : %s", cells[0].find(text=True))
                            else:
                                FoundArrivalTimes.append(busTimeToDisplay.busTimeToDisplay(myBusStopConfig.busNumber, cells[0].find(text=True), cells[2].find(text=True), myBusStopConfig.displayColor))
                myLogger.info("After Parsing data of bus #%s", myBusStopConfig.busNumber)
                myLogger.info("BusTimeData - FoundArrivalTimes = %s", FoundArrivalTimes)
            except:
                myLogger.exception("Couldn't GET the BusTimeData")

            finally:
                if len(FoundArrivalTimes)>0:
                    NextArrivalTimes = sorted(FoundArrivalTimes, key=lambda myBusTime: myBusTime.arrivalTime24H)
        myLogger.info("RefreshBusTimeData sleeping for 20 seconds")
        time.sleep(20)
        myLogger.info("RefreshBusTimeData SLEEP DONE - End of my loop, let's go to the next one; NextArrivalTimes = %s",  NextArrivalTimes)

def KeepDisplayUpdated():
    global NextArrivalTimes
    # Rows and chain length are both required parameters:
    matrix = Adafruit_RGBmatrix(32, 2)

    localNextArrivalTimesToAvoidConcurrencyIssues = []
    
    myLogger.info("Starting KeepDisplayUpdated")
    fontSize = 10
    #font = ImageFont.truetype("/usr/share/fonts/truetype/freefont/FreeSans.ttf", fontSize)
    #font = ImageFont.truetype("/home/pi/Downloads/5by7.ttf", fontSize)
    #font = ImageFont.truetype("/home/pi/Downloads/ufonts.com_subway-ticker.ttf", fontSize)
    font = ImageFont.truetype("/home/pi/Downloads/LEDCounter7.ttf", fontSize)
    displaying = 'arrivalTime'
    
    while True:
        myImage = Image.new("RGB", (64, 32), "black")
        myDraw = ImageDraw.Draw(myImage)
        myDraw.text((19, 0), time.strftime('%H:%M', time.localtime()), DarkWhite, font=font)

        localNextArrivalTimesToAvoidConcurrencyIssues = NextArrivalTimes

        myLogger.info("DEBUG PURPOSE : KeepDisplayUpdated got before localNextArrivalTimesToAvoidConcurrencyIssues to display %s", displaying)
        myLogger.info("DisplayUpdated - NextArrivalTimes = %s - LEN = %s", localNextArrivalTimesToAvoidConcurrencyIssues, len(localNextArrivalTimesToAvoidConcurrencyIssues))
        
        if len(localNextArrivalTimesToAvoidConcurrencyIssues)==0:
            myDraw.text((3,  fontSize), "No bus",  DarkRed, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues)==1:
            if displaying == 'arrivalTime':
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
            else:
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues)==2:
            if displaying == 'arrivalTime':
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
            else:
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
        elif len(localNextArrivalTimesToAvoidConcurrencyIssues)==3:
            if displaying == 'arrivalTime':
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[2].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
            else:
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[2].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
        else:
            if displaying == 'arrivalTime':
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[2].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
                myDraw.text((35,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[3].arrivalTime,  localNextArrivalTimesToAvoidConcurrencyIssues[3].color, font=font)
            else:
                myDraw.text((3,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[0].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[0].color, font=font)
                myDraw.text((35,  fontSize), localNextArrivalTimesToAvoidConcurrencyIssues[1].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[1].color, font=font)
                myDraw.text((3,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[2].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[2].color, font=font)
                myDraw.text((35,  fontSize*2), localNextArrivalTimesToAvoidConcurrencyIssues[3].distance,  localNextArrivalTimesToAvoidConcurrencyIssues[3].color, font=font)

        myLogger.info("DisplayUpdated : Before RGBMatrix.Clear")
        matrix.Clear()

        myLogger.info("DisplayUpdated : Before RGBMatrix.SetImage")
        matrix.SetImage(myImage.im.id, 0, 0)

        if displaying == 'arrivalTime':
            myLogger.info("KeepDisplayUpdated sleeping for 3 seconds")
            time.sleep(3)
            myLogger.info("KeepDisplayUpdated arrivalTime SLEEP DONE")
            displaying='distance'
        else:
            myLogger.info("KeepDisplayUpdated sleeping for 1 second")
            time.sleep(1)
            myLogger.info("KeepDisplayUpdated distance SLEEP DONE")
            displaying='arrivalTime'

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
