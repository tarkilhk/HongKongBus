package HongKongBusBackEnd

import HongKongBusBackEnd.domain.ArrivalTimes
import HongKongBusBackEnd.infra.DesiredBusStops
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HongKongBusApplication

var arrivalTimes = ArrivalTimes()
val desiredBusStops = DesiredBusStops()

fun main(args: Array<String>) {
    runApplication<HongKongBusApplication>(*args)
}