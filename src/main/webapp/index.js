Devit = {};
Devit.ui = {};
Devit.app = {};

Devit.app.App = function() {
    'use strict'

    this.init = function(work, input, $el) {
        this.$el = $el;

        function a1() {
            app.onCreate();
        }

        function o1() {
            app.onOpenSvgNewWindow();
        }

        var tb1 = [ {
            view : 'label',
            label : 'Code <span class="webix_icon fa-code"></span>'
        }, {
            gravity : 2
        }, {
            view : "button",
            type : "iconButton",
            icon : "picture-o",
            label : "refresh",
            click : $.proxy(this.onCreate, this)
        } ]
        var tb2 = [ {
            view : 'label',
            template : 'Picture <span class="webix_icon fa-picture-o"></span>'
        }, {
            gravity : 2
        }, {
            view : "button",
            type : "iconButton",
            icon : "share-square-o",
            label : "new win",
            click : $.proxy(this.onOpenSvgNewWindow, this)
        } ]
        var template = '<pre id="editor-box" class="tk-source-code-pro" style="box-sizing: content-box; margin: 0;"></pre>';
        var row1 = {
            cols : [ {
                rows : [ {
                    view : "toolbar",
                    elements : tb1
                }, {
                    template:template,
                } ]
            }, {
                view : "resizer"
            }, {
                rows : [ {
                    view : 'toolbar',
                    elements : tb2
                }, {
                    id : 'preview',
                    scroll : 'xy',
                    template : 'preview'
                } ]
            } ]
        }
        webix.ui({
            rows : [ {
                type : "header",
                content : "header"
            }, row1, {
                height : 32,
                content : 'powerby'
            } ]
        });
        this.$preview = $($$('preview').getNode());

        // TODO dpendencey.
        // webix.markup.init();
        this.editor = orion.editor.edit({
            parent : "editor-box"
        });
        $('#editor-box').height("100%");
        window.editor = this.editor;
        /**
         * @type {HTMLFormElement}
         */
        this.form = $('form').get(0);
        $el.on('click.cmd', '[data-uri^="command:"]', $.proxy(this.command,
                this));
    }
    this.command = function(event) {
        event.preventDefault();
        event.stopPropagation();
        var $btn = $(event.currentTarget);
        /**
         * @type String
         */
        var cmd = $btn.data('uri').replace('command:', '');
        // cmd changed to onCmd
        var handler = 'on' + String.fromCharCode(cmd.charCodeAt(0) - 32)
                + cmd.substring(1);
        if (handler in this) {
            this[handler].call(this, event);
        } else {
            alert('配置错误，data-uri=command:' + cmd + '的处理程序' + handler + '，没有在类型'
                    + this + '中定义');
        }
    }

    this.onCreate = function() {
        var text = this.editor.getText();
        this.$preview.load("generate svg", {
            text : text,
            type : 'SVG'
        }, function(param) {
            // TODO handle error.
        });
    }

    this.onOpenSvgNewWindow = function() {
        var svg = this.$preview.html();
        var target = window.open("_blank");
        target.document.write(svg);
        target.document.close();
    }
}

$(function() {
    window.app = new Devit.app.App()
    app.init(null, null, $('body'))
});