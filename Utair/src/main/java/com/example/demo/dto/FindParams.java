package com.example.demo.dto;

import com.example.demo.entity.Tag;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.xml.crypto.Data;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@lombok.Data
public class FindParams {
    private String text;
    private Date afterCreate;
    private Date beforeCreate;
    private List<Tag> tagList;
    private Boolean isComplete;
}
