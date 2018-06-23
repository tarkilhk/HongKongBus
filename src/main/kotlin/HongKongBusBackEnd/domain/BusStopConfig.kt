package HongKongBusBackEnd.domain

import java.util.*

data class BusStopConfig(val busNumber: Int, val stopName: String, val stopId: String, val stopNumber: Int) {

    override fun toString(): String = "Bus #$busNumber - Stop $stopId $stopName @ $stopNumber"

    override fun hashCode(): Int {
        return (Objects.hash(busNumber, stopName, stopId,  stopNumber))
    }

    override fun equals(other: Any?): Boolean {
        if (other == null || javaClass != other.javaClass) return false
        val that = other as BusStopConfig
        return this.busNumber == that.busNumber &&
                this.stopName == that.stopName &&
                this.stopId == that.stopId &&
                this.stopNumber == that.stopNumber
    }
}