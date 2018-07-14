package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.userProfilePersistence.User
import HongKongBusBackEnd.infra.userProfilePersistence.UserRepository
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
class userController(val UserRepository: UserRepository){

    @RequestMapping("/user")
    fun newUser(@RequestParam(value="name") name: String):String
    {
        UserRepository.save(User(name))
        return("Done")
    }
}