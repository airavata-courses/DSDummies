package com.distsystems.main.Controller;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class RabbitConfig {
	@Bean
    Queue queue() {
        return new Queue("makeplot");
    }
	@Bean
    public DirectExchange exchange() {
        return new DirectExchange("exchange");
    }
	

    @Bean
    public Binding binding(DirectExchange exchange,
        Queue queue) {
        return BindingBuilder.bind(queue)
            .to(exchange)
            .with("rpc");
    }
	
	@Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
		
	
}
