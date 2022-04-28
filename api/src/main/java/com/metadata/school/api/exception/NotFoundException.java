package com.metadata.school.api.exception;

public class NotFoundException extends Exception {

    public NotFoundException(final String message) {
        super(message);
    }

    public NotFoundException(final String message, final Exception exception) {
        super(message, exception);
    }
}
