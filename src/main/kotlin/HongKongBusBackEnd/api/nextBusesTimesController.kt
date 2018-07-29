package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.Bus.BusStopTime
import HongKongBusBackEnd.domain.userSessions.UserSession
import HongKongBusBackEnd.domain.userSessions.UserSessionManager
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class nextBusesTimesController(
        val sessionManager: UserSessionManager){

//    @RequestMapping("/nextBusesTimes")
//    fun getNextBusesTimes():MutableList<BusStopTime> {
//        return arrivalTimes.getAll()
//    }
//
//    @RequestMapping("/nextBusesTimesFor2", method = [(RequestMethod.GET)])
//    fun getNextBusesTimesFor2(
//            @RequestParam(value="userName") userName: String,
//            @RequestParam(value="configName", defaultValue = "") configName: String) : MutableList<BusStopTime>? {
//
//        var mySession: UserSession? = sessionManager.getUserSessionForUserName(userName)
//        if (mySession == null) {
//            sessionManager.addNewUserSession_ToDeprecate(userName,configName)
//            mySession = sessionManager.getUserSessionForUserName(userName)
//            if (mySession == null) {
//                // Couldn't find corresponding config in DB
//                //TODO : how to handle this ? other TODO exist for this also
//                return null
//            }
//            else {
//                return mySession.arrivalTimes.getAll()
//            }
//        }
//        else {
//            // I could find a user and a session for this guy
//            if (configName != "") {
//                // User wants to change its config, so I change it before answering
//                mySession.changeConfig(configName)
//            }
//            return mySession.arrivalTimes.getAll()
//        }
//    }

    @RequestMapping("/nextBusesTimesFor", method = [(RequestMethod.GET)])
    fun getNextBusesTimesFor(
            @RequestParam(value="sessionId") sessionId: String,
            @RequestParam(value="configName", defaultValue = "") configName: String) : ResponseEntity<MutableList<BusStopTime>?> {

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
            return ResponseEntity(mySession.arrivalTimes.getAll(),HttpStatus.OK)
        }
        else {
            return ResponseEntity(mutableListOf<BusStopTime>(), HttpStatus.NOT_FOUND)
        }
    }
 }