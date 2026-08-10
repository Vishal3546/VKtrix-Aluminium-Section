package com.app.project.service;

import com.app.project.domain.Project;
import com.app.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getProjectsByPartyId(UUID partyId) {
        return projectRepository.findAllByPartyId(partyId);
    }
}
