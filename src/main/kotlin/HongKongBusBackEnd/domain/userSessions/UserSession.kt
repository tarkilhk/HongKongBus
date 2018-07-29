package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.Bus.ArrivalTimes
import HongKongBusBackEnd.domain.userProfilePersistence.User
import java.time.LocalDateTime
import java.time.LocalDateTime.now
import java.util.*

class UserSession(val user : User, var busStopGroupName : String) {

    val arrivalTimes = ArrivalTimes(user.getAllChosenBusStopsForGroup(busStopGroupName))
    val uniqueSessionId = if(this.user.name == "pi") "1" else UUID.randomUUID().toString()
    var lastQueryTime : LocalDateTime = now()

    init{
        this.arrivalTimes.refreshDataLoop()
    }

    fun changeConfig(newDesiredBusStopGroupName: String) {
        this.busStopGroupName = newDesiredBusStopGroupName
        this.arrivalTimes.clearDesiredBusStops()
        this.arrivalTimes.addSeveralDesiredBusStop(user.getAllChosenBusStopsForGroup(newDesiredBusStopGroupName))

        this.arrivalTimes.refreshDataLoop()
    }

    fun setLastQueryTimeToNow() {
        this.lastQueryTime = now()
    }
}