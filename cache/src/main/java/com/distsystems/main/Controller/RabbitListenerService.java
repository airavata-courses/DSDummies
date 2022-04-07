package com.distsystems.main.Controller;

import org.springframework.amqp.core.Queue;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.distsystems.main.utils.GetPlotRequest;
import com.distsystems.main.utils.GetPlotResponse;

import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Service
public class RabbitListenerService {
	
	@Autowired
	WeatherDataController weatherDataController;
	
	@Autowired
    private RabbitTemplate rabbitTemplate;
	
	
	@RabbitListener(queues = "cache_qr")
	public void getUserPlot(GetPlotRequest getPlotRequest) {
		System.out.println("Recvd="+ getPlotRequest);
		if(getPlotRequest.getDate() != null && getPlotRequest.getHour() != null && getPlotRequest.getStation() != null
				&& getPlotRequest.getYear() !=null && getPlotRequest.getMonth() != null) {
		if(getPlotRequest.isVideo()) {	
		ResponseEntity<GetPlotResponse> resp = weatherDataController.getplot(getPlotRequest);
		rabbitTemplate.convertAndSend("cache_qt", resp);
		}else {
		ResponseEntity<GetPlotResponse> resp = weatherDataController.getVideo(getPlotRequest);
		rabbitTemplate.convertAndSend("cache_qt", resp);
		}
		}
	}
	
	


}