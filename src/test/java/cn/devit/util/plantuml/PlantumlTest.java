package cn.devit.util.plantuml;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.*;

import java.io.*;
import java.nio.charset.Charset;

import org.junit.Test;

import com.google.common.io.CountingOutputStream;

import net.sourceforge.plantuml.*;

public class PlantumlTest {

    @Test
    public void test_create_png() throws Exception {

        CountingOutputStream png = new CountingOutputStream(new FileOutputStream("1.png"));
        String source = "@startuml\n";
        source += "Bob -> Alice : hello\n";
        source += "@enduml\n";

        SourceStringReader reader = new SourceStringReader(source);
        // Write the first image to "png"
        String desc = reader.generateImage(png);
        System.out.println(desc);
        System.out.println(png.getCount());
        // Return a null string if no generation
        assertThat(desc, notNullValue());
    }

    @Test
    public void test_pom_ok() throws Exception {
        String source = "@startuml\n";
        source += "Bob -> Alice : hello\n";
        source += "@enduml\n";

        SourceStringReader reader = new SourceStringReader(source);
        final ByteArrayOutputStream os = new ByteArrayOutputStream();
        // Write the first image to "os"
        String desc = reader.generateImage(os,
                new FileFormatOption(FileFormat.SVG));
        os.close();

        // The XML is stored into svg
        final String svg = new String(os.toByteArray(),
                Charset.forName("UTF-8"));
        System.out.println(svg);
        System.out.println(svg.length());
        assertThat(svg, notNullValue());
    }

}
