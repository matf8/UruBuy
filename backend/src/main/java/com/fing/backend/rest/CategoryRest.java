package com.fing.backend.rest;

import com.fing.backend.business.interfaces.ICategoryService;
import com.fing.backend.dto.CategoryDTO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/category")
@CrossOrigin(value = "*")
@Slf4j
public class CategoryRest {

    @Autowired private ICategoryService categoryService;

    @PostMapping("/add")
    public ResponseEntity<Object> add(@RequestBody CategoryDTO dtc) {
        try {
            categoryService.add(dtc);
            return new ResponseEntity<>("Categoría agregada correctamente", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            List<CategoryDTO> ret = categoryService.list();
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findByName/{name}")
    public ResponseEntity<Object> findByName(@PathVariable String name) {
        try {
            CategoryDTO ret = categoryService.findByName(name);
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable String id) {
        try {
            CategoryDTO ret = categoryService.findById(Long.valueOf(id));
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Categoría no encontrada", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Object> update(@RequestBody CategoryDTO dtc) {
        try {
            if (Objects.nonNull(dtc.getName()))
                categoryService.update(dtc);
            return new ResponseEntity<>("Categoría editada correctamente", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<Object> deleteById(@PathVariable String id) {
        try {
            if (Objects.nonNull(id)) {
                categoryService.deleteById(Long.valueOf(id));
                return new ResponseEntity<>("Categoría borrada correctamente", HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteByName/{name}")
    public ResponseEntity<Object> deleteByName(@PathVariable String name) {
        try {
            categoryService.deleteByName(name);
            return new ResponseEntity<>("Categoría borrada correctamente", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
