package com.metadata.school.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties("school")
public class ApplicationConfiguration {

    private String oauthPrivateKeyPath;
    private String oauthPublicKeyPath;
    private Long oauthTokenExpirationTimeMins;
}
