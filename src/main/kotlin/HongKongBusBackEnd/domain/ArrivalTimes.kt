package HongKongBusBackEnd.domain

import HongKongBusBackEnd.infra.DesiredBusStops
import HongKongBusBackEnd.infra.getNextTimesForPreviouslySetBusStop
import HongKongBusBackEnd.infra.loadFirstWebPageAndReturnCookies
import HongKongBusBackEnd.infra.setBusStopDetails
import khttp.structures.cookie.CookieJar
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class ArrivalTimes {
    private val arrivalTimes = mutableListOf<BusStopTime>()
    private val arrivalTimesStatic = mutableListOf<BusStopTime>()

    private val desiredBusStops = DesiredBusStops()

    init{
        arrivalTimesStatic.add(BusStopTime(11,"11:11","5.0km"))
        arrivalTimesStatic.add(BusStopTime(11,"11:15","6.0km"))
        arrivalTimesStatic.add(BusStopTime(11,"11:20","7.0km"))
    }

    fun getAll():MutableList<BusStopTime>{
        println("size : ${arrivalTimes.size}")
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
        println("I've added $busStopTime")
    }

    fun addSeveral(busStopTimes: MutableList<BusStopTime>){
        for(busStopTime in busStopTimes){
            this.addOne(busStopTime)
        }
    }

    @Scheduled(fixedDelay = 20_000)
    fun startTheLoop() {
        val myOriginalCookies: CookieJar = loadFirstWebPageAndReturnCookies()
        for (desiredBusStop in this.desiredBusStops.getAll()) {
            this.refreshDataFor(myOriginalCookies, desiredBusStop)
        }
        println("Final Data :")
        for (busStopTime in this.getAll()) {
            println(busStopTime)
        }
    }

    fun refreshDataFor(myOriginalCookies:CookieJar, busStopConfig: BusStopConfig){
        setBusStopDetails(myOriginalCookies,busStopConfig)
        this.clearPreviousBusTimesForBusNumber(busStopConfig.busNumber)
        this.addSeveral(getNextTimesForPreviouslySetBusStop(myOriginalCookies,busStopConfig.busNumber))
    }


}