/**
 * Install write etc script requirement to document head.
 */

var root = "";
var delta = 0;
if (document.location.pathname.indexOf(root) == 0) {
  delta = 2;
}
var relativeMe = ""
for (var i = 0; i < document.location.pathname.split("/").length - 2 - delta; i++) {
  relativeMe = relativeMe + "../";
}

function js(url) {
  document.write('<s' + 'cript type="text/javascript" src="' + relativeMe + url.substr(1) + '"></' + 'script>')
}

function css(url) {
  document.write('<link rel="stylesheet" href="' + relativeMe + url.substr(1) + '" />')
}
app = document.location.pathname.split("/").pop().replace(/.html?$/, '');
//meta
//document.write('<meta http-equiv="Content-Security-Policy" content="default-src \'self\' http://182.92.7.14/ ;script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'">')


// for all apps.
//js("/node_modules/closure-library/closure/goog/base.js");

js("/assets/jquery-1.9.1.js");
js("/assets/js/bootstrap.js")
css("/assets/css/bootstrap.css");
css("/assets/override.css")

css("/assets/orion/built-editor.css")
js("/assets/orion/built-editor.js")

// for controller js.
js("/"+document.location.pathname.split('/').pop().replace(/.html?$/, "_.js"));