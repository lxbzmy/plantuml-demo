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

//Tool bar
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonSide');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Option');
goog.require('goog.ui.SelectionModel');
goog.require('goog.ui.Separator');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');

goog.require('goog.ui.Dialog');
goog.require('goog.html.SafeHtml');
//html5 local storage
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');

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
        var __ = this;
        this.storage = new goog.storage.Storage(goog.storage.mechanism.mechanismfactory.create())
        var tb = new goog.ui.Toolbar();
        tb.decorate(goog.dom.getElement('t2'));
        tb.setEnabled(true);
       function bbb(e){
         //XXX 改造不用__
         var caption = e.target.getId();
         var $dom = $(e.target.element_);
         if($dom.data('uri')!=null){
           e.preventDefault();
           e.stopPropagation();
           __.command({currentTarget:$dom.get(0)})
         }else if($dom.parent().data('uri') != null){
           e.preventDefault();
           e.stopPropagation();
           __.command({currentTarget:$dom.parent().get(0),target:$dom.get(0)})
           
         }else{
           
//          if (typeof e.target.getCaption == 'function' && e.target.getCaption()) {
//            caption += ' (' + e.target.getCaption() + ')';
//         }
//         console.log(caption , e.type);
         }
         
       }
        goog.events.listen(tb,goog.ui.Component.EventType.ACTION, bbb);

        this.$preview = $('#preview');
        

        // TODO dpendencey.
        this.editor = orion.editor.edit({
            parent : "editor-box",
            theme:'assets/orion/themes/eclipse'
        });
        this.editor.getContentAssist().setProviders([
          this.contentAssist()
        ]);
        if(this.storage.get("saved")){
          this.editor.setText(this.storage.get("saved"));
        }

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
      
//        this.$el.on('click.cmd', '[data-uri^="command:"]', $.proxy(
//                this.command, this));

    }
    
    this.contentAssist = function(){
        function PlantUmlAsist(){
            
        }

        /**
        * @param {Object} editorContext
        * @param {Object} options
        * @param {String} options.delimiter
        * computeContentAssist(editorContext, options)
        editorContext ObjectReference The Editor Context object.
        options Object
        options.delimiter String The line delimiter being used in the editor (CRLF, LF, etc.)
        options.indentation String The leading whitespace at the start of the line.
        options.line String The text of the line.
        options.offset Number The offset at which content assist is being requested. Relative to the document.
        options.prefix String The substring extending from the first non-word character preceding the editing caret up to the editing caret. This may give a clue about what the user was in the process of typing. It can be used to narrow down the results to be returned. The prefix is just a guess; it is not appropriate for all types of document, depending on their syntax rules.
        options.selection orion.editor.Selection The current selection in the editor.
        options.tab String The tab character being used in the editor. Typical values are a Tab character, or a sequence of four spaces.

        */
        PlantUmlAsist.prototype.computeProposals = function(buffer, offset, context) {
          
          return [
            {proposal:'->',description:''},
            {proposal:'-->',description:''},
            {proposal:' : ',description:''},
            {proposal:'>',description:'>'},
            {proposal:'note right: ',description:'备注，右边'},
            {proposal:'note left: ',description:'备注，左边'}
          ]
        }
        return new PlantUmlAsist();

    }
    
    
    
    this.onShowAboutMe = function(){
      
      if(!this.dlg){
        var dialog1 = new goog.ui.Dialog();
        dialog1.setModal(true);
        dialog1.setSafeHtmlContent(goog.html.SafeHtml.htmlEscape(
        'UML Graphic Generator, Author:alex. Powered by:goog closure,plantuml,spring framework'
        ));
        dialog1.setTitle('About');        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
        this.dlg = dialog1;
      }
      
      this.dlg.setVisible(true);
      this.dlg.getElement().style.zIndex = 100;
      
    }

    this.command = function(event) {
        //event.preventDefault();
        //event.stopPropagation();
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
        var $a = $(event.target)//.closest('a');
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
        this.storage.set("saved",text)
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