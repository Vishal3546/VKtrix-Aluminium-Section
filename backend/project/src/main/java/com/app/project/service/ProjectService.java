package com.app.project.service;

import com.app.project.domain.Project;
import com.app.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import com.app.project.dto.ProjectRequest;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByPartyId(UUID partyId) {
        return projectRepository.findAllByPartyId(partyId);
    }
    
    @Transactional
    public Project createProject(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setPartyId(request.getPartyId());
        project.setStatus(request.getStatus() != null ? request.getStatus() : "New");
        return projectRepository.save(project);
    }
}
