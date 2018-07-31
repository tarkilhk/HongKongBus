package HongKongBusBackEnd.domain.Bus

import HongKongBusBackEnd.infra.bus.getNextTimesForPreviouslySetBusStop
import HongKongBusBackEnd.infra.bus.loadFirstWebPageAndReturnCookies
import HongKongBusBackEnd.infra.bus.setBusStopDetailsAndGetResponseCode
import khttp.structures.cookie.CookieJar
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*




class ArrivalTimes(var chosenBusStops : MutableList<BusStopConfig>) {
    private val arrivalTimes = mutableListOf<BusStopTime>()
    private var lastRefreshTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))

    private val initialCookies: CookieJar = loadFirstWebPageAndReturnCookies()

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

    fun refreshDataFor(chosenBusStop: BusStopConfig){
        val responseCode:Int = setBusStopDetailsAndGetResponseCode(initialCookies, chosenBusStop)

        if (responseCode == 200) {
            val result = getNextTimesForPreviouslySetBusStop(initialCookies, chosenBusStop.busNumber)
            this.clearPreviousBusTimesForBusNumber(chosenBusStop.busNumber)
            this.addSeveral(result)
            lastRefreshTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))
        }
        else {
            println("Error setting BusStopDetails : code $responseCode")
         }
    }


}