package com.metadata.school.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginationDto {

    private static final int DEFAULT_PAGE_NUMBER = 1;
    private static final int DEFAULT_PAGE_SIZE = 15;

    private Integer pageNumber;
    private Integer pageSize;


    public Integer getPageSize() {
        return pageSize == null ? DEFAULT_PAGE_SIZE : pageSize;
    }

    public Integer getPageNumber() {
        return pageNumber == null ? DEFAULT_PAGE_NUMBER : pageNumber;
    }
}
