package cn.devit.util.plantuml;

import static org.springframework.util.StringUtils.hasText;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.springframework.util.MimeTypeUtils;

import com.google.common.io.CountingOutputStream;

import net.sourceforge.plantuml.*;

@WebServlet(name = "Planuml servlet.", urlPatterns = "/generate")
public class Generator extends HttpServlet {

    /*
     * (non-Javadoc)
     *
     * @see javax.servlet.GenericServlet#init()
     */
    @Override
    public void init() throws ServletException {
        super.init();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Support POST.");
    }

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String text = req.getParameter("text");
        String type = req.getParameter("type");
        if (hasText(text) && hasText(type)) {
            FileFormat format = FileFormat.valueOf(type);
            generate(text, format, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "Missing text and type.");
        }
    }

    public void generate(String text, FileFormat type,
            HttpServletResponse response) throws IOException {
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
        /*
         * string 返回的是一个结果
         * (2 activities)
         * 如果有错误那么返回的是
         * (Error)
         */
        String desc = reader.generateImage(png, new FileFormatOption(type));
    }

    @Override
    public String getServletInfo() {
        return "PlantUML image generator 1.0";
    }

}
