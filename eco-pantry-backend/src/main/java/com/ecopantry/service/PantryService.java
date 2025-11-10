package com.ecopantry.service;

import com.ecopantry.model.PantryItem;
import com.ecopantry.repository.PantryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class PantryService {

    @Autowired
    private PantryRepository pantryRepository;

    public List<PantryItem> getPantryItems(String userId) {
        return pantryRepository.findByUserId(userId);
    }

    public PantryItem addPantryItem(PantryItem item) {
        item.setAddedDate(LocalDate.now());
        return pantryRepository.save(item);
    }

    public PantryItem updatePantryItem(String id, PantryItem item) {
        item.setId(id);
        return pantryRepository.save(item);
    }

    public void deletePantryItem(String id) {
        pantryRepository.deleteById(id);
    }

    public List<PantryItem> getExpiringItems(String userId) {
        LocalDate threeDaysFromNow = LocalDate.now().plusDays(3);
        return pantryRepository.findExpiringItems(userId, threeDaysFromNow);
    }
}