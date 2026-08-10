package com.app.profile.controller;

import com.app.profile.domain.ProfileSystem;
import com.app.profile.service.ProfileSystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/profile-systems")
public class ProfileSystemController {

    private final ProfileSystemService service;

    public ProfileSystemController(ProfileSystemService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProfileSystem>> getAllSystems() {
        return ResponseEntity.ok(service.getAllSystems());
    }
}
