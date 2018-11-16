package HongKongBusBackEnd.infra.UserLoginEvenHandling

import HongKongBusBackEnd.domain.userSessions.UserSession
import com.google.common.eventbus.AsyncEventBus
import org.springframework.stereotype.Component
import java.util.concurrent.Executors



@Component
class NewUserSessionEventBus(newUserSessionListener: NewUserSessionListener) {
    final val eventBus = AsyncEventBus(Executors.newFixedThreadPool(30))

    init {
        eventBus.register(newUserSessionListener)
    }

    fun post(newUserSession: UserSession) {
        eventBus.post(newUserSession)
    }
}