package HongKongBusBackEnd.api

import HongKongBusBackEnd.domain.ArrivalTimes
import HongKongBusBackEnd.domain.BusStopTime
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RestController
class GetNextBusesTimesController(
        val arrivalTimes: ArrivalTimes){


    @RequestMapping("/nextBusesTimes")
    fun getNextBusesTimes():MutableList<BusStopTime> {
        return arrivalTimes.getAll()
    }
}


@RestController
class GetStatic(){

    @Autowired
    lateinit var arrivalTimes: ArrivalTimes

    @RequestMapping("/getStatic", method = [(RequestMethod.GET)])
    fun getNextBusesTimes() = arrivalTimes.getStatic()
}