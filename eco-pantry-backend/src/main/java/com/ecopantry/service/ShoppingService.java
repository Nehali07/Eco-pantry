package com.ecopantry.service;

import com.ecopantry.model.ShoppingList;
import com.ecopantry.repository.ShoppingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ShoppingService {

    @Autowired
    private ShoppingRepository shoppingRepository;

    public List<ShoppingList> getShoppingLists(String userId) {
        return shoppingRepository.findByUserId(userId);
    }

    public ShoppingList addShoppingList(ShoppingList list) {
        list.setCreatedDate(LocalDate.now());
        return shoppingRepository.save(list);
    }

    public ShoppingList updateShoppingList(String id, ShoppingList list) {
        list.setId(id);
        return shoppingRepository.save(list);
    }

    public void deleteShoppingList(String id) {
        shoppingRepository.deleteById(id);
    }
}