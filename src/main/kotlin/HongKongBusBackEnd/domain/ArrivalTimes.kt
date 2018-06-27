package HongKongBusBackEnd.domain

import HongKongBusBackEnd.infra.DesiredBusStops
import HongKongBusBackEnd.infra.getNextTimesForPreviouslySetBusStop
import HongKongBusBackEnd.infra.loadFirstWebPageAndReturnCookies
import HongKongBusBackEnd.infra.setBusStopDetailsAndGetResponseCode
import khttp.structures.cookie.CookieJar
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ArrivalTimes {
    private val arrivalTimes = mutableListOf<BusStopTime>()
    private val arrivalTimesStatic = mutableListOf<BusStopTime>()

    private val desiredBusStops = DesiredBusStops()
    private val initialCookies: CookieJar = loadFirstWebPageAndReturnCookies()

    init{
        arrivalTimesStatic.add(BusStopTime(11,"11:11","5.0km"))
        arrivalTimesStatic.add(BusStopTime(11,"11:15","6.0km"))
        arrivalTimesStatic.add(BusStopTime(11,"11:20","7.0km"))
    }

    fun getAll():MutableList<BusStopTime>{
        return this.arrivalTimes
    }

    fun getStatic():MutableList<BusStopTime>{
        return this.arrivalTimesStatic
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

    @Scheduled(fixedDelay = 20_000)
    fun refreshDataLoop() {
        for (desiredBusStop in this.desiredBusStops.getAll()) {
            this.refreshDataFor(desiredBusStop)
        }
    }

    fun refreshDataFor(busStopConfig: BusStopConfig){
        val responseCode:Int = setBusStopDetailsAndGetResponseCode(initialCookies, busStopConfig)

//        sleep(5000)

        if (responseCode == 200) {
            val result = getNextTimesForPreviouslySetBusStop(initialCookies, busStopConfig.busNumber)
            this.clearPreviousBusTimesForBusNumber(busStopConfig.busNumber)
            this.addSeveral(result)
        }
        else {
            println("Error setting BusStopDetails : code $responseCode")
         }
    }


}