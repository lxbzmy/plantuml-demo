package cn.devit.util.plantuml;

/**
 * Root Application Exception.
 *
 * @author lxb
 *
 */
public class ApplicationException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public ApplicationException() {
        super();
    }

    public ApplicationException(String arg0, Throwable arg1) {
        super(arg0, arg1);
    }

    public ApplicationException(String arg0) {
        super(arg0);
    }

    public ApplicationException(Throwable arg0) {
        super(arg0);
    }

}
