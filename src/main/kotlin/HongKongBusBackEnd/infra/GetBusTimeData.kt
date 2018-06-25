package HongKongBusBackEnd.infra

import HongKongBusBackEnd.domain.BusStopConfig
import HongKongBusBackEnd.domain.BusStopTime
import khttp.responses.Response
import khttp.structures.cookie.CookieJar
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements


fun loadFirstWebPageAndReturnCookies(): CookieJar {
    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1")
    return(response.cookies)
}

//TODO return error code
fun setBusStopDetails(myCookies: CookieJar, desiredBusStop: BusStopConfig): Int{
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
    val payload = mapOf("ssid" to mySessionId, "info" to "${desiredBusStop.stopId}||${desiredBusStop.busNumber}-CEF-1||${desiredBusStop.stopNumberOnBusLine}||O")

    val response: Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/set_etasession.php", params = payload, cookies = myCookies)
    return response.statusCode
}

fun getNextTimesForPreviouslySetBusStop(myCookies: CookieJar, busStopNumber: Int): MutableList<BusStopTime>{
    val myOwnCookies = mutableMapOf("PPFARE" to "1")
    var mySessionId = ""
    var arrivalTimes = mutableListOf<BusStopTime>()

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

    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/geteta.php", params= payload, cookies=myOwnCookies)
    val message : String = response.text

    val resultingDocument : Document = Jsoup.parse(message)
    val tableRows : Elements = resultingDocument.select("div#nextbus_listitem > table")

    if(tableRows.isNotEmpty()){
        for (myRow in tableRows) {
            val myCells = myRow.select("td").filter { it.childNodeSize()== 1 }
            if(myCells.size==3){
                arrivalTimes.add(BusStopTime(busStopNumber,myCells.elementAt(0).text(),myCells.elementAt(2).text()))
            }
            else{
                //table found but no 3 td in it ?
                println("No 3 TD")
            }
        }
    }
    else{
        //No bus found
        println("No Table Rows")
    }
    return(arrivalTimes)
}