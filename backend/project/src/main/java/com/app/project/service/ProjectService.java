package com.app.project.service;

import com.app.project.domain.Project;
import com.app.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import com.app.project.dto.ProjectRequest;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final EntityManager entityManager;

    public ProjectService(ProjectRepository projectRepository, EntityManager entityManager) {
        this.projectRepository = projectRepository;
        this.entityManager = entityManager;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByPartyId(UUID partyId) {
        return projectRepository.findAllByPartyId(partyId);
    }
    
    @Transactional
    public Project createProject(ProjectRequest request) {
        List<?> tenantIds = entityManager.createNativeQuery("SELECT CAST(id AS varchar) FROM tenants LIMIT 1").getResultList();
        UUID tenantId;
        if (tenantIds.isEmpty()) {
            tenantId = UUID.randomUUID();
            entityManager.createNativeQuery("INSERT INTO tenants (id, name) VALUES (CAST(:id AS uuid), 'Default Tenant')")
                    .setParameter("id", tenantId.toString())
                    .executeUpdate();
        } else {
            tenantId = UUID.fromString(tenantIds.get(0).toString());
        }
        
        Project project = new Project();
        project.setTenantId(tenantId);
        project.setName(request.getName());
        project.setPartyId(request.getPartyId());
        project.setStatus(request.getStatus() != null ? request.getStatus() : "New");
        return projectRepository.save(project);
    }
}
