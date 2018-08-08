package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.bus.BusStopConfig
import HongKongBusBackEnd.domain.userProfilePersistence.DesiredBusStop
import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.userProfilePersistence.DesiredBusStopRepository
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
class desiredBusStopsController(val userRepository: UserRepository, val desiredBusStopRepository: DesiredBusStopRepository){

    @RequestMapping("/desiredBusStops")
    fun getDesiredBusStops(@RequestParam(value="name") name: String):MutableList<BusStopConfig>
    {
        val connectedUser: User? = userRepository.findByName(name).firstOrNull()
        val desiredBusStops: MutableList<DesiredBusStop> = desiredBusStopRepository.findByUsers(listOf(connectedUser!!))
        //TODO : if connectedUser is null
        val myBusStopConfig = mutableListOf<BusStopConfig>()
        for(desiredBusStop in desiredBusStops){
            myBusStopConfig.add(BusStopConfig(desiredBusStop.busNumber, desiredBusStop.busStopUniqueId, desiredBusStop.stopNumberOnBusLine))
        }
        return(myBusStopConfig)
    }
}