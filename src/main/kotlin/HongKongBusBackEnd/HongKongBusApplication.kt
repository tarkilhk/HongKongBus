package HongKongBusBackEnd

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class HongKongBusApplication

fun main(args: Array<String>) {
    runApplication<HongKongBusApplication>(*args)
}