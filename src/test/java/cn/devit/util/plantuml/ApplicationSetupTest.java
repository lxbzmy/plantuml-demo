package cn.devit.util.plantuml;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;

import java.io.File;
import java.net.MalformedURLException;

import javax.servlet.ServletException;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.startup.Tomcat;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.SocketUtils;
import org.springframework.web.client.RestTemplate;

/**
 * 验证：程序能够在中间件中启动无误，提前发现集成异常
 * <p>
 *
 *
 * @author lxb
 *
 */
public class ApplicationSetupTest {

    private static int freePort;
    private static Tomcat tomcat;

    /**
    *
    */
    @BeforeClass
    public static void startTomcatServer() {

        freePort = SocketUtils.findAvailableTcpPort();
        System.out.println("start tomcat websocket server at " + freePort);

        String webappDirLocation = "src/main/webapp/";
        tomcat = new Tomcat();
        tomcat.setBaseDir("target/tomcat");

        // Bind the port to Tomcat server
        tomcat.setPort(freePort);

        // Define a web application context.
        try {
            Context context = tomcat.addWebapp("/plantuml",
                    new File(webappDirLocation).getAbsolutePath());
            File configFile = new File(webappDirLocation + "WEB-INF/web.xml");
            context.setConfigFile(configFile.toURI().toURL());
            //
            tomcat.start();

        } catch (ServletException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (LifecycleException e) {
            e.printStackTrace();
        }
    }

    @Before
    public void setUp() {
    }
    
    @Test
    public void testHome() throws Exception {
        RestTemplate rest = new RestTemplate();
        ResponseEntity<String> response = rest.getForEntity(
                "http://localhost:" + freePort + "/plantuml/", String.class);
        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }

    @AfterClass
    public static void stopTomcat() throws LifecycleException {
        System.out.println("stop tomcat.");
        tomcat.stop();
    }
}
