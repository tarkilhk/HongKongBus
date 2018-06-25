package HongKongBusBackEnd.domain

data class BusStopTime(val busNumber: Int, val arrivalTime: String, private val rawDistance: String){
//    val arrivalTime = rawArrivalTime.replace("00:","24:")
    val distance = rawDistance.replace("Distance: ", "")

    override fun toString(): String = "Bus $busNumber @ $distance - $arrivalTime"
}