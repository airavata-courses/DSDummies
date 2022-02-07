package com.distsystems.main.Controller;

import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import javax.management.Query;

import com.distsystems.main.Model.WeatherDataCache;
import com.distsystems.main.repository.WeatherDataRepository;
import com.distsystems.main.utils.GetPlotRequest;
import com.distsystems.main.utils.GetPlotResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

// @CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class WeatherDataController {

    @Autowired
    WeatherDataRepository weatherRepository;

    @GetMapping("/isworking")
    public ResponseEntity<String> isWorking() {
        return new ResponseEntity<String>("Spring API is working!!", HttpStatus.FOUND);
    }

    @PostMapping("/getplot")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<GetPlotResponse> getPlot(@RequestBody GetPlotRequest req) {

        try {
            // 1. validate request
            String station = req.getStation();
            if (station.length() < 4) {
                GetPlotResponse resp = new GetPlotResponse("Invalid Station", "Error");
                return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
            }
            String year = req.getYear();
            if (year.length() < 4) {
                GetPlotResponse resp = new GetPlotResponse("Invalid year", "Error");
                return new ResponseEntity<>(resp, HttpStatus.BAD_REQUEST);
            }
            String month = req.getMonth();
            int month_int = Integer.parseInt(month);
            month_int += 1;

            if (month_int > 10) {
                month = String.valueOf(month_int);
            } else {
                month = "0" + String.valueOf(month_int);
            }
            String date = req.getDate();
            int date_int = Integer.parseInt(date);

            if (date_int > 10) {
                date = String.valueOf(date_int);
            } else {
                date = "0" + String.valueOf(date_int);
            }
            String hour = req.getHour();
            // 2. create Slug
            String slug = station + "-" + year + "-" + month + "-" + date + "-" + hour;
            System.out.println("slug is " + slug);

            // 3. check if in DB
            WeatherDataCache weatherDataCacheObj = new WeatherDataCache();
            String response = weatherDataCacheObj.checkIfSlugInDB(slug, weatherRepository);

            // 4. if found in DB return response
            if (response.length() > 0) {
                GetPlotResponse resp = new GetPlotResponse(response, "Successs");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            } else {
                // 5. Hit flask
                req.setYear(year);
                req.setDate(date);
                req.setMonth(month);
                req.setHour(hour);
                String api_resp = weatherDataCacheObj.getPlotResponse(req);

                if (api_resp.length() == 0) {
                    GetPlotResponse resp = new GetPlotResponse("Faced an issue! please try again", "API-Failed");
                    return new ResponseEntity<>(resp, HttpStatus.OK);
                }

                if (api_resp == "NO") {
                    GetPlotResponse resp = new GetPlotResponse("No Data Found!", "No-Data");
                    return new ResponseEntity<>(resp, HttpStatus.OK);
                }

                // 6. Save data in DB for this slug
                weatherDataCacheObj.save(slug, api_resp, weatherRepository);

                GetPlotResponse resp = new GetPlotResponse(api_resp, "Successs");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            GetPlotResponse resp = new GetPlotResponse(e.getMessage(), "Error");
            return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return new ResponseEntity<String>("Spring API is working!!",
        // HttpStatus.FOUND);
    }

    @PostMapping("/getvideo")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<GetPlotResponse> getVide(@RequestBody GetPlotRequest req) {

        try {
            // 1. validate request

            String month = req.getMonth();
            int month_int = Integer.parseInt(month);
            month_int += 1;

            month = String.valueOf(month_int);

            // 2. create Slug
            String slug = "V-" + req.getStation() + "-" + req.getYear() + "-" + month + "-" + req.getDate()
                    + "-"
                    + req.getHour();
            System.out.println("slug is " + slug);

            // 3. check if in DB
            WeatherDataCache weatherDataCacheObj = new WeatherDataCache();
            String response = weatherDataCacheObj.checkIfSlugInDB(slug, weatherRepository);

            // 4. if found in DB return response
            if (response.length() > 0) {
                GetPlotResponse resp = new GetPlotResponse(response, "Successs");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            } else {
                // 5. Hit flask
                req.setMonth(month);
                String api_resp = weatherDataCacheObj.getVideoResponse(req);

                if (api_resp.length() == 0) {
                    GetPlotResponse resp = new GetPlotResponse("Faced an issue! please try again", "API-Failed");
                    return new ResponseEntity<>(resp, HttpStatus.OK);
                }

                // 6. Save data in DB for this slug
                weatherDataCacheObj.save(slug, api_resp, weatherRepository);

                GetPlotResponse resp = new GetPlotResponse(api_resp, "Successs");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            GetPlotResponse resp = new GetPlotResponse(e.getMessage(), "Error");
            return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
