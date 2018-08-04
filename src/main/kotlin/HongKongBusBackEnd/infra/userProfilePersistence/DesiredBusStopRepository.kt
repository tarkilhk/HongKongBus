package HongKongBusBackEnd.infra.userProfilePersistence

import HongKongBusBackEnd.domain.userProfilePersistence.DesiredBusStop
import HongKongBusBackEnd.domain.userProfilePersistence.User
import org.springframework.data.repository.CrudRepository

interface DesiredBusStopRepository : CrudRepository<DesiredBusStop, Long> {

    fun findByUsers(users: List<User>): MutableList<DesiredBusStop>
}