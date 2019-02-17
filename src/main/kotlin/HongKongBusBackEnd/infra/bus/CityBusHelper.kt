package HongKongBusBackEnd.infra.bus

import HongKongBusBackEnd.domain.bus.BusStopConfig
import HongKongBusBackEnd.domain.bus.BusStopTime
import khttp.responses.Response
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class CityBusHelper {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    private var urlOfSetBusStop = ""
    private var urlOfGetBusStopETA = ""
    private var cookies : MutableMap<String, String> = mutableMapOf()
    private var sessionId : String = ""

    init{
        logger.info("Initialising CityBusHelper Service")
        loadFirstWebPageAndSaveCookies()
        loadSetGetURLsFromFB()
    }

    final fun loadFirstWebPageAndSaveCookies() {
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1",timeout=60.0)
        if(response.statusCode == 200) {
            logger.info("Retrieved cookies succesfully from landing page")
            val myOwnCookies = mutableMapOf("PPFARE" to "1")

            for (myCookie in response.cookies) {
                when (myCookie.key) {
                    "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value.split(";")[0]
                    "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value.split(";")[0]
                    "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value.split(";")[0]
                    "LANG" -> myOwnCookies["LANG"] = myCookie.value.split(";")[0]
                    else -> { // Note the block
                        myOwnCookies[myCookie.key] = myCookie.value.split(";")[0]
                        this.sessionId = myCookie.key
                    }
                }
            }
            this.cookies = myOwnCookies
        }
        else {
            logger.error("Failed at retrieving cookies from landing page [${response.statusCode}] : ${response.text}")
        }
    }

    final fun loadSetGetURLsFromFB() {
        var inMapClickAction = false
        var inShowETA = false

        var foundSetURL = false
        var foundGetURL = false

        val payload = mapOf("ssid" to this.sessionId)
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/fb.php", params = payload, cookies = this.cookies)

        if(response.statusCode == 200) {
            logger.info("Retrieved fb.php content successfully")
            val message: String = response.text.replace(" ", "")
            val myCleanedLines = message.lines().dropWhile { it.startsWith("//") }
            for (line in myCleanedLines) {
                if (line.contains("functionmapclickaction(evt,location){")) {
                    inMapClickAction = true
                }
                if (inMapClickAction) {
                    if (line.contains("makeRequest('")) {
                        this.urlOfSetBusStop = line.split("?")[0].replace("makeRequest('", "")
                        inMapClickAction = false
                        foundSetURL = true
                    }
                }
            }

            for (line in myCleanedLines) {
                if (line.contains("functionshoweta(){")) {
                    inShowETA = true
                }
                if (inShowETA) {
                    if (line.contains("makeRequestref('")) {
                        this.urlOfGetBusStopETA = line.split("?")[0].replace("makeRequestref('", "")
                        inShowETA = false
                        foundGetURL = true
                    }
                }
            }
        }
        else {
            logger.error("Failed at retrieving SetGet URLs in fb.php [${response.statusCode}] : ${response.text}")
        }
        if(!foundGetURL) {
            logger.error("Couldn't find GET URL in fb.php")
        }
        if(!foundSetURL) {
            logger.error("Couldn't find SET URL in fb.php")
        }
    }

    fun setBusStopDetailsAndGetResponseCode(chosenBusStop: BusStopConfig): MutableMap<String, String> {
        val answer : MutableMap<String, String> = mutableMapOf()

        val payload = mapOf("ssid" to this.sessionId, "info" to buildInfoString(chosenBusStop))
        logger.info("Before I try to set bus time for ${chosenBusStop.busNumber}")
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfSetBusStop", params = payload, cookies = this.cookies)

        answer["statusCode"] = response.statusCode.toString()
        answer["body"] = response.text

        return answer
    }

    fun getNextTimesForPreviouslySetBusStop(busStopNumber: String): MutableList<BusStopTime> {
        val arrivalTimes = mutableListOf<BusStopTime>()

        val payload = mapOf("l" to "1", "ssid" to this.sessionId)

        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfGetBusStopETA", params = payload, cookies = this.cookies)
        if(response.statusCode == 200) {
            logger.info("Retrieved GetBusStopETA content successfully")

            val message: String = response.text

            val resultingDocument: Document = Jsoup.parse(message)
            val tableRowsNextbus_listitem: Elements = resultingDocument.select("div#nextbus_listitem > table")
            val tableRowsNextbus_list: Elements = resultingDocument.select("div#nextbus_list > table")

            if (tableRowsNextbus_listitem.isNotEmpty()) {
                for (myRow in tableRowsNextbus_listitem) {
                    val myCells = myRow.select("td").filter { it.childNodeSize() == 1 }
                    if (myCells.size == 3) {
                        arrivalTimes.add(BusStopTime(busStopNumber, myCells.elementAt(0).text(), myCells.elementAt(2).text()))
                    } else {
                        //table found but no 3 td in it ?
                        logger.error("GetBusStopETA is successful, contains a table, but cells don't follow expected format for bus $busStopNumber")
                    }
                }
            } else {
                //No bus found
                logger.warn("GetBusStopETA is successful, but no Table Rows for bus $busStopNumber")
                if (tableRowsNextbus_list.isNotEmpty()) {
                    val errorMessage = tableRowsNextbus_list[0].select("td")[0].text()
                    logger.warn(errorMessage)
                    arrivalTimes.add(BusStopTime(busStopNumber, errorMessage,"-1"))
                }
                else {
                    logger.warn("No reason found on CityBus website")
                }
            }
        }
        else {
            logger.error("Failed at retrieving GetBusStopETA [${response.statusCode}] : ${response.text}")
        }
        return (arrivalTimes)
    }

    fun buildInfoString(chosenBusStop: BusStopConfig):String{
        return chosenBusStop.info_hkbus
    }
}