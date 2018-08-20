package HongKongBusBackEnd.domain.bus

import HongKongBusBackEnd.infra.bus.CityBusHelper
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


class ArrivalTimes(var chosenBusStops : MutableList<BusStopConfig>) {
    private val cityBusHelper = CityBusHelper()
    private val arrivalTimes = mutableListOf<BusStopTime>()
    private var lastRefreshTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))

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
        val responseCode:MutableMap<String,String> = cityBusHelper.setBusStopDetailsAndGetResponseCode(chosenBusStop)

        if (responseCode["statusCode"].equals("200")) {
            if(responseCode["body"].equals("OK")) {
                val result = cityBusHelper.getNextTimesForPreviouslySetBusStop(chosenBusStop.busNumber)
                this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
                this.addSeveral(result)
                lastRefreshTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))
            }
            else {
                this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
                this.addSeveral(mutableListOf(BusStopTime(0,"Couldn't set BusStop","")))
                println("Error setting BusStopDetails : 200, but result is not OK")
            }
        }
        else {
            this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
            this.addSeveral(mutableListOf(BusStopTime(0,"Couldn't set BusStop","${responseCode["statusCode"]}")))
            println("Error setting BusStopDetails : code $responseCode")
         }
    }


}