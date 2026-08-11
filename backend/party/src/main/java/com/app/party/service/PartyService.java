package com.app.party.service;

import com.app.party.domain.Party;
import com.app.party.repository.PartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import com.app.party.dto.PartyRequest;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartyService {

    private final PartyRepository partyRepository;

    public PartyService(PartyRepository partyRepository) {
        this.partyRepository = partyRepository;
    }

    public List<Party> getAllParties() {
        return partyRepository.findAll();
    }
    
    @Transactional
    public Party createParty(PartyRequest request) {
        Party party = new Party();
        party.setName(request.getName());
        party.setType(request.getType());
        party.setContactInfo(request.getContactInfo());
        return partyRepository.save(party);
    }
}
