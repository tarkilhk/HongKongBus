package HongKongBusBackEnd.infra.UserLoginEvenHandling

import HongKongBusBackEnd.domain.userSessions.UserSession
import com.google.common.eventbus.EventBus
import org.springframework.stereotype.Component

@Component
class NewUserSessionEventBus() {
    final val eventBus = EventBus()

    init {
        eventBus.register(NewUserSessionListener())
    }

    fun post(newUserSession: UserSession) {
        eventBus.post(newUserSession)
    }
}