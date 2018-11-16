package HongKongBusBackEnd.infra.UserLoginEvenHandling

import HongKongBusBackEnd.domain.userSessions.UserSession
import com.google.common.eventbus.AllowConcurrentEvents
import com.google.common.eventbus.Subscribe
import org.springframework.stereotype.Service


@Service
class NewUserSessionListener(){

    @Subscribe
    @AllowConcurrentEvents
    fun handle(userSession:UserSession) {
        userSession.arrivalTimes.refreshDataLoop()
    }
}