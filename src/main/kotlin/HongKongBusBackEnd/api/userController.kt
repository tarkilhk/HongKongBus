package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.domain.userSessions.UserSessionManager
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
class userController(val sessionManager: UserSessionManager){

    @RequestMapping("/user")
    fun newUser(@RequestParam(value="name") name: String):String
    {
        sessionManager.userRepository.save(User(name))
        return("Done")
    }

    @RequestMapping("/users")
    fun getAll():MutableSet<String>
    {
        val setOfUserNames = mutableSetOf<String>()
        for(user in sessionManager.userRepository.findAll()) {
            setOfUserNames.add(user.name)
        }
        return setOfUserNames
    }

    @RequestMapping("/user/configNames")
    fun getConfigNames(@RequestParam(value="sessionId") sessionId : String): MutableSet<String>
    {
        //TODO protect from fake sessionId
        val setOfConfigNames = mutableSetOf<String>()
        for(desiredBusStop in sessionManager.getUserSessionById(sessionId)!!.user.getAllConfigBusStops()) {
            setOfConfigNames.add(desiredBusStop.shortName)
        }
        return setOfConfigNames
    }
}