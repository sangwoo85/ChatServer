package com.wooya.chatserver.websocket.config

import com.wooya.chatserver.common.config.UserHandshakeHandler
import com.wooya.chatserver.common.config.UserInterceptor
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer


@Configuration
@EnableWebSocketMessageBroker
class StompConfig : WebSocketMessageBrokerConfigurer{

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        // Broadcasting prefix
        registry.enableSimpleBroker("/topic", "/queue")

        //클라이언트가 전송 메시지 prefix를 지정 (핸들러 수신)
        registry.setApplicationDestinationPrefixes("/app")
        //특정 사용자에게 전송
        registry.setUserDestinationPrefix("/user")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .setHandshakeHandler(UserHandshakeHandler())
            .addInterceptors(UserInterceptor())
            .withSockJS()
    }

}