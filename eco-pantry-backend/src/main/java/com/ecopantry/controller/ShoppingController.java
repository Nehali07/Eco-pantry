package com.ecopantry.controller;

import com.ecopantry.model.ShoppingList;
import com.ecopantry.service.AuthService;
import com.ecopantry.service.ShoppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/shopping")
public class ShoppingController {

    @Autowired
    private ShoppingService shoppingService;

    @Autowired
    private AuthService authService;

    // ✅ Get all shopping lists for a user
    @GetMapping("/{userId}")
    public Mono<ResponseEntity<List<ShoppingList>>> getShoppingLists(
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(shoppingService.getShoppingLists(userId)));
                });
    }

    // ✅ Add new shopping list
    @PostMapping("/add")
    public Mono<ResponseEntity<ShoppingList>> addShoppingList(
            @RequestBody ShoppingList list,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(shoppingService.addShoppingList(list)));
                });
    }

    // ✅ Update a shopping list
    @PutMapping("/update/{id}")
    public Mono<ResponseEntity<ShoppingList>> updateShoppingList(
            @PathVariable String id,
            @RequestBody ShoppingList list,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(shoppingService.updateShoppingList(id, list)));
                });
    }

    // ✅ Delete a shopping list
    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<Void>> deleteShoppingList(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    shoppingService.deleteShoppingList(id);
                    return Mono.just(ResponseEntity.noContent().build());
                });
    }
}
