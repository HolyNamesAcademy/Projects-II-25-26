package com.hna.webserver.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Runs {@link DevDataSeedService} once and exits the JVM. Enabled only when
 * {@code -Dapp.seed.cli=true} (see Gradle {@code seed} task / {@code ./sail backend:seed}).
 */
@Component
@Profile("dev")
@Order(100)
@ConditionalOnProperty(name = "app.seed.cli", havingValue = "true")
public class DevDataSeedCliRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeedCliRunner.class);

    private final DevDataSeedService devDataSeedService;
    private final ConfigurableApplicationContext applicationContext;

    public DevDataSeedCliRunner(
            DevDataSeedService devDataSeedService,
            ConfigurableApplicationContext applicationContext) {
        this.devDataSeedService = devDataSeedService;
        this.applicationContext = applicationContext;
    }

    @Override
    public void run(ApplicationArguments args) {
        log.info("Running one-shot dev data seed (app.seed.cli=true)");
        devDataSeedService.seedIfNeeded();
        int code = SpringApplication.exit(applicationContext, () -> 0);
        System.exit(code);
    }
}
