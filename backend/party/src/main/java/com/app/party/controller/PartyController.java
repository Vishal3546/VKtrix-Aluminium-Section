package com.app.party.controller;

import com.app.party.domain.Party;
import com.app.party.service.PartyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.app.party.dto.PartyRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/parties")
public class PartyController {

    private final PartyService partyService;

    public PartyController(PartyService partyService) {
        this.partyService = partyService;
    }

    @GetMapping
    public ResponseEntity<List<Party>> getAllParties() {
        return ResponseEntity.ok(partyService.getAllParties());
    }
    
    @PostMapping
    public ResponseEntity<Party> createParty(@RequestBody PartyRequest request) {
        return ResponseEntity.ok(partyService.createParty(request));
    }
}
