package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.bus.ArrivalTimes
import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.bus.CityBusHelper
import java.time.LocalDateTime
import java.time.LocalDateTime.now
import java.time.ZoneId
import java.util.*

class UserSession(val user : User, cityBusHelper: CityBusHelper) {

    val arrivalTimes = ArrivalTimes(cityBusHelper)
    var busStopGroupName = ""
    val uniqueSessionId = if(this.user.name == "pi") "1" else UUID.randomUUID().toString()
    var lastQueryTime : LocalDateTime = now(ZoneId.of("Asia/Hong_Kong"))

    fun changeConfig(newDesiredBusStopGroupName: String) {
        this.arrivalTimes.setToNotLoaded()
        this.busStopGroupName = newDesiredBusStopGroupName
        this.arrivalTimes.clearDesiredBusStops()
        this.arrivalTimes.addSeveralDesiredBusStop(user.getAllChosenBusStopsForGroup(newDesiredBusStopGroupName))
    }

    fun setLastQueryTimeToNow() {
        this.lastQueryTime = now(ZoneId.of("Asia/Hong_Kong"))
    }
}