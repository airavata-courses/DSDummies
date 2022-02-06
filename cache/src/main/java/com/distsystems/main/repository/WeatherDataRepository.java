package com.distsystems.main.repository;

import java.util.List;

import com.distsystems.main.Model.WeatherDataCache;

// import com.distsystems.main.Model.WeatherData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WeatherDataRepository extends MongoRepository<WeatherDataCache, String> {
    List<WeatherDataCache> findBySlugContaining(String slug);

    // List<WeatherData> findByTitleContaining(String title);

}
