package cn.devit.util.plantuml;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Not found.")
public class NotFoundException extends ApplicationException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

}
