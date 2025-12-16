package com.hna.webserver;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class WebserverApplicationTests {

    @Test
    void contextLoads() {
        // This test verifies that the Spring application context loads successfully
        // without any configuration errors
    }
}
