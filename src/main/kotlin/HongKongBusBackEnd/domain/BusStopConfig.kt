package HongKongBusBackEnd.domain

import java.util.*

data class BusStopConfig(val busNumber: Int, val stopId: String, val stopNumberOnBusLine: Int) {

    override fun toString(): String = "Bus #$busNumber - Stop $stopId # $stopNumberOnBusLine"

    override fun hashCode(): Int {
        return (Objects.hash(busNumber, stopId,  stopNumberOnBusLine))
    }

    override fun equals(other: Any?): Boolean {
        if (other == null || javaClass != other.javaClass) return false
        val that = other as BusStopConfig
        return this.busNumber == that.busNumber &&
                this.stopId == that.stopId &&
                this.stopNumberOnBusLine == that.stopNumberOnBusLine
    }
}