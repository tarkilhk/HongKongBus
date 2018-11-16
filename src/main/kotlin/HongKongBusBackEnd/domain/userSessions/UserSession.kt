package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.bus.ArrivalTimes
import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.bus.CityBusHelper
import java.time.LocalDateTime
import java.time.LocalDateTime.now
import java.time.ZoneId
import java.util.*

class UserSession(val user : User, var busStopGroupName : String, cityBusHelper: CityBusHelper) {

    val arrivalTimes = ArrivalTimes(user.getAllChosenBusStopsForGroup(busStopGroupName), cityBusHelper)
    val uniqueSessionId = if(this.user.name == "pi") "1" else UUID.randomUUID().toString()
    var lastQueryTime : LocalDateTime = now(ZoneId.of("Asia/Hong_Kong"))

//    init{
//        this.arrivalTimes.refreshDataLoop()
//    }

    fun changeConfig(newDesiredBusStopGroupName: String) {
        this.busStopGroupName = newDesiredBusStopGroupName
        this.arrivalTimes.clearDesiredBusStops()
        this.arrivalTimes.addSeveralDesiredBusStop(user.getAllChosenBusStopsForGroup(newDesiredBusStopGroupName))

//        this.arrivalTimes.refreshDataLoop()
    }

    fun setLastQueryTimeToNow() {
        this.lastQueryTime = now(ZoneId.of("Asia/Hong_Kong"))
    }
}