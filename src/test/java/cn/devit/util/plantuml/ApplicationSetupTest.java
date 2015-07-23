package cn.devit.util.plantuml;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;

import java.io.File;
import java.net.MalformedURLException;

import javax.servlet.ServletException;

import org.apache.catalina.*;
import org.apache.catalina.startup.Tomcat;
import org.junit.*;
import org.junit.runner.RunWith;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.SocketUtils;
import org.springframework.web.client.RestTemplate;

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
        // assertThat(response.getBody(), is("world."));
    }

    @AfterClass
    public static void stopTomcat() throws LifecycleException {
        System.out.println("stop tomcat.");
        tomcat.stop();
    }
}
