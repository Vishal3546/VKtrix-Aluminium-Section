package com.app.profile.service;

import com.app.profile.domain.ProfileSystem;
import com.app.profile.repository.ProfileSystemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileSystemService {

    private final ProfileSystemRepository repository;

    public ProfileSystemService(ProfileSystemRepository repository) {
        this.repository = repository;
    }

    public List<ProfileSystem> getAllSystems() {
        return repository.findAll();
    }
}
