package com.ecopantry.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SupabaseAuthConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    @Value("${supabase.service-role-key}")  // For calling Edge Functions
    private String serviceRoleKey;

    @Bean
    WebClient supabaseWebClient() {
        return WebClient.builder()
                .baseUrl(supabaseUrl)
                .defaultHeader("apikey", supabaseAnonKey)
                .build();
    }

    @Bean
    WebClient supabaseEdgeWebClient() {
        return WebClient.builder()
                .baseUrl(supabaseUrl + "/functions/v1")
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .build();
    }
}
