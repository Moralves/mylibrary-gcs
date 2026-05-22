package br.com.senai.mylibrary.category;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.senai.mylibrary.category.dto.CategoryCreateRequest;
import br.com.senai.mylibrary.category.dto.CategoryResponse;
import br.com.senai.mylibrary.shared.exception.BusinessException;
import br.com.senai.mylibrary.shared.exception.ResourceNotFoundException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listAll() {
        return categoryRepository.findAllByOrderByNameAsc()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryCreateRequest request) {
        if (request == null) {
            throw new BusinessException("Os dados da categoria são obrigatórios.", HttpStatus.BAD_REQUEST);
        }

        String normalizedName = normalizeName(request.name());
        if (normalizedName.isBlank()) {
            throw new BusinessException("O nome da categoria é obrigatório.", HttpStatus.BAD_REQUEST);
        }

        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new BusinessException("Já existe uma categoria cadastrada com este nome.", HttpStatus.CONFLICT);
        }

        Category category = new Category();
        category.setName(normalizedName);
        category.setDescription(normalizeDescription(request.description()));

        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        if (hasLinkedBooks(category.getId())) {
            throw new BusinessException("Não é possível excluir categorias com livros vinculados.", HttpStatus.CONFLICT);
        }

        categoryRepository.delete(category);
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim();
    }

    private String normalizeDescription(String description) {
        if (description == null) {
            return null;
        }
        String normalized = description.trim();
        return normalized.isBlank() ? null : normalized;
    }

    private boolean hasLinkedBooks(Long categoryId) {
        return false;
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            resolveBookCount(category)
        );
    }

    private long resolveBookCount(Category category) {
        return 0L;
    }
}
