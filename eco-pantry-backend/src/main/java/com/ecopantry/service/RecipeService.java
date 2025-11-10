package com.ecopantry.service;

import com.ecopantry.model.PantryItem;
import com.ecopantry.model.Recipe;
import com.ecopantry.repository.PantryRepository;
import com.ecopantry.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private PantryRepository pantryRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Recipe getRecipeById(String id) {
        return recipeRepository.findById(id).orElse(null);
    }

    public Recipe addRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public List<Recipe> suggestRecipes(String userId) {
        List<PantryItem> pantryItems = pantryRepository.findByUserId(userId);
        List<String> availableIngredients = pantryItems.stream()
                .map(PantryItem::getItemName)
                .collect(Collectors.toList());

        // Basic matching
        List<Recipe> basicSuggestions = recipeRepository.findAll().stream()
                .filter(recipe -> availableIngredients.containsAll(recipe.getIngredients()))
                .collect(Collectors.toList());

        // Optional: Call Supabase Edge Function for AI suggestions
        // Uncomment and adjust if you want to integrate your generate-recipes function
        /*
        Mono<String> aiResponse = supabaseEdgeWebClient.post()
                .uri("/generate-recipes")
                .bodyValue(Map.of("ingredients", availableIngredients))
                .retrieve()
                .bodyToMono(String.class);
        // Parse aiResponse and merge with basicSuggestions
        */

        return basicSuggestions;
    }
}