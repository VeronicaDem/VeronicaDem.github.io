package com.example.demo.service;
import org.apache.commons.lang3.StringUtils;

import com.example.demo.dto.FindParams;
import com.example.demo.entity.Tag;
import com.example.demo.entity.Task;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import java.util.*;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TagService tagService;

    public Task findById(Long id){
        return taskRepository.findById(id).orElseThrow(()->new NotFoundException(id)); //меод findById озвращает типа Optional - который возвращает либо наш класс,
        // либо указывает, что ничего не найдено

    }

    public List<Task> findByParam(FindParams findParams){
        return taskRepository.findAll((root, criteriaQuery, criteriaBuilder) -> {
            //Сортировка по createDate
            criteriaQuery.orderBy(criteriaBuilder.desc(root.get("createDate")));

            List<Predicate> predicates = new ArrayList<>();

            //Поиск по выполнен/невыполнен
            if (findParams.getIsComplete() != null) {
                predicates.add(criteriaBuilder.equal(
                        root.get("isComplete"),
                        findParams.getIsComplete()));
            }

            //Поиск Только главных задач
            predicates.add(criteriaBuilder.isNull(root.get("parentId")));

            //Поиск по тегам в формате или
            if (!CollectionUtils.isEmpty(findParams.getTagList())){
                Join<Task, Tag> tags = root.join("tags");
                predicates.add(criteriaBuilder.or(
                        findParams.getTagList()
                                .stream()
                                .map(tag -> criteriaBuilder.equal(tags.get("id"), tag.getId()))
                                .toArray(Predicate[]::new)
                ));
                criteriaQuery.groupBy(root.get("id")); // исключить дублирование
            }

            //Поиск по следующим указанной дате
            if (findParams.getAfterCreate() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createDate"), findParams.getAfterCreate()));
            }

            //Поиск по предыдущим указанной дате
            if (findParams.getBeforeCreate() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("createDate"), findParams.getBeforeCreate()));
            }

            //Поиск по тексту
            if (StringUtils.isNotEmpty(findParams.getText())) {
                Stream.of(findParams
                        .getText()
                        .toUpperCase()
                        .trim()
                        .split("[^a-zA-Za-яA-ЯёЁ\\d]"))
                        .forEach(key -> {
                            if (key.length() >= 3) {
                                predicates.add(criteriaBuilder.like(criteriaBuilder.upper(root.get("text")), "%" + key + "%"));
                            }
                        });
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[]{}));
        });
    }


    public List<Task> findAll(){
        return taskRepository.findAll();
    }

    public Task add(Task task){
        task.setCreateDate(new Date());
        task.setUpdateDate(null);
        return taskRepository.save(task);
    }
    public Task save(Task task,Long id){
        Task saveTask = findById(id);
        System.out.println(saveTask.toString());
        if (task.getText() != null){
            saveTask.setText(task.getText());
        }
        if (task.getIsComplete() != null){
            saveTask.setIsComplete(task.getIsComplete());
        }
        if (task.getText() != null && task.getText().equalsIgnoreCase(saveTask.getText()) && task.getIsComplete() == saveTask.getIsComplete())
            saveTask.setUpdateDate(new Date());
        System.out.println(saveTask.toString());
        return taskRepository.save(saveTask);
    }

    public void delete(Long id){
        Task task = findById(id);
        taskRepository.deleteById(task.getId());
    }

    public Task addTag(Long idTag,Long idTask){
        Tag tag = tagService.findById(idTag);
        Task task = findById(idTask);

        if (task.getTags() == null)
            task.setTags(new HashSet<>()); // Добавили тэг в множество тегов
        task.getTags().add(tag);

        return taskRepository.save(task);
    }
}
