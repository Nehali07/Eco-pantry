package com.ecopantry.service;

import com.ecopantry.model.PantryItem;
import com.ecopantry.repository.PantryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private PantryRepository pantryRepository;

    public Mono<Map<String, Object>> getAnalytics(String userId) {
        return Mono.fromCallable(() -> {
            // Fetch all items belonging to the user
            List<PantryItem> items = pantryRepository.findByUserId(userId);

            // Calculate analytics
            long totalItems = items.size();
            long expiringSoon = items.stream()
                    .filter(item -> item.getExpiryDate() != null &&
                            item.getExpiryDate().isBefore(LocalDate.now().plusDays(5)))
                    .count();

            long wastedItems = items.stream()
                    .filter(item -> item.getExpiryDate() != null &&
                            item.getExpiryDate().isBefore(LocalDate.now()))
                    .count();

            Map<String, Long> categoryCount = items.stream()
                    .collect(Collectors.groupingBy(PantryItem::getCategory, Collectors.counting()));

            // Return analytics data as a map
            return Map.of(
                    "totalItems", totalItems,
                    "expiringSoon", expiringSoon,
                    "wastedItems", wastedItems,
                    "categoryBreakdown", categoryCount
            );
        });
    }
}
