package HongKongBusBackEnd.infra

import HongKongBusBackEnd.domain.BusStopConfig

class DesiredBusStops {

    private val desiredBusStops = mutableListOf<BusStopConfig>()

    init{
        desiredBusStops.add(BusStopConfig(511,  "Loong Fung Terrace, Tai Hang Road",  "002529",  14))
        desiredBusStops.add(BusStopConfig(11,"Loong Fung Terrace, Tai Hang Road",  "002529",  32))
    }

    fun getAll():MutableList<BusStopConfig>{
        return this.desiredBusStops
    }
}