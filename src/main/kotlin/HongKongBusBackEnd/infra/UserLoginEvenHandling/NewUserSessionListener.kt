package HongKongBusBackEnd.infra.UserLoginEvenHandling

import HongKongBusBackEnd.domain.userSessions.UserSession
import com.google.common.eventbus.Subscribe
import org.springframework.stereotype.Service


@Service
class NewUserSessionListener(){
//class NewUserSessionListener(val userSessionManager: UserSessionManager){

    @Subscribe
    fun handle(userSession:UserSession) {

//        userSessionManager.getUserSessionForUserName(newlyLoggedInUserSession.user.name)!!.arrivalTimes.refreshDataLoop()
        userSession.arrivalTimes.refreshDataLoop()
    }
}