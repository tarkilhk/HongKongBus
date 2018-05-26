package com.tarkil.hongkongbus

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.atomic.AtomicLong

data class Hello(val uuid:Long, val who:String)

@RestController
class HelloWhoController {
    val counter = AtomicLong()

    @GetMapping("/hello")
    fun hello(@RequestParam(value="name", defaultValue = "World") name: String) = Hello(counter.incrementAndGet(), "Hello $name")
}