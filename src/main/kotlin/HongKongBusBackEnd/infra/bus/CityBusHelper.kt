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
    private val log = LoggerFactory.getLogger(this.javaClass)
    private var urlOfSetBusStop = ""
    private var urlOfGetBusStopETA = ""
    private var cookies : MutableMap<String, String> = mutableMapOf()
    private var sessionId : String = ""
    private val sysIDManager : SysIDManager = SysIDManager()

    init{
        log.info("Initialising CityBusHelper Service")
        reinitialiseSession()
    }

    private fun reinitialiseSession(){
        log.info("Recreating a fresh session")
        loadFirstWebPageAndSaveCookies()
        loadSetGetURLsFromFB()
    }

    final fun loadFirstWebPageAndSaveCookies() {
        this.sysIDManager.resetSysId()
        var counterForUnmanagedCookieKeys = 0

        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1",timeout=60.0)
        if(response.statusCode == 200) {
            log.info("Retrieved cookies succesfully from landing page")
            val myOwnCookies = mutableMapOf("PPFARE" to "1")

            for (myCookie in response.cookies) {
                when (myCookie.key) {
                    "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value.split(";")[0]
                    "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value.split(";")[0]
                    "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value.split(";")[0]
                    "LANG" -> myOwnCookies["LANG"] = myCookie.value.split(";")[0]
                    "QRSTOP" -> {}
                    else -> { // Note the block
                        counterForUnmanagedCookieKeys = counterForUnmanagedCookieKeys + 1
                        myOwnCookies[myCookie.key] = myCookie.value.split(";")[0]
                        this.sessionId = myCookie.key
                    }
                }
            }
            if(counterForUnmanagedCookieKeys > 1) {
                log.error("The cookies have changed in the landing webpage, I have now 1 more field that I don't know about : it needs to be excluded")
            }
            this.cookies = myOwnCookies
        }
        else {
            log.error("Failed at retrieving cookies from landing page [${response.statusCode}] : ${response.text}")
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
            log.info("Retrieved fb.php content successfully")
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
            log.error("Failed at retrieving SetGet URLs in fb.php [${response.statusCode}] : ${response.text}")
        }
        if(!foundGetURL) {
            log.error("Couldn't find GET URL in fb.php")
        }
        if(!foundSetURL) {
            log.error("Couldn't find SET URL in fb.php")
        }
    }

    fun setBusStopDetailsAndGetResponseCode(chosenBusStop: BusStopConfig): MutableMap<String, String> {
        val answer : MutableMap<String, String> = mutableMapOf()

        val payload = mapOf("ssid" to this.sessionId, "info" to buildInfoString(chosenBusStop))
        log.info("Before I try to set bus time for ${chosenBusStop.busNumber}")
        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfSetBusStop", params = payload, cookies = this.cookies)

        answer["statusCode"] = response.statusCode.toString()
        answer["body"] = response.text

        return answer
    }

    fun getNextTimesForPreviouslySetBusStop(busStopNumber: String): MutableList<BusStopTime> {
        val arrivalTimes = mutableListOf<BusStopTime>()

        val responseCheckSuccess: Response
        val payLoadCheckSuccess = mutableMapOf("ssid" to this.sessionId)

        // I need to checkCall first
        val responseCheckCall: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/checkCall.php", params = mapOf("type" to "ETA", "ssid" to this.sessionId, "sysid" to this.sysIDManager.getNextValidSysID()), cookies = this.cookies)
        if(responseCheckCall.statusCode == 200) {
            log.info("Retrieved checkCall content successfully")
            val bodyCheckCall: String = responseCheckCall.text
            val resultingDocumentCheckCall: Document = Jsoup.parse(bodyCheckCall)
            val onloadMakeRequest = resultingDocumentCheckCall.select("[onload^=makeRequest]").attr("onload").toString()
            if (onloadMakeRequest.isNotEmpty()) {
                val (URLCheckSuccess, params) = onloadMakeRequest.split('"')[1].split("?")
                payLoadCheckSuccess.put("sysid", this.sysIDManager.getNextValidSysID())
                params.split("&").forEach{
                    payLoadCheckSuccess.put(it.split("=")[0],it.split("=")[1])
                }

                // Now I need to checkSuccess
                responseCheckSuccess = khttp.get("https://mobile.nwstbus.com.hk/nwp3/" + URLCheckSuccess, params = payLoadCheckSuccess, cookies = this.cookies)
                if(responseCheckSuccess.statusCode == 200) {
                    log.info("Retrieved checkSuccess content successfully")
                }
                else {
                    log.error("Could not Check Success - status [" + responseCheckSuccess.statusCode + "] : " + responseCheckSuccess.text)
                }
            }
            else{
                log.warn("Couldn't find 'makeRequest' property in the CheckCall call - body = " + responseCheckCall.text)
                // This means that the website is asking for some captcha identification
                // I will restart from new session
                this.reinitialiseSession()
                return mutableListOf<BusStopTime>()
            }
        }
        else {
            log.error("Could not Check Call - status [" + responseCheckCall.statusCode + "] : " + responseCheckCall.text)
        }

        // Now I can get the ETA

        val payload = mapOf("l" to "1", "ssid" to this.sessionId, "sysid" to this.sysIDManager.getNextNextValidSysID())

        val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/$urlOfGetBusStopETA", params = payload, cookies = this.cookies)
        if(response.statusCode == 200) {
            log.info("Retrieved GetBusStopETA content successfully")

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
                        log.error("GetBusStopETA is successful, contains a table, but cells don't follow expected format for bus $busStopNumber")
                    }
                }
            } else {
                //No bus found
                log.warn("GetBusStopETA is successful, but no Table Rows for bus $busStopNumber")
                if (tableRowsNextbus_list.isNotEmpty()) {
                    val errorMessage = tableRowsNextbus_list[0].select("td")[0].text()
                    log.warn(errorMessage)
                    arrivalTimes.add(BusStopTime("-1", "$busStopNumber - $errorMessage","-1"))
                }
                else {
                    log.warn("No reason found on CityBus website")
                }
            }
        }
        else {
            log.error("Failed at retrieving GetBusStopETA [${response.statusCode}] : ${response.text}")
        }
        return (arrivalTimes)
    }

    fun buildInfoString(chosenBusStop: BusStopConfig):String{
        return chosenBusStop.info_hkbus
    }
}