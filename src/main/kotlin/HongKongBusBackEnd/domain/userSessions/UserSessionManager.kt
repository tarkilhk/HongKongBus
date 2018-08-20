package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.ZoneId

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

    @Scheduled(fixedDelay = 600_000)
    fun PruneSessionInactiveForMoreThan30Minutes(){
        val userSessionsToDelete = mutableListOf<UserSession>()
        for(userSession in userSessions) {
            if(userSession.lastQueryTime.plusMinutes(30).isBefore(LocalDateTime.now()) && ! userSession.user.name.equals("pi")) {
                userSessionsToDelete.add(userSession)
            }
        }

        for(userSessionToDelete in userSessionsToDelete) {
            this.removeUserSession(userSessionToDelete)
            println("${LocalDateTime.now()} - Pruned userSession ${userSessionToDelete.user.name} - ${userSessionToDelete.busStopGroupName} - Age : ${userSessionToDelete.lastQueryTime}")
            println("${this.userSessions.size} sessions remaining :")
            for(mySession in this.userSessions) {
                println("${mySession.user} - ${mySession.busStopGroupName} last activity at ${mySession.lastQueryTime}")
            }
        }
    }

    private fun removeUserSession(userSessionToDelete: UserSession) {
        this.userSessions.remove(userSessionToDelete)
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

    fun sessionIdExists(sessionId: String): Boolean {
        return( this.userSessions.find { it.uniqueSessionId == sessionId } != null)
    }

    @Scheduled(cron="0 0 5 * * *", zone="Asia/Hong_Kong")
//    @Scheduled(fixedDelay = 20_000)
    fun InitialiseCookiesAndSetGetURLsForAliveSessions() {
        for(userSession in userSessions) {
            userSession.arrivalTimes.reinitialiseCookiesAndSetGetURLsForAliveSessions()
            println("${LocalDateTime.now(ZoneId.of("Asia/Hong_Kong"))} Refreshed Cookies and SetGetURLs for ${userSession.user.name}")
        }
    }
}

