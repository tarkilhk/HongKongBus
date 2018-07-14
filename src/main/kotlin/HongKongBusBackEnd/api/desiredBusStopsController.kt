package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.Bus.BusStopConfig
import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
class desiredBusStopsController(val userRepository: UserRepository){

    @RequestMapping("/desiredBusStops")
    fun getDesiredBusStops(@RequestParam(value="name") name: String):MutableList<BusStopConfig>
    {
        val connectedUser: User? = userRepository.findByName(name).firstOrNull()
        //TODO : if connectedUser is null
        val myBusStopConfig = mutableListOf<BusStopConfig>()
        for(desiredBusStop in connectedUser!!.getAllConfigBusStops()){
            myBusStopConfig.add(BusStopConfig(desiredBusStop.busNumber, desiredBusStop.busStopUniqueId, desiredBusStop.stopNumberOnBusLine))
        }
        return(myBusStopConfig)
    }
}