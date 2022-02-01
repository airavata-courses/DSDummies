package com.distsystems.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "weather_data2")
@SpringBootApplication
public class CacheApplication {

	public static void main(String[] args) {
		SpringApplication.run(CacheApplication.class, args);
	}

	@Id
	  private String id;
	  private String username;
	  private String date;
	  private String request_params;
	  private String response;
	  private String slug;
	  
	  public CacheApplication() {

	  }

	  public String getId() {
		return id;
	}

	public CacheApplication(String id, String username, String date, String request_params, String response, String slug) {
		super();
		this.id = id;
		this.username = username;
		this.date = date;
		this.request_params = request_params;
		this.response = response;
		this.slug = slug;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getRequest_params() {
		return request_params;
	}

	public void setRequest_params(String request_params) {
		this.request_params = request_params;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}


	@Override
	public String toString() {
		return "Demo1Application [id=" + id + ", username=" + username + ", date=" + date + ", request_params="
				+ request_params + ", response=" + response + "]";
	}

}
