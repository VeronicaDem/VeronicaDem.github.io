package com.example.demo.service;

import com.example.demo.entity.Tag;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.TagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public Tag findById(Long id){
        return tagRepository.findById(id).orElseThrow(()->new NotFoundException(id));    }

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Tag add(Tag tag){
        return tagRepository.save(tag);
    }

    public void delete(Long id){
        if (tagRepository.existsById(id))
            tagRepository.deleteById(id);
        else
            throw new NotFoundException(id);
    }

    public Tag save(Tag tag,Long id){
        Tag saveTag = findById(id);
        if (tag.getText() != null)
            saveTag.setText(tag.getText());
        return tagRepository.save(saveTag);
    }

    //Удаление связи На дом.
    // Добавить фильтрацию при выводе, чтобы выводил только parent Task
    //
}
