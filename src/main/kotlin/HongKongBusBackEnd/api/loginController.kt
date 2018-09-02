package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.domain.userSessions.UserSessionManager
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class loginController(val sessionManager: UserSessionManager){

    @RequestMapping("/login")
    fun loginController(@RequestParam(value="userName") name: String) : ResponseEntity<String>
    {
        if(sessionManager.sessionExistsFor(name)) {
            val mySession = this.sessionManager.getUserSessionForUserName(name)!!
            mySession.setLastQueryTimeToNow()
            return ResponseEntity(mySession.uniqueSessionId,HttpStatus.OK)
        }
        else {
            val user: User? = this.sessionManager.userRepository.findByName(name).firstOrNull()
            if (user == null) {
                return ResponseEntity("User not found", HttpStatus.INTERNAL_SERVER_ERROR)
                //return user not found + http code
            } else {
                //return sessionId + 200
                return ResponseEntity(this.sessionManager.addNewUserSession(user).uniqueSessionId, HttpStatus.OK)
            }
        }
    }
}
