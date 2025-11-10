package com.ecopantry.controller;

import com.ecopantry.model.User;
import com.ecopantry.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        user.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        User existing = userRepository.findByEmail(user.getEmail());
        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok("Login successful (use Supabase for real auth)");
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userRepository.findByEmail(email));
    }
}