package HongKongBusBackEnd.domain.userProfilePersistence

import javax.persistence.*


@Entity
@Table(name = "DESIRED_BUS_STOPS")
data class DesiredBusStop (
        @Id @GeneratedValue(strategy = GenerationType.AUTO)
        private val desiredBusStopId: Long = -1,

        val shortName : String,

        val busNumber: Int,

        internal val busStopUniqueId: String,

        val stopNumberOnBusLine: Int,

        @ManyToMany(mappedBy = "desiredBusStops")
//        @ManyToMany(fetch = FetchType.EAGER, mappedBy = "desiredBusStops")
        val users: List<User> = mutableListOf<User>()
        ) {
    private constructor() : this(-1, "", 0, "", 0)

    override fun toString(): String {
            return String.format(
                    "DesiredBusStop id=$desiredBusStopId : $busNumber-$busStopUniqueId-$stopNumberOnBusLine")
        }
}