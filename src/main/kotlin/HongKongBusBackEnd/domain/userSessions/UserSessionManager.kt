package HongKongBusBackEnd.domain.userSessions

import HongKongBusBackEnd.domain.Bus.ArrivalTimes
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class UserSessionManager(val userRepository: UserRepository) {
    private val userSessions = mutableListOf<UserSession>()

    init{
        this.userRepository.findByName("pi")
        this.addNewUserSession("pi", "CastleDown")
//        this.userRepository.findAll()
    }

    fun addNewUserSession(userName : String, configGroupName : String) {
        val user = this.userRepository.findByName(userName).firstOrNull()
//        user!!.desiredBusStops.size()
        if(user != null) {
            val chosenBusStops = user.getAllChosenBusStopsForGroup(configGroupName)

            if(chosenBusStops.size != 0)
            {
                this.userSessions.add(UserSession(user, configGroupName, ArrivalTimes(chosenBusStops)))
            }
            else {
                // TODO : no config exists in DB for this user
                println("No config exists in DB for user <$userName>, config <$configGroupName>")
            }
        }
        else {
            //TODO : what to do if I cannot find user in DB ??
            println("Cannot find user $userName in DB")
        }
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
}