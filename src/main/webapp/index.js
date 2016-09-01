/**
 * Online UML editor made up of PlanUML , Orion and Closure.
 *
 * @author lxb
 *
 */
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Component');
goog.require('goog.ui.Ratings');
goog.require('goog.ui.ServerChart');
goog.require('goog.ui.SplitPane');
goog.require('goog.ui.SplitPane.Orientation');
goog.require('goog.dom.ViewportSizeMonitor');

goog.provide("cn.devit.util.PlantUmlEditor");

cn.devit.util.PlantUmlEditor = function() {

    /**
     *
     * @param site
     *            应用实例，上下文；
     * @param parent
     *            容器，在这个DIV中布局；
     * @param input
     *            输入参数；
     *
     */
    this.init = function(site, parent, input) {
        this.$el = parent;

        this.$preview = $('#preview');

        // TODO dpendencey.
        this.editor = orion.editor.edit({
            parent : "editor-box",
            theme:'assets/orion/themes/eclipse'
        });

        var lhs = new goog.ui.Component();
        var rhs = new goog.ui.Component();

        // Set up splitpane with already existing DOM.
        var splitpane1 = new goog.ui.SplitPane(lhs, rhs,
                goog.ui.SplitPane.Orientation.HORIZONTAL);

        var $main = $('#main1');
        // splitpane1.setInitialSize(100%);
        splitpane1.setInitialSize($main.width() / 2);
        splitpane1.setHandleSize(10);
        splitpane1.decorate(goog.dom.$('anotherSplitter'));
        splitpane1.setSize(new goog.math.Size($main.width(),$main.height()));

        // Start listening for viewport size changes.
        var vsm = new goog.dom.ViewportSizeMonitor();
        goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
          var size = new goog.math.Size($main.width(), $main.height());
          splitpane1.setSize(size);
        });
        this.editor.getTextView().addEventListener("Modify",
                $.proxy(this.delayPreview, this));

        this.$el.on('click.cmd', '[data-uri^="command:"]', $.proxy(
                this.command, this));

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

    /**
     *
     * @param {Event}
     *            event;
     *
     *
     */
    this.onExample = function(event) {
//    	event.target; 在哪个元素上点击的
//    	event.relatedTarget; 相关元素，比如a上有监听，但是a下还是span，如果span点击了，target=span,relatedTarget=a
        var $a = $(event.target).closest('a');
        var type = $a.text().trim().toLocaleLowerCase();

        $.ajax("examples/" + type + ".txt", {
            type : "GET",
            dataType : 'text'
        }).done($.proxy(function(text) {
            this.editor.setText(text);
        }, this));

    }

    this.timeout = 0;
    this.delayPreview = function() {
        if (this.timeout == 0) {
            this.timeout = setTimeout($.proxy(this.onCreate, this), 3000);
        }
    }

    this.onCreate = function() {
        if (this.timeout > 0) {
            clearTimeout(this.timeout);
            this.timeout = 0;
        }
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
    var ins = new cn.devit.util.PlantUmlEditor();
    ins.init(null, $('body'), null);
})