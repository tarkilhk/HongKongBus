package HongKongBusBackEnd.domain.userProfilePersistence

import HongKongBusBackEnd.domain.Bus.BusStopConfig
import javax.persistence.*


@Entity
@Table(name = "USERS")
data class User (
        val name: String,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private val userId: Long = -1,

        @ManyToMany(fetch = FetchType.EAGER, cascade = arrayOf(CascadeType.ALL))
//        @ManyToMany(cascade = arrayOf(CascadeType.ALL))
        @JoinTable(name = "USERS_DESIRED_BUS_STOPS",
                joinColumns = arrayOf(JoinColumn(name = "USER_ID")),
                inverseJoinColumns = arrayOf(JoinColumn(name = "DESIRED_BUS_STOP_ID")))
        val desiredBusStops:MutableList<DesiredBusStop> = mutableListOf<DesiredBusStop>())
{
    private constructor() : this("")

    override fun toString(): String {
        return String.format(
                "User id=$userId : $name")
    }

    fun getAllConfigBusStops() : MutableList<DesiredBusStop>
    {
        return this.desiredBusStops
    }

    fun getAllConfigBusStopsForGroup(name: String) : MutableList<DesiredBusStop>
    {
        return this.desiredBusStops.filter{it.shortName==name}.toMutableList()
    }

    fun getAllChosenBusStops() : MutableList<BusStopConfig>
    {
        val chosenBusStops = mutableListOf<BusStopConfig>()
        for(desiredBustStop in desiredBusStops) {
            chosenBusStops.add(BusStopConfig(desiredBustStop.busNumber,desiredBustStop.busStopUniqueId,desiredBustStop.stopNumberOnBusLine))
        }
        return chosenBusStops
    }

    fun getAllChosenBusStopsForGroup(name: String) : MutableList<BusStopConfig>
    {
        val desiredBusStops = this.desiredBusStops.filter{it.shortName==name}.toMutableList()
        val chosenBusStops = mutableListOf<BusStopConfig>()
        for(desiredBustStop in desiredBusStops) {
            chosenBusStops.add(BusStopConfig(desiredBustStop.busNumber,desiredBustStop.busStopUniqueId,desiredBustStop.stopNumberOnBusLine))
        }
        return chosenBusStops
    }
}