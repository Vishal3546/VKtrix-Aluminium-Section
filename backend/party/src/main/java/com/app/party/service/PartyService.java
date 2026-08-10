package com.app.party.service;

import com.app.party.domain.Party;
import com.app.party.repository.PartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartyService {

    private final PartyRepository partyRepository;

    public PartyService(PartyRepository partyRepository) {
        this.partyRepository = partyRepository;
    }

    public List<Party> getAllParties() {
        // In a real app we would get tenantId from security context
        return partyRepository.findAll();
    }
}
