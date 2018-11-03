package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.userSessions.UserSessionManager
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/session")
class sessionController(val sessionManager: UserSessionManager){

    @GetMapping("/configNames")
    fun getConfigNames(@RequestParam(value="sessionId") sessionId : String): MutableSet<String>
    {
        if(sessionManager.sessionIdExists(sessionId)) {
            val setOfConfigNames = mutableSetOf<String>()
            for (desiredBusStop in sessionManager.getUserSessionById(sessionId)!!.user.getAllConfigBusStops()) {
                setOfConfigNames.add(desiredBusStop.shortName)
            }
            return setOfConfigNames
        }
        else {
            return mutableSetOf("Session $sessionId does not exist, please restart app")
        }
    }

    @PostMapping("/changeConfigName")
    fun changeConfigName(@RequestParam(value="sessionId") sessionId: String, @RequestParam(value="configName") configName : String) : ResponseEntity<String> {
        if(sessionManager.sessionIdExists(sessionId)) {
            //TODO : protect from unknown configName
            sessionManager.getUserSessionById(sessionId)!!.changeConfig(configName)
            return ResponseEntity("configName change to $configName", HttpStatus.OK)
        }
        else {
            return ResponseEntity("sessionId $sessionId doesn't exist", HttpStatus.UNAUTHORIZED)
        }
    }
}