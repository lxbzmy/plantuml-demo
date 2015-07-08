package cn.devit.util.plantuml;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.*;
import org.springframework.web.bind.annotation.*;

import com.google.common.io.CountingOutputStream;

import net.sourceforge.plantuml.*;

@Controller
public class Get {

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String helloWorld(Object model) {
        return "/world";
    }

    @RequestMapping(value = "/make", method = RequestMethod.GET)
    public String makeLove(Object model) {
        return "/love";
    }

    @RequestMapping(value = "/generate", method = RequestMethod.POST)
    @ResponseBody
    public void generate(@RequestParam("text") String text,
            @RequestParam("type") FileFormat type, HttpServletResponse response)
                    throws IOException {
        // TODO add power by header
        // TODO add version header?
        if (type == FileFormat.PNG) {
            response.setContentType(MimeTypeUtils.IMAGE_PNG_VALUE);
        }
        if (type == FileFormat.SVG) {
            response.setContentType("image/svg+xml");
        }
        CountingOutputStream png = new CountingOutputStream(
                response.getOutputStream());
        String source = "@startuml\n";
        source += text;
        source += "\n@enduml\n";
        SourceStringReader reader = new SourceStringReader(source);
        // Write the first image to "png"
        String desc = reader.generateImage(png, new FileFormatOption(type));
    }
}
