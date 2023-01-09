package com.fing.backend.converter;

import com.fing.backend.dto.CategoryDTO;
import com.fing.backend.entity.Category;
import java.util.Objects;

public class CategoryConverter extends AbstractConverter<Category, CategoryDTO> {

    private static CategoryConverter categoryConverter;

    private CategoryConverter() { }

    public static CategoryConverter getInstance() {
        if (Objects.isNull(categoryConverter)){
            categoryConverter = new CategoryConverter();
        }
        return categoryConverter;
    }

    @Override
    public CategoryDTO fromEntity(Category e) {
        if (Objects.isNull(e)) {
            return null;
        }
        return CategoryDTO.builder()
                .id(e.getId().toString())
                .name(e.getName()).build();
    }

    @Override
    public Category fromDTO(CategoryDTO d) {
        if (Objects.isNull(d)) {
            return null;
        }
        if (Objects.isNull(d.getId()))
            return Category.builder().name(d.getName()).build();
        else {
            return Category.builder()
                    .id(Long.parseLong(d.getId()))
                    .name(d.getName())
                    .build();
        }
    }

}
