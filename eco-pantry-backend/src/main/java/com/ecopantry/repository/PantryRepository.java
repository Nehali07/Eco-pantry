package com.ecopantry.repository;

import com.ecopantry.model.PantryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface PantryRepository extends MongoRepository<PantryItem, String> {
    List<PantryItem> findByUserId(String userId);

    @Query("{ 'userId': ?0, 'expiryDate': { $lte: ?1 } }")
    List<PantryItem> findExpiringItems(String userId, LocalDate date);
}