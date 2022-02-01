package com.distsystems.main;

import org.springframework.data.mongodb.repository.MongoRepository;
public interface cacheRepository extends MongoRepository<CacheApplication, String> {
	
}
