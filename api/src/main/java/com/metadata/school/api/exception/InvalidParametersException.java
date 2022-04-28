package com.metadata.school.api.exception;

public class InvalidParametersException extends Exception {

    public InvalidParametersException(final String message) {
        super(message);
    }

    public InvalidParametersException(final String message, final Exception exception) {
        super(message, exception);
    }
}
