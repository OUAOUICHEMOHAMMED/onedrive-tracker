package com.onedrive.manager.onedrivetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class OnedriveTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnedriveTrackerApplication.class, args);
    }

}
