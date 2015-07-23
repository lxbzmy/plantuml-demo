package cn.devit.util.plantuml;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.springframework.util.MimeTypeUtils;

@WebServlet(name = "hello world servlet", urlPatterns = { "/hello", "/make" })
public class HelloWorld extends HttpServlet {

    /*
     * (non-Javadoc)
     *
     * @see javax.servlet.GenericServlet#init()
     */
    @Override
    public void init() throws ServletException {
        super.init();
        System.out.println(getClass().getName() + " inited.");
    }

    private static final long serialVersionUID = 1L;

    /*
     * (non-Javadoc)
     *
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.
     * HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // request uri contains application context path,/contextPaht/hello
        resp.setContentType(MimeTypeUtils.TEXT_PLAIN.toString());
        if (req.getRequestURI().endsWith("hello")) {
            resp.getWriter().write("world.");
        } else if (req.getRequestURI().endsWith("make")) {
            resp.getWriter().write("love.");
        }
    }

    @Override
    public String getServletInfo() {
        return "Hello world servlet 1.0";
    }

}
