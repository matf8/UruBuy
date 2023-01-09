package com.fing.backend.business;

import com.fing.backend.business.interfaces.ICategoryService;
import com.fing.backend.converter.CategoryConverter;
import com.fing.backend.dao.ICategoryRepository;
import com.fing.backend.dto.CategoryDTO;
import com.fing.backend.entity.Category;
import com.fing.backend.exception.CategoryException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;

@Service
public class CategoryService implements ICategoryService {

    @Autowired private ICategoryRepository categoryRepository;
    private final CategoryConverter categoryConverter = CategoryConverter.getInstance();
    @PersistenceContext private EntityManager em;

    public void add(CategoryDTO dtc) {
        Category category = categoryConverter.fromDTO(dtc);
        categoryConverter.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    public void deleteByName(String name) throws Exception {
        Query q = em.createQuery("select c from Category c where c.name=:n");
        q.setParameter("n", name);
        Category c = (Category) q.getSingleResult();
        if (Objects.nonNull(c))
            categoryRepository.delete(c);
        else throw new CategoryException("Categoría no encontrada");
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    public CategoryDTO findById(Long id) {
        return categoryConverter.fromEntity(categoryRepository.findById(id).orElse(null));
    }

    @Transactional
    public CategoryDTO findByName(String name) throws Exception {
        try {
            Query q = em.createQuery("select c from Category c where c.name=:n");
            q.setParameter("n", name);
            Category category = (Category) q.getSingleResult();
            if (Objects.nonNull(category))
                return categoryConverter.fromEntity(category);
        } catch (Exception e) {
            throw new CategoryException("Categoría no encontrada");
        }
        return null;
    }

    public void update(CategoryDTO dtc) throws CategoryException {
        Category category = categoryRepository.findById(Long.valueOf(dtc.getId())).orElse(null);//new Category(Long.valueOf(dtc.getId()), dtc.getName());
        if (Objects.isNull(category)) throw new CategoryException("Categoría no encontrada");
        category.setName(dtc.getName());
        categoryRepository.save(category);
    }

    @Transactional
    public List<CategoryDTO> list() {
        Query q = em.createQuery("select c from Category c");
        List<Category> categories = ( List<Category>) q.getResultList();
        return categoryConverter.fromEntity((List<Category>) categoryRepository.findAll());
    }

}
