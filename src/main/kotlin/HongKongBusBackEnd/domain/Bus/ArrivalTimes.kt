package HongKongBusBackEnd.domain.Bus

import HongKongBusBackEnd.infra.bus.getNextTimesForPreviouslySetBusStop
import HongKongBusBackEnd.infra.bus.loadFirstWebPageAndReturnCookies
import HongKongBusBackEnd.infra.bus.setBusStopDetailsAndGetResponseCode
import khttp.structures.cookie.CookieJar

class ArrivalTimes(var chosenBusStops : MutableList<BusStopConfig>) {
    private val arrivalTimes = mutableListOf<BusStopTime>()

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

    fun getAll():MutableList<BusStopTime>{
        return this.arrivalTimes
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
        }
        else {
            println("Error setting BusStopDetails : code $responseCode")
         }
    }


}