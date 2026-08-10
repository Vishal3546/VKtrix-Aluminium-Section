package com.app.profile.service;

import com.app.profile.domain.FormulaMaster;
import com.app.profile.repository.FormulaMasterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Deprecated
public class FormulaMasterService {

    private final FormulaMasterRepository repository;

    @Deprecated
    public FormulaMasterService(FormulaMasterRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    @Deprecated
    public List<FormulaMaster> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    @Deprecated
    public FormulaMaster findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Formula not found with ID: " + id));
    }

    @Transactional
    @Deprecated
    public FormulaMaster create(FormulaMaster formulaMaster) {
        return repository.save(formulaMaster);
    }

    @Transactional
    @Deprecated
    public FormulaMaster update(UUID id, FormulaMaster updatedData) {
        FormulaMaster existing = findById(id);
        existing.setName(updatedData.getName());
        existing.setExpression(updatedData.getExpression());
        existing.setSystemId(updatedData.getSystemId());
        return repository.save(existing);
    }

    @Transactional
    @Deprecated
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Formula not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
