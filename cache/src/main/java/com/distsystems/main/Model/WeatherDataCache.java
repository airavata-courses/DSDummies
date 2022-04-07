package com.distsystems.main.Model;

import java.util.ArrayList;

import java.util.List;

import com.distsystems.main.repository.WeatherDataRepository;
import com.distsystems.main.utils.GetPlotRequest;
import com.distsystems.main.utils.GetPlotResponse;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.client.RestTemplate;



@Document(collection = "weather-data-cache")
public class WeatherDataCache {
	public static String message;
	
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
    
    @Autowired
    private RabbitTemplate template;
    
    @Autowired
	private DirectExchange directExchange;


    public String checkIfSlugInDB(String slug, WeatherDataRepository weatherRepository) {

        List<WeatherDataCache> responses = new ArrayList<WeatherDataCache>();

        weatherRepository.findBySlugContaining(slug).forEach(responses::add);

        if (responses.isEmpty()) {
            return "";
        }

        return responses.get(0).resp_data;
    }

  @Bean
  Queue queue() {
      return new Queue("makeplot");
  }
    
    public String getPlotResponse(GetPlotRequest req) throws Exception {
//        try {
//            String uri = "http://localhost:5678/get-plot";
//            RestTemplate restTemplate = new RestTemplate();
//            GetPlotResponse result = restTemplate.postForObject(uri, req, GetPlotResponse.class);
//
//            // System.out.println(result.getResp());
//
//            if (result.getStatus() == "Error") {
//                return "";
//            }
//
//            if (result.getStatus() == "NO") {
//                return "NO";
//            }
//
//            return result.getResp();
//        } catch (Exception e) {
//            throw new Exception("Error While interacting with Flask API : " + e.getMessage());
//        }
    	    	
    	String request = "{" + "\"station\"" + " : \"" + req.getStation() + "\", " + "\"year\"" + " : \"" + req.getYear() 
    	+ "\", " + "\"month\"" + " : \"" + req.getMonth() + "\", " + "\"date\"" + " : \"" + req.getDate() + "\", " + 
    			"\"hour\"" + " : " + req.getHour() + ", " + "\"video\"" + " : " + req.isVideo()+ "}";	
    	
      ConnectionFactory factory = new ConnectionFactory();
	  factory.setHost("localhost");
	  com.rabbitmq.client.Connection conn = factory.newConnection();
	  Channel channel = (Channel) conn.createChannel();
	  channel.queueDeclare("makeplot", false, false, false, null);
    	System.out.println("hereeee"+ request);    
    	channel.basicPublish("", "makeplot", null, request.getBytes());

        System.out.println(" [.] Got '"  + "'");
        channel.close();
        conn.close();
        
        try {
        	ConnectionFactory fact = new ConnectionFactory();
        	fact.setHost("localhost");
            Connection connection = factory.newConnection();
            Channel ch = connection.createChannel();
            ch.queueDeclare("makeplot_r", false, false, false, null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
            
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println(" [x] Received '" + message + "'");                
                System.out.println(" [x] Sent '" + message);
                WeatherDataCache.message = message;
                
            };
            ch.basicConsume("makeplot_r", true, deliverCallback, consumerTag -> { });
            
            }catch(Exception error) {
    			System.out.println("error in stating a consumer of service worker :(");
    			System.out.println(error.getMessage());
    			System.exit(1);
    		}
        
		return WeatherDataCache.message;

    }

//    public String getVideoResponse(GetPlotRequest req) throws Exception {
//        try {
//            String uri = "http://di-app-service:5678/get-video";
//            RestTemplate restTemplate = new RestTemplate();
//            GetPlotResponse result = restTemplate.postForObject(uri, req, GetPlotResponse.class);
//
//            // System.out.println(result.getResp());
//
//            if (result.getStatus() == "Error") {
//                return "";
//            }
//
//            return result.getResp();
//        } catch (Exception e) {
//            throw new Exception("Error While interacting with Flask API : " + e.getMessage());
//        }
//
//    }

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
