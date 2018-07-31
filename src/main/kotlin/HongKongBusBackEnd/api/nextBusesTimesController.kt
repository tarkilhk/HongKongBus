package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.userSessions.UserSession
import HongKongBusBackEnd.domain.userSessions.UserSessionManager
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
class nextBusesTimesController(
        val sessionManager: UserSessionManager){

    @RequestMapping("/nextBusesTimesFor", method = [(RequestMethod.GET)])
    fun getNextBusesTimesFor(
            @RequestParam(value="sessionId") sessionId: String,
            @RequestParam(value="configName", defaultValue = "") configName: String) : ResponseEntity<HashMap<String, Any>> {

        var mySession: UserSession? = sessionManager.getUserSessionById(sessionId)
        if (mySession != null) {
            if (configName != "") {
                // User wants to change its config, so I change it before answering
                mySession.changeConfig(configName)
            }
            else {
                if(mySession.busStopGroupName == null) {
                    //This session has never been initialised
                    //Or it has been initialised with default config from DB, which is empty
                }
            }
            return ResponseEntity(mySession.arrivalTimes.getResult(),HttpStatus.OK)
        }
        else {
            return ResponseEntity(HashMap(), HttpStatus.NOT_FOUND)
        }
    }
 }