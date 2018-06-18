package com.tarkil.hongkongbus

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicLong

data class Hello(val uuid:Long, val who:String)

data class busTime(val busNumber:String, val busTime: String)

@RestController
class HelloWhoController {
    val counter = AtomicLong()

    @GetMapping("/hello")
    fun hello(@RequestParam(value="name", defaultValue = "World") name: String) = Hello(counter.incrementAndGet(), "Hello $name")
}

@RestController
class test {
    @RequestMapping("/getNextBusesTimes")
    fun getNextBusesTimes(): busTime {
        return busTime("11", "11:11")
    }
}