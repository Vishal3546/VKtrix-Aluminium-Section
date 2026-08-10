package com.app.profile.controller;

import com.app.profile.domain.FormulaMaster;
import com.app.profile.service.FormulaMasterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/formulas")
@PreAuthorize("hasRole('ADMIN')")
@Deprecated
public class FormulaMasterController {

    private final FormulaMasterService service;

    @Deprecated
    public FormulaMasterController(FormulaMasterService service) {
        this.service = service;
    }

    @GetMapping
    @Deprecated
    public ResponseEntity<List<FormulaMaster>> getAllFormulas() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    @Deprecated
    public ResponseEntity<FormulaMaster> getFormulaById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Deprecated
    public ResponseEntity<FormulaMaster> createFormula(@RequestBody FormulaMaster formulaMaster) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(formulaMaster));
    }

    @PutMapping("/{id}")
    @Deprecated
    public ResponseEntity<FormulaMaster> updateFormula(@PathVariable UUID id, @RequestBody FormulaMaster formulaMaster) {
        return ResponseEntity.ok(service.update(id, formulaMaster));
    }

    @DeleteMapping("/{id}")
    @Deprecated
    public ResponseEntity<Void> deleteFormula(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
