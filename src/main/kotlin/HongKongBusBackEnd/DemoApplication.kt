package HongKongBusBackEnd

import khttp.responses.Response
import khttp.structures.cookie.CookieJar
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.select.Elements
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
    val myOriginalCookies: CookieJar = loadFirstWebPageAndReturnSessionID()
    setBusStopDetails(myOriginalCookies)
    getBusStopNextTimes(myOriginalCookies)
}

fun loadFirstWebPageAndReturnSessionID():CookieJar {
    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/?f=1&ds=ETA&l=1")
//    val obj : JSONObject = response.jsonObject
    response.cookies.forEach{
        println(it)
    }
    return(response.cookies)
}

fun setBusStopDetails(myCookies: CookieJar):CookieJar {
    val myOwnCookies = mutableMapOf("PPFARE" to "1")
    var mySessionId : String = ""

    for(myCookie in myCookies) {
        when (myCookie.key) {
            "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value!!.split(";")[0]
            "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value!!.split(";")[0]
            "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value!!.split(";")[0]
            else -> { // Note the block
                myOwnCookies[myCookie.key] = myCookie.value!!.split(";")[0]
                mySessionId = myCookie.key
            }
        }
    }
    val payload = mapOf("ssid" to mySessionId, "info" to "002517||11-CEF-1||18||O")

    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/set_etasession.php", params= payload, cookies = myCookies)
//    val obj : JSONObject = response.jsonObject
    val message : String = response.text
    println(message)
    return response.cookies
}

fun getBusStopNextTimes(myCookies: CookieJar){
    val myOwnCookies = mutableMapOf("PPFARE" to "1")
    var mySessionId : String = ""

    for(myCookie in myCookies) {
        when (myCookie.key) {
            "ETWEBID" -> myOwnCookies["ETWEBID"] = myCookie.value!!.split(";")[0]
            "PHPSESSID" -> myOwnCookies["PHPSESSID"] = myCookie.value!!.split(";")[0]
            "PPFARE" -> myOwnCookies["PPFARE"] = myCookie.value!!.split(";")[0]
            else -> { // Note the block
                myOwnCookies[myCookie.key] = myCookie.value!!.split(";")[0]
                mySessionId = myCookie.key
            }
        }
    }

    println(mySessionId)

    val payload = mapOf("l" to "1","ssid" to mySessionId)

    val response : Response = khttp.get("https://mobile.nwstbus.com.hk/nwp3/geteta.php", params= payload, cookies=myOwnCookies)
////    val obj : JSONObject = response.jsonObject
    val message : String = response.text

    val myDoc : Document = Jsoup.parse(message)
    val myTable : Elements = myDoc.select("div#nextbus_listitem")
    val myCells : Elements = myTable.select("td")

    val myFilteredCells = myCells.filter { it.childNodeSize()== 1 }

    for (myCell in myFilteredCells) {
        println(myCell.text())
    }

//    println(message)
}