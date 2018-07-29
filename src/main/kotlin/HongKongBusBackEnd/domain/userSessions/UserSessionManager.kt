package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class UserSessionManager(val userRepository: UserRepository) {
    private val userSessions = mutableListOf<UserSession>()

    init{
        val pi = this.userRepository.findByName("pi").firstOrNull()
        val piUserSession = this.addNewUserSession(pi!!)
        piUserSession.changeConfig("CastleDown")
    }

    fun addNewUserSession(existingUser : User) : UserSession {
        val newUserSession = UserSession(existingUser, "")
        this.userSessions.add(newUserSession)
        return newUserSession
    }

//    fun addNewUserSession_ToDeprecate(userName : String, configGroupName : String) {
//        val user = this.userRepository.findByName(userName).firstOrNull()
////        user!!.desiredBusStops.size()
//        if(user != null) {
//            val chosenBusStops = user.getAllChosenBusStopsForGroup(configGroupName)
//
//            if(chosenBusStops.size != 0)
//            {
//                val newUserSession = UserSession(user, configGroupName)
//                this.userSessions.add(newUserSession)
//            }
//            else {
//                // TODO : no config exists in DB for this user
//                println("No config exists in DB for user <$userName>, config <$configGroupName>")
//            }
//        }
//        else {
//            //TODO : what to do if I cannot find user in DB ??
//            println("Cannot find user $userName in DB")
//        }
//    }

    fun removeUserSession(userSessionToDelete: UserSession) {
        userSessions.remove(userSessionToDelete)
    }

//    fun getArrivalTimesFor(myUser:User) : ArrivalTimes?{
//        if(this.userSessions.size == 0) {
//            return null
//        }
//        else {
//            return this.userSessions.filter { it.user == myUser }.firstOrNull().arrivalTimes
//        }
//    }
//
//    fun getUser(userName : String) : User? {
//        if(this.userSessions.size == 0) {
//            return null
//        }
//        else {
//            return this.userSessions.filter { it.user.name == userName }.firstOrNull().user
//        }
//    }

    fun getUserSessionForUserName(userName : String) : UserSession? {
        if(this.userSessions.size == 0) {
            return null
        }
        else {
            return this.userSessions.filter { it.user.name == userName }.firstOrNull()
        }
    }

    @Scheduled(fixedDelay = 20_000)
    fun RefreshArrivalTimesForAllSessions(){
        for(userSession in userSessions) {
            userSession.arrivalTimes.refreshDataLoop()
            println("${LocalDateTime.now()} - Refreshed ArrivalTimes for ${userSession.user.name} - ${userSession.busStopGroupName}")
        }
    }

//    @Scheduled(fixedDelay = 300_000)
    @Scheduled(fixedDelay = 30_000)
    fun PruneSessionInactiveForMoreThan30Minutes(){
        val userSessionsToDelete = mutableListOf<UserSession>()
        for(userSession in userSessions) {
            //TODO : Revert back to 30 minutes after code is tested
//            if(userSession.lastQueryTime.plusSeconds(10).isBefore(LocalDateTime.now())) {
            if(userSession.lastQueryTime.plusMinutes(30).isBefore(LocalDateTime.now())) {
                userSessionsToDelete.add(userSession)
            }
        }

        for(userSessionToDelete in userSessionsToDelete) {
//            this.removeUserSession(userSessionToDelete)
            //TODO : Actually delete userSession after code is tested
            println("${LocalDateTime.now()} - Pruned userSession ${userSessionToDelete.user.name} - ${userSessionToDelete.busStopGroupName} - Age : ${userSessionToDelete.lastQueryTime}")
            println("${this.userSessions.size} sessions remaining :")
            for(mySession in this.userSessions) {
                println("${mySession.user} - ${mySession.busStopGroupName} last activity at ${mySession.lastQueryTime}")
            }
        }
    }

    fun getUserSessionById(sessionId: String): UserSession? {
        val returnUserSession = userSessions.find { it.uniqueSessionId == sessionId }
        if(returnUserSession != null) {
            returnUserSession.setLastQueryTimeToNow()
        }
        return returnUserSession
    }

    fun sessionExistsFor(name: String): Boolean {
        return(userSessions.find { it.user.name == name } != null)
    }
}

private fun LocalDateTime.isBefore(now: LocalDateTime?): Boolean {
    return isBefore(now)
}
