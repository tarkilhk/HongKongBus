package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.Bus.BusStopTime
import HongKongBusBackEnd.domain.userSessions.UserSession
import HongKongBusBackEnd.domain.userSessions.UserSessionManager
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

    @RequestMapping("/nextBusesTimesFor", method = [(RequestMethod.GET)])
    fun getNextBusesTimesFor(
            @RequestParam(value="userName") userName: String,
            @RequestParam(value="configName", defaultValue = "") configName: String) : MutableList<BusStopTime>? {

        var mySession: UserSession? = sessionManager.getUserSessionForUserName(userName)
        if (mySession == null) {
            sessionManager.addNewUserSession(userName,configName)
            mySession = sessionManager.getUserSessionForUserName(userName)
            if (mySession == null) {
                // Couldn't find corresponding config in DB
                //TODO : how to handle this ? other TODO exist for this also
                return null
            }
            else {
                return mySession.arrivalTimes.getAll()
            }
        }
        else {
            // I could find a user and a session for this guy
            if (configName != "") {
                // User wants to change its config, so I change it before answering
                mySession.changeConfig(configName)
            }
            return mySession.arrivalTimes.getAll()
        }
    }
 }