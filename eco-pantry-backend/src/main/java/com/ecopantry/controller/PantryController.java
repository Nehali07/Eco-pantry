package com.ecopantry.controller;

import com.ecopantry.model.PantryItem;
import com.ecopantry.service.AuthService;
import com.ecopantry.service.PantryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;

@RestController
@RequestMapping("/api/pantry")
public class PantryController {

    @Autowired
    private PantryService pantryService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{userId}")
    public Mono<ResponseEntity<List<PantryItem>>> getPantryItems(
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(pantryService.getPantryItems(userId)));
                });
    }

    @PostMapping("/add")
    public Mono<ResponseEntity<PantryItem>> addPantryItem(
            @RequestBody PantryItem item,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(pantryService.addPantryItem(item)));
                });
    }

    @PutMapping("/update/{id}")
    public Mono<ResponseEntity<PantryItem>> updatePantryItem(
            @PathVariable String id,
            @RequestBody PantryItem item,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(pantryService.updatePantryItem(id, item)));
                });
    }

    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<Void>> deletePantryItem(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    pantryService.deletePantryItem(id);
                    return Mono.just(ResponseEntity.noContent().build());
                });
    }

    @GetMapping("/expiring/{userId}")
    public Mono<ResponseEntity<List<PantryItem>>> getExpiringItems(
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "").trim();

        return authService.validateSupabaseToken(jwt)
                .flatMap(isValid -> {
                    if (!isValid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(pantryService.getExpiringItems(userId)));
                });
    }
}
