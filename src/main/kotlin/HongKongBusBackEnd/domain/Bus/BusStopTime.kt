package HongKongBusBackEnd.domain.bus

data class BusStopTime(val busNumber: String, val arrivalTime: String, private val rawDistance: String) {
    val distance = rawDistance.replace("Distance: ", "")
    val isIsAnError = busNumber == "-1"
    val arrivalTime24H = arrivalTime.replace("00","24")

    override fun toString(): String = "Bus $busNumber @ $distance - $arrivalTime"
}