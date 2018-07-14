package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.Bus.ArrivalTimes
import HongKongBusBackEnd.domain.userProfilePersistence.User

class UserSession(val user : User, var busStopGroupName : String, val arrivalTimes : ArrivalTimes) {

    init{
        this.changeConfig(busStopGroupName)
    }

    fun changeConfig(newDesiredBusStopGroupName: String) {
        this.busStopGroupName = newDesiredBusStopGroupName
        this.arrivalTimes.clearDesiredBusStops()
        for(chosenBusStop in user.getAllChosenBusStopsForGroup(this.busStopGroupName)) {
            this.arrivalTimes.addDesiredBusStop(chosenBusStop)
        }
        this.arrivalTimes.refreshDataLoop()
    }
}