package com.distsystems.main.cache;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.distsystems.main.WeatherDataCacheApplication;
import com.distsystems.main.Model.WeatherDataCache;
import com.distsystems.main.repository.WeatherDataRepository;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = WeatherDataCacheApplication.class)

class CacheApplicationTests {
	
	@Autowired
	WeatherDataRepository weatherDataRepository;

	@Test
	public void dbTestCreate() {
		WeatherDataCache w = new WeatherDataCache();
		w.setSlug("IN-2020-10-10-05");
		w.setResponse("Some response string");
		w.setAddedOn("added on");
		weatherDataRepository.save(w);
		assertNotNull(weatherDataRepository.findBySlugContaining("IN-2020-10-10-05"));
	}
}
