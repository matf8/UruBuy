package com.fing.backend.business.interfaces;

import com.fing.backend.dto.CategoryDTO;
import java.util.List;

public interface ICategoryService {
    void add(CategoryDTO dtc);
    void deleteByName(String name) throws Exception;
    void deleteById(Long id);
    CategoryDTO findById(Long id);
    CategoryDTO findByName(String name) throws Exception;
    void update(CategoryDTO dtc) throws Exception;
    List<CategoryDTO> list();

}
