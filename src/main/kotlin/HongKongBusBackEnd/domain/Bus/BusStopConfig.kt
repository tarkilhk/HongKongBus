package HongKongBusBackEnd.domain.bus

import java.util.*

data class BusStopConfig(
        val busNumber: String,
        internal val busStopUniqueId: String,
        val stopNumberOnBusLine: Int)
{

    override fun toString(): String = "Bus #$busNumber - Stop $busStopUniqueId # $stopNumberOnBusLine"

    override fun hashCode(): Int {
        return (Objects.hash(busNumber, busStopUniqueId,  stopNumberOnBusLine))
    }

    override fun equals(other: Any?): Boolean {
        if (other == null || javaClass != other.javaClass) return false
        val that = other as BusStopConfig
        return this.busNumber == that.busNumber &&
                this.busStopUniqueId == that.busStopUniqueId &&
                this.stopNumberOnBusLine == that.stopNumberOnBusLine
    }
}