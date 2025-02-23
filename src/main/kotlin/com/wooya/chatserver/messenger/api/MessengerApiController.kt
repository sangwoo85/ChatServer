package com.wooya.chatserver.messenger.api

import com.wooya.chatserver.messenger.dto.ChatMessage
import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.stereotype.Controller
import org.springframework.messaging.simp.SimpMessagingTemplate
import java.security.Principal

/**
 * @Title message 보내는 Controller
 * */
@Controller
class MessengerApiController(private val messageTemplate: SimpMessagingTemplate) {

    private val LOGGER = LoggerFactory.getLogger(this::class.java);


    @MessageMapping("/private-message")
    fun sendPrivateMessage(message : ChatMessage, principal : Principal) {
        LOGGER.info("START");
        val receiver = message.receiver;
        val name = principal.name;
        LOGGER.info("sender $name to $receiver")
        messageTemplate.convertAndSend("/queue/messages/$receiver",message)
    }

}