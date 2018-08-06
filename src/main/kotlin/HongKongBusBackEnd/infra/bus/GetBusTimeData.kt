package HongKongBusBackEnd.infra.bus

import HongKongBusBackEnd.domain.Bus.BusStopConfig
import HongKongBusBackEnd.domain.Bus.BusStopTime
import khttp.responses.Response
import khttp.structures.cookie.CookieJar
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements


fun loadFirstWebPageAndReturnCookies(): CookieJar {
    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1")
    return(response.cookies)
}

fun setBusStopDetailsAndGetResponseCode(myCookies: CookieJar, chosenBusStop: BusStopConfig): Int{
    val myOwnCookies = mutableMapOf("PPFARE" to "1")
    var mySessionId = ""

    for (myCookie in myCookies) {
        when (myCookie.key) {
            "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value.split(";")[0]
            "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value.split(";")[0]
            "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value.split(";")[0]
            else -> { // Note the block
                myOwnCookies[myCookie.key] = myCookie.value.split(";")[0]
                mySessionId = myCookie.key
            }
        }
    }
    val payload = mapOf("ssid" to mySessionId, "info" to "${chosenBusStop.busStopUniqueId}||${chosenBusStop.busNumber}-CEF-1||${chosenBusStop.stopNumberOnBusLine}||O")

    val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/auto_f4e2775471494a2fa5dca47c4a6f44b2.php", params = payload, cookies = myCookies)
    return response.statusCode
}

fun getNextTimesForPreviouslySetBusStop(myCookies: CookieJar, busStopNumber: Int): MutableList<BusStopTime>{
    val myOwnCookies = mutableMapOf("PPFARE" to "1")
    var mySessionId = ""
    val arrivalTimes = mutableListOf<BusStopTime>()

    for(myCookie in myCookies) {
        when (myCookie.key) {
            "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value.split(";")[0]
            "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value.split(";")[0]
            "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value.split(";")[0]
            "LANG" -> myOwnCookies["LANG"] = myCookie.value.split(";")[0]
            else -> { // Note the block
                myOwnCookies[myCookie.key] = myCookie.value.split(";")[0]
                mySessionId = myCookie.key
            }
        }
    }
    val payload = mapOf("l" to "1","ssid" to mySessionId)

    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/auto_2d8c3061cca24efd91c6259ee931a0da.php", params= payload, cookies=myOwnCookies)
    val message : String = response.text

    val resultingDocument : Document = Jsoup.parse(message)
    val tableRows : Elements = resultingDocument.select("div#nextbus_listitem > table")

    if(tableRows.isNotEmpty()){
        for (myRow in tableRows) {
            val myCells = myRow.select("td").filter { it.childNodeSize()== 1 }
            if(myCells.size==3){
                arrivalTimes.add(BusStopTime(busStopNumber, myCells.elementAt(0).text(), myCells.elementAt(2).text()))
            }
            else{
                //table found but no 3 td in it ?
                println("No 3 TD")
            }
        }
    }
    else{
        //No bus found
//        println("No Table Rows for bus $busStopNumber")
    }
    return(arrivalTimes)
}