package com.distsystems.main;

import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class cacheController {
	private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    
	@Autowired
	cacheRepository cacherep;
	
	@PostMapping("/fetch-graph")
	public ResponseEntity<CacheApplication> createTutorial(@RequestBody CacheApplication cache) {
	  try {
		CacheApplication cacheapp = cacherep.save(new CacheApplication(cache.getId(), cache.getUsername(), cache.getDate(), cache.getRequest_params(), cache.getResponse(), ""));
		String slug_ready = makeSlug(cacheapp.getDate());
		cacheapp = cacherep.save(new CacheApplication(cache.getId(), cache.getUsername(), cache.getDate(), cache.getRequest_params(), cache.getResponse(), slug_ready));
		return new ResponseEntity<>(cacheapp, HttpStatus.CREATED);
	  } catch (Exception e) {
	    return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	  }
	}
	
	public static String makeSlug(String input) {
	    if (input == null)
	        throw new IllegalArgumentException();
	    String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
	    String normalized = Normalizer.normalize(nowhitespace, Form.NFD);
	    String slug = NONLATIN.matcher(normalized).replaceAll("");
	    return slug.toLowerCase(Locale.ENGLISH);
	}
}


