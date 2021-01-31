package com.example.demo.service;

import com.example.demo.entity.Task;
import com.example.demo.exception.NotFoundException;
import com.example.demo.repository.TaskRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;


import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

// используйте в последней версии
//@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {
    @Mock
    private TaskRepository taskRepository;
    @InjectMocks
    private TaskService taskService;
    // инжектирование mock в реальный класс
   // private TaskService taskService = new TaskService(taskRepository);

    @BeforeEach
    public void init(){
        MockitoAnnotations.initMocks(this);
    }

    private final Task task = Task.builder()
                              .id(1L)
                              .text("TASK_TEXT")
                              .build();

    // тест для findAll
    @Test
    public void findAll() {
        List<Task> comparedList = Collections.singletonList(task);
        // when - thenReturn чтобы поведение репозитория был замоккен + чтобы не нужна была БД
        when(taskRepository.findAll()).thenReturn(comparedList);
        List<Task> result = taskService.findAll();
        assertThat(result, hasSize(1));
        assertThat(result, equalTo(comparedList));
    }
    // ДЗ update, delete
    @Test
    public void add() {

        when(taskRepository.save(task)).thenReturn(task);
        Task result = taskService.add(task);
        assertThat(result, equalTo(task));
        // внутри сервиса репозиторий вызвался один раз
        // какой mock с какими параметрами был вызван и сколько раз
        // какой mock с какими параметрами был вызван и сколько раз
        verify(taskRepository, times(1)).save(task);

        Calendar calendar = new GregorianCalendar();
        calendar.add(Calendar.SECOND, -1);
        assertThat(task.getCreateDate(), greaterThan(calendar.getTime()));
    }
    // ?
    @Test
    public void saveTestTextNull(){
        Task taskTest = Task.builder() // Создали task с пустым полем текста
                .id(100L)
                .text("Text")
                .isComplete(false)
                .build();
        Task taskInto = Task.builder() // Создали task с пустым полем текста
                .id(100L)
                .text(null)
                .isComplete(false) // Добавляем поле isComplete значение, для корректной проверки
                .build();
        when(taskRepository.findById(taskTest.getId())).thenReturn(Optional.of(taskInto));
        when(taskRepository.save(taskInto)).thenReturn(taskInto);

        Task result = taskService.save(taskTest,taskTest.getId());
        // Проверка даты обновления
        Calendar calendar = new GregorianCalendar();
        calendar.add(Calendar.SECOND,-1);

        assertThat(result.getUpdateDate(),is(notNullValue()));
        assertThat(result.getUpdateDate(),greaterThan(calendar.getTime()));
        assertThat(result.getText(),equalTo(taskTest.getText()));
        assertThat(result.getIsComplete(),equalTo(taskTest.getIsComplete()));
    }



    @Test
    public void deleteTest(){
        when(taskRepository.findById(task.getId())).thenReturn(Optional.of(task));

        taskService.delete(task.getId());

        verify(taskRepository,times(1)).deleteById(task.getId());
    }


    @Test
    public void findById() {
        // ofNullable - с проверкой на пустоту
       /* when(taskRepository.findById(100L)).thenReturn(java.util.Optional.ofNullable(task));
        Task result = taskService.findById(100L);
        assertThat(result, equalTo(task));
         */
       /* NotFoundException exception = new NotFoundException(1L);
        when(taskRepository.findById(1L)).thenThrow(exception);
        result = taskService.findById(1L);
        assertThat(result, equalTo(exception));
        */
       /*
        try {
            when(taskRepository.findById(1L)).thenReturn(java.util.Optional.ofNullable(task));
            Task result = taskService.findById(1L);

            assertThat(result, equalTo(task));

        }catch(NotFoundException e) {
            NotFoundException exception = new NotFoundException(1L);
            String message = exception.getMessage();
            when(taskRepository.findById(1L)).thenThrow(exception);
            Assert.fail(message);
        }

        */
        // метод от Utair
        when(taskRepository.findById(0L)).thenReturn(Optional.empty());
        try {
            Task task = taskService.findById(0L);
        }catch(NotFoundException e) {
            assertThat("Could not find obj with id = 0", equalTo(e.getMessage()));
            return;
        }catch(Throwable e){
            fail();
        }
        fail();


    }
}
