package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;
import java.util.Set;

@Entity(name = "Task") // Имя созданной таблицы
@JsonInclude(JsonInclude.Include.NON_EMPTY) // Пустые поля не будут отображаться как пустые
@AllArgsConstructor//Припомощи Lombok создаёт конструктор со всеми параметрами
@NoArgsConstructor//Припомощи Lombok создаёт конструктор без параметров
@Data // Заменяет аннотации
@Builder
@EqualsAndHashCode(exclude = "tags")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private  String text;
    private Boolean isComplete;
    private Date createDate;
    private Date updateDate;
    @ManyToMany
    @JoinTable(
            name = "task_tag", // Имя базы
            joinColumns = @JoinColumn(name = "task_id"), // Какие теги есть у задачи
            inverseJoinColumns = @JoinColumn(name = "tag_id")) // Каким помечали
    private Set<Tag> tags;

    private Long parentId;
    @OneToMany(mappedBy = "parentId")
    private Set<Task> subTasks;

}
