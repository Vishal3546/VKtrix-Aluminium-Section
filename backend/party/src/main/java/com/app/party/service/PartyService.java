package com.app.party.service;

import com.app.party.domain.Party;
import com.app.party.repository.PartyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import com.app.party.dto.PartyRequest;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartyService {

    private final PartyRepository partyRepository;
    private final EntityManager entityManager;

    public PartyService(PartyRepository partyRepository, EntityManager entityManager) {
        this.partyRepository = partyRepository;
        this.entityManager = entityManager;
    }

    public List<Party> getAllParties() {
        return partyRepository.findAll();
    }
    
    @Transactional
    public Party createParty(PartyRequest request) {
        // Fetch or create a default tenant to bypass auth requirement for now
        List<UUID> tenantIds = entityManager.createNativeQuery("SELECT id FROM tenants LIMIT 1").getResultList();
        UUID tenantId;
        if (tenantIds.isEmpty()) {
            tenantId = UUID.randomUUID();
            entityManager.createNativeQuery("INSERT INTO tenants (id, name) VALUES (:id, 'Default Tenant')")
                    .setParameter("id", tenantId)
                    .executeUpdate();
        } else {
            tenantId = (UUID) tenantIds.get(0);
        }
        
        Party party = new Party();
        party.setTenantId(tenantId);
        party.setName(request.getName());
        party.setType(request.getType());
        party.setContactInfo(request.getContactInfo());
        return partyRepository.save(party);
    }
}
