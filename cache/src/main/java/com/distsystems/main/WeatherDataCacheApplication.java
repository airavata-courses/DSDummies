package com.distsystems.main;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.distsystems.main.Controller.RabbitListenerService;

@SpringBootApplication
// @EnableAutoConfiguration(exclude={MongoAutoConfiguration.class})
public class WeatherDataCacheApplication {
	@Autowired
	static
	RabbitListenerService rabbitListenerService;

    public static void main(String[] args) {
        SpringApplication.run(WeatherDataCacheApplication.class, args);
    }
    
}
