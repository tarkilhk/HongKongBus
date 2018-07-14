package HongKongBusBackEnd.infra.userProfilePersistence

import HongKongBusBackEnd.domain.userProfilePersistence.User
import org.springframework.data.repository.CrudRepository


interface UserRepository : CrudRepository<User, Long> {

    fun findByName(name: String): List<User>
}