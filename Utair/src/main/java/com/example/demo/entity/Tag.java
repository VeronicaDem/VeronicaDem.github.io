package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EqualsAndHashCode(exclude = "taskSet")
@JsonInclude(JsonInclude.Include.NON_EMPTY) // Пустые поля не будут отображаться как пустые
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)

    private Long id;
    private String text;
    @ManyToMany(mappedBy = "tags")
    private Set<Task> taskSet;


}
