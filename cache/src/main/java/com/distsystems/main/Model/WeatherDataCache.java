package com.distsystems.main.Model;

import java.util.ArrayList;
import java.util.List;

import com.distsystems.main.repository.WeatherDataRepository;
import com.distsystems.main.utils.GetPlotRequest;
import com.distsystems.main.utils.GetPlotResponse;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.client.RestTemplate;

@Document(collection = "weather-data-cache")
public class WeatherDataCache {

    @Id
    private ObjectId id;

    private String slug;
    private String resp_data;
    private String addedOn;

    public WeatherDataCache() {
    }

    public WeatherDataCache(String slug, String resp_data, String addedOn) {
        this.slug = slug;
        this.resp_data = resp_data;
        this.addedOn = addedOn;
    }

    public ObjectId getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getResponse() {
        return resp_data;
    }

    public void setResponse(String resp_data) {
        this.resp_data = resp_data;
    }

    public String getAddedOn() {
        return addedOn;
    }

    public void setAddedOn(String addedOn) {
        this.addedOn = addedOn;
    }

    public String checkIfSlugInDB(String slug, WeatherDataRepository weatherRepository) {

        List<WeatherDataCache> responses = new ArrayList<WeatherDataCache>();

        weatherRepository.findBySlugContaining(slug).forEach(responses::add);

        if (responses.isEmpty()) {
            return "";
        }

        return responses.get(0).resp_data;
    }

    public String getPlotResponse(GetPlotRequest req) throws Exception {
        try {
            String uri = "http://data-ingestor:5678/get-plot";
            RestTemplate restTemplate = new RestTemplate();
            GetPlotResponse result = restTemplate.postForObject(uri, req, GetPlotResponse.class);

            // System.out.println(result.getResp());

            if (result.getStatus() == "Error") {
                return "";
            }

            if (result.getStatus() == "NO") {
                return "NO";
            }

            return result.getResp();
        } catch (Exception e) {
            throw new Exception("Error While interacting with Flask API : " + e.getMessage());
        }

    }

    public String getVideoResponse(GetPlotRequest req) throws Exception {
        try {
            String uri = "http://data-ingestor:5678/get-video";
            RestTemplate restTemplate = new RestTemplate();
            GetPlotResponse result = restTemplate.postForObject(uri, req, GetPlotResponse.class);

            // System.out.println(result.getResp());

            if (result.getStatus() == "Error") {
                return "";
            }

            return result.getResp();
        } catch (Exception e) {
            throw new Exception("Error While interacting with Flask API : " + e.getMessage());
        }

    }

    public Boolean save(String slug, String resp, WeatherDataRepository weatherRepository) throws Exception {
        try {
            WeatherDataCache weatherDataCacheObj = new WeatherDataCache();
            weatherDataCacheObj.setSlug(slug);
            weatherDataCacheObj.setResponse(resp);
            weatherDataCacheObj.setAddedOn(java.time.LocalDateTime.now().toString());

            WeatherDataCache respDB = weatherRepository.save(weatherDataCacheObj);
            // System.out.println(respDB.getId());
            // System.out.println(respDB.getSlug());
            // System.out.println(respDB.getResponse());
            // System.out.println(respDB.getAddedOn());

            return true;

        } catch (Exception e) {
            throw new Exception("Error While Saving data to DB : " + e.getMessage());
        }
    }

}
