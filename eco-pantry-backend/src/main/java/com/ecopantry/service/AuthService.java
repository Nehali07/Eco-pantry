package com.ecopantry.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AuthService {

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://cyzrytrjzmklsmuztbgl.supabase.co/auth/v1")
            .build();

    public Mono<Boolean> validateSupabaseToken(String token) {
        return webClient.get()
                .uri("/user")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> true)
                .onErrorReturn(false);
    }
}
