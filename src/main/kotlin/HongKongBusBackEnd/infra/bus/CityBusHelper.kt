package HongKongBusBackEnd.infra.bus

import HongKongBusBackEnd.domain.Bus.BusStopConfig
import HongKongBusBackEnd.domain.Bus.BusStopTime
import khttp.responses.Response
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements


class CityBusHelper {
    private var urlOfSetBusStop = ""
    private var urlOfGetBusStopETA = ""
    private var cookies : MutableMap<String, String> = mutableMapOf()
    private var sessionId : String = ""

    init{
        loadFirstWebPageAndSaveCookies()
        loadSetGetURLsFromFB()
    }

    fun loadFirstWebPageAndSaveCookies() {
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1")
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

    fun loadSetGetURLsFromFB() {
        var inMapClickAction = false
        var inShowETA = false

        val payload = mapOf("ssid" to this.sessionId)
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/fb.php", params = payload, cookies = this.cookies)

        val message: String = response.text.replace(" ","")
        val myCleanedLines = message.lines().dropWhile { it.startsWith("//") }
        for (line in myCleanedLines)
        {
            if(line.contains("functionmapclickaction(evt,location){"))
            {
                inMapClickAction = true
            }
            if(inMapClickAction) {
                if(line.contains("makeRequest('")) {
                    this.urlOfSetBusStop = line.split("?")[0].replace("makeRequest('","")
                    inMapClickAction = false
                }
            }
        }

        for (line in myCleanedLines)
        {
            if(line.contains("functionshoweta(){"))
            {
                inShowETA = true
            }
            if(inShowETA) {
                if(line.contains("makeRequestref('")) {
                    this.urlOfGetBusStopETA = line.split("?")[0].replace("makeRequestref('","")
                    inShowETA = false
                }
            }
        }
    }

    fun setBusStopDetailsAndGetResponseCode(chosenBusStop: BusStopConfig): MutableMap<String, String> {
        val answer : MutableMap<String, String> = mutableMapOf()

        val payload = mapOf("ssid" to this.sessionId, "info" to "${chosenBusStop.busStopUniqueId}||${chosenBusStop.busNumber}-CEF-1||${chosenBusStop.stopNumberOnBusLine}||O")

        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfSetBusStop", params = payload, cookies = this.cookies)

        answer["statusCode"] = response.statusCode.toString()
        answer["body"] = response.text

        return answer
    }

    fun getNextTimesForPreviouslySetBusStop(busStopNumber: Int): MutableList<BusStopTime> {
        val arrivalTimes = mutableListOf<BusStopTime>()

        val payload = mapOf("l" to "1", "ssid" to this.sessionId)

        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfGetBusStopETA", params = payload, cookies = this.cookies)
        val message: String = response.text

        val resultingDocument: Document = Jsoup.parse(message)
        val tableRows: Elements = resultingDocument.select("div#nextbus_listitem > table")

        if (tableRows.isNotEmpty()) {
            for (myRow in tableRows) {
                val myCells = myRow.select("td").filter { it.childNodeSize() == 1 }
                if (myCells.size == 3) {
                    arrivalTimes.add(BusStopTime(busStopNumber, myCells.elementAt(0).text(), myCells.elementAt(2).text()))
                } else {
                    //table found but no 3 td in it ?
                    println("No 3 TD")
                }
            }
        } else {
            //No bus found
//        println("No Table Rows for bus $busStopNumber")
        }
        return (arrivalTimes)
    }
}