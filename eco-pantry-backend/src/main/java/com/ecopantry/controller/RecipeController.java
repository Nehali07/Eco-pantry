package com.ecopantry.controller;

import com.ecopantry.model.Recipe;
import com.ecopantry.service.AuthService;
import com.ecopantry.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private AuthService authService;

    // Get all recipes (public)
    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    // Get recipe by ID
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        Recipe recipe = recipeService.getRecipeById(id);
        if (recipe == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recipe);
    }

    // Add new recipe (requires auth)
    @PostMapping("/add")
    public Mono<ResponseEntity<Recipe>> addRecipe(
            @RequestBody Recipe recipe,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(recipeService.addRecipe(recipe)));
                });
    }

    // Suggest recipes for a user (requires auth)
    @GetMapping("/suggestions/{userId}")
    public Mono<ResponseEntity<List<Recipe>>> suggestRecipes(
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {

        return authService.validateSupabaseToken(token.replace("Bearer ", ""))
                .flatMap(valid -> {
                    if (!valid) {
                        return Mono.just(ResponseEntity.status(401).build());
                    }
                    return Mono.just(ResponseEntity.ok(recipeService.suggestRecipes(userId)));
                });
    }
}
