package com.wooya.chatserver.messenger.dto

data class ChatMessage(
    val message: String ="",
    val sender: String ="",
    val date : String ="",
    val type : String ="",
    val receiver : String =""
)
