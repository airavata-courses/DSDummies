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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

// @CrossOrigin(origins = "http://localhost:8081")
//@RestController
//@RequestMapping("/api")

@Controller
public class WeatherDataController {

    @Autowired
    WeatherDataRepository weatherRepository;
    
    public ResponseEntity<GetPlotResponse> getplot(@RequestBody GetPlotRequest getPlotRequest) {
    	  
    	  System.out.println("responseEntity="+getPlotRequest);
    	  try {
            // 1. validate request

            String month = getPlotRequest.getMonth();
            int month_int = Integer.parseInt(month);
            month_int += 1;

            month = String.valueOf(month_int);

            // 2. create Slug
            String slug = getPlotRequest.getStation() + "-" + getPlotRequest.getYear() + "-" + month + "-" + getPlotRequest.getDate()
                    + "-"
                    + getPlotRequest.getHour();
            System.out.println("slug is " + slug);

            // 3. check if in DB
            WeatherDataCache weatherDataCacheObj = new WeatherDataCache();
            String response = weatherDataCacheObj.checkIfSlugInDB(slug, weatherRepository);

            // 4. if found in DB return response
            if (response.length() > 0) {
//            	 System.out.println("in if"+response);
                GetPlotResponse resp = new GetPlotResponse(response, "Successs");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            } 
            else {
                // 5. Hit flask
            	
            	System.out.println("in else-->"+ getPlotRequest );
                String api_resp = weatherDataCacheObj.getPlotResponse(getPlotRequest);
                System.out.println("in else"+api_resp);
                if (api_resp.length() == 0) {
                    GetPlotResponse resp = new GetPlotResponse("Faced an issue! please try again", "API-Failed");
                    return new ResponseEntity<>(resp, HttpStatus.OK);
                }

                // 6. Save data in DB for this slug
                weatherDataCacheObj.save(slug, api_resp, weatherRepository);

                GetPlotResponse resp = new GetPlotResponse(api_resp, "Success from flask");
                return new ResponseEntity<>(resp, HttpStatus.OK);
            }
        } catch (Exception e) {
            System.out.println("errormsg="+e.getMessage());
            GetPlotResponse resp = new GetPlotResponse(e.getMessage(), "Error");
            return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
        }
  		   }
    
  public ResponseEntity<GetPlotResponse> getVideo(@RequestBody GetPlotRequest getVideoRequest) {

      try {
          // 1. validate request

          String month = getVideoRequest.getMonth();
          int month_int = Integer.parseInt(month);
          month_int += 1;

          month = String.valueOf(month_int);

          // 2. create Slug
          String slug = "V-" + getVideoRequest.getStation() + "-" + getVideoRequest.getYear() + "-" + month + "-" + getVideoRequest.getDate()
          + "-"
          + getVideoRequest.getHour();
          
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
        	  getVideoRequest.setMonth(month);
              String api_resp = weatherDataCacheObj.getPlotResponse(getVideoRequest);

              if (api_resp.length() == 0) {
                  GetPlotResponse resp = new GetPlotResponse("Faced an issue! please try again", "API-Failed");
                  return new ResponseEntity<>(resp, HttpStatus.OK);
              }

              // 6. Save data in DB for this slug
              weatherDataCacheObj.save(slug, api_resp, weatherRepository);

              GetPlotResponse resp = new GetPlotResponse(api_resp, "Successs from flask");
              return new ResponseEntity<>(resp, HttpStatus.OK);
          }
      } catch (Exception e) {
          System.out.println(e.getMessage());
          GetPlotResponse resp = new GetPlotResponse(e.getMessage(), "Error");
          return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

}