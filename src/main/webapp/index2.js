Devit = {};
Devit.ui = {};
Devit.app = {};

Devit.app.App = function() {
    'use strict'

    this.init = function(work, input, $el) {
        this.$el = $el;
        //TODO dpendencey.
        this.editor = orion.editor.edit({parent: "editor-box"});
        window.editor = this.editor;
        console.log(this.editor)
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
        this.form.elements['text'].value=this.editor.getText();

        // $.post($('form').attr('action'), $("form").serialize(),
        // function(data){
        // process(data);
        // }, "xml");
        $('#preview').load("generate svg", $('form').serializeArray(),
                function(param) {
                    // TODO handle error.
                });
    }

    this.onOpenSvgNewWindow = function(){
        var svg = $("#preview").html();
        var target=window.open("_blank");
        target.document.write(svg);
        target.document.close();
    }
}

$(function() {
    new Devit.app.App().init(null, null, $('body'))
});