/**
 * Install write etc script requirement to document head.
 */

var root = "";
var pathname = document.location.pathname;
if (/\/$/.test(pathname)) {
    pathname = pathname + "index.html";
}

var delta = 0;
if (pathname.indexOf(root) == 0) {
    delta = 2;
}
var relativeMe = ""
for (var i = 0; i < pathname.split("/").length - 2 - delta; i++) {
    relativeMe = relativeMe + "../";
}

function js(url) {
    document.write('<s' + 'cript type="text/javascript" src="' + relativeMe
            + url.substr(1) + '"></' + 'script>')
}

function css(url) {
    document.write('<link rel="stylesheet" href="' + relativeMe + url.substr(1)
            + '" />')
}
app = pathname.split("/").pop().replace(/.html?$/, '');


//explode css("/goog.css");
css("/assets/css/goog/menu.css");
css("/assets/css/goog/common.css");
css("/assets/css/goog/menuitem.css");
css("/assets/css/goog/menuseparator.css");
css("/assets/css/goog/toolbar.css");
css("/assets/css/goog/dialog.css");
//}

css("/assets/fonts/glyphicon.css")

js("/assets/jquery-1.9.1.js");
//js("/assets/js/bootstrap.js")
//css("/assets/css/bootstrap.css");

//explode css("/editor.css");
css("/assets/override.css")
css("/assets/orion/built-editor.css")
//}

//explode js("/editor.js");
js("/assets/orion/built-editor.js")
//js("/assets/orion/contentAssist/cssContentAssist.min.js")
js("/assets/orion/template.js")
js("/assist.js");
//}


//explode
js("/node_modules/google-closure-library/closure/goog/base.js");
//}

// for controller js.
js("/" + pathname.split('/').pop().replace(/.html?$/, ".js"));