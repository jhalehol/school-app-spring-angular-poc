package com.metadata.school.api.exception;

public class ForbiddenException extends Exception {

    public ForbiddenException(final String message) {
        super(message);
    }

    public ForbiddenException(final String message, final Exception exception) {
        super(message, exception);
    }
}
