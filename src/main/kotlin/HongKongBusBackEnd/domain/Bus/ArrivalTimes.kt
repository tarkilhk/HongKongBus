package HongKongBusBackEnd.domain.bus

import HongKongBusBackEnd.infra.bus.CityBusHelper
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*


class ArrivalTimes(var chosenBusStops : MutableList<BusStopConfig>, val cityBusHelper: CityBusHelper) {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    private val arrivalTimes = mutableListOf<BusStopTime>()
    private var lastRefreshTime = LocalDateTime.now(ZoneId.of("Asia/Hong_Kong")).format(DateTimeFormatter.ofPattern("HH:mm:ss"))

    private var IAlreadyHadA404ErrorAndImInMyRecursiveLoopToTryToFixIt = false

    fun clearDesiredBusStops() {
        chosenBusStops.clear()
    }

    fun addOneDesiredBusStop(newChosenBusStop: BusStopConfig) {
        chosenBusStops.add(newChosenBusStop)
    }

    fun addSeveralDesiredBusStop(newChosenBusStops: MutableList<BusStopConfig>) {
        chosenBusStops.addAll(newChosenBusStops)
    }

    fun getSortedArrivalTimes(): List<BusStopTime> {
        return this.arrivalTimes.sortedWith(compareBy(BusStopTime::arrivalTime))
    }
    
    fun getResult(): HashMap<String, Any> {
        val map = HashMap<String, Any>()
        map["lastRefreshTime"] = this.lastRefreshTime
        map["arrivalTimes"] = this.getSortedArrivalTimes()
        return map
    }

    fun clearPreviousBusTimesForBusNumber(busNumber: Int){
        arrivalTimes.removeAll { it.isIsAnError }
        arrivalTimes.removeAll {it.busNumber == busNumber}
    }

    fun clearAll(){
        arrivalTimes.clear()
    }

    fun addOne(busStopTime: BusStopTime){
        arrivalTimes.add(busStopTime)
    }

    fun addSeveral(busStopTimes: MutableList<BusStopTime>){
        for(busStopTime in busStopTimes){
            this.addOne(busStopTime)
        }
    }

    fun refreshDataLoop() {
        for (chosenBusStop in this.chosenBusStops) {
            this.refreshDataFor(chosenBusStop)
        }
    }

    fun reinitialiseCookiesAndSetGetURLsForAliveSessions() {
        this.cityBusHelper.loadFirstWebPageAndSaveCookies()
        this.cityBusHelper.loadSetGetURLsFromFB()
    }

    fun refreshDataFor(chosenBusStop: BusStopConfig){
        val responseMap:MutableMap<String,String> = cityBusHelper.setBusStopDetailsAndGetResponseCode(chosenBusStop)

        if (responseMap["statusCode"].equals("200")) {
            if(responseMap["body"].equals("OK")) {
                logger.info("Successfully set the BusStopDetails for bus ${chosenBusStop.busNumber}")
                this.IAlreadyHadA404ErrorAndImInMyRecursiveLoopToTryToFixIt = false
                val result = cityBusHelper.getNextTimesForPreviouslySetBusStop(chosenBusStop.busNumber)
                this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
                this.addSeveral(result)
                lastRefreshTime = LocalDateTime.now(ZoneId.of("Asia/Hong_Kong")).format(DateTimeFormatter.ofPattern("HH:mm:ss"))
            }
            else {
                this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
                this.addSeveral(mutableListOf(BusStopTime(0,"Couldn't set BusStop","")))
                logger.error("Error setting BusStopDetails : 200, but result is not OK : ${responseMap["body"]}")
            }
        }
        else if (responseMap["statusCode"].equals("404")) {
            // 404 means page has not been found : SetGet URLs must have been modified by CityBus
            // I need to renew them
            if(IAlreadyHadA404ErrorAndImInMyRecursiveLoopToTryToFixIt) {
                //I don't want to go in infinite recursive loops, something is not right, I will raise an error
                this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
                this.addSeveral(mutableListOf(BusStopTime(chosenBusStop.busNumber,"Couldn't set BusStop RCRSV","${responseMap["statusCode"]}")))
                logger.error("Error setting BusStopDetails in my recursive loop for bus ${chosenBusStop.busNumber}")
                IAlreadyHadA404ErrorAndImInMyRecursiveLoopToTryToFixIt = false
            }
            else {
                this.reinitialiseCookiesAndSetGetURLsForAliveSessions()
                IAlreadyHadA404ErrorAndImInMyRecursiveLoopToTryToFixIt = true
                this.refreshDataFor(chosenBusStop)
            }
        }
        else {
            this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
            this.addSeveral(mutableListOf(BusStopTime(0,"Couldn't set BusStop","${responseMap["statusCode"]}")))
            logger.error("Unknown error setting BusStopDetails : code ${responseMap["statusCode"]} for ${chosenBusStop.busNumber}")
         }
    }


}