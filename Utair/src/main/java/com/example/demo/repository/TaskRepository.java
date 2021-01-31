package com.example.demo.repository;

import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Позволяет организовать дефолтную работу с DataBase
// На вход получает объект и тип его id
public interface TaskRepository extends JpaRepository<Task,Long>, JpaSpecificationExecutor<Task> {
     public List<Task> findAllByIsComplete(Boolean isComplete);
     public List<Task> findAllByTextIgnoreCaseIsContaining(String text); // найти все todo по тексту с частичным совпадением
     public List<Task> findAllByIsCompleteOrderByCreateDateAsc(Boolean isAsc); // сортировать по дате. По убыванию
}
