package com.app.project.controller;

import com.app.project.domain.Project;
import com.app.project.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import com.app.project.dto.ProjectRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(@RequestParam(value = "partyId", required = false) UUID partyId) {
        if (partyId != null) {
            return ResponseEntity.ok(projectService.getProjectsByPartyId(partyId));
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }
}
