package com.ecopantry.controller;

import com.ecopantry.service.AnalyticsService;
import com.ecopantry.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{userId}")
    public Mono<ResponseEntity<Map<String, Object>>> getAnalytics(
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt) // returns Mono<Boolean>
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return analyticsService.getAnalytics(userId) // returns Mono<Map<String, Object>>
                            .map(ResponseEntity::ok);
                });
    }
}
