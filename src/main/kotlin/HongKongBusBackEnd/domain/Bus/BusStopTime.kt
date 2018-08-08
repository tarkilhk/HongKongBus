package HongKongBusBackEnd.domain.bus

data class BusStopTime(val busNumber: Int, val arrivalTime: String, private val rawDistance: String){
    val distance = rawDistance.replace("Distance: ", "")

    override fun toString(): String = "Bus $busNumber @ $distance - $arrivalTime"
}