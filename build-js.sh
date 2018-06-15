#!/bin/sh
mvn dependency:copy -Dartifact=com.google.closure-stylesheets:closure-stylesheets:1.5.0:jar:jar-with-dependencies
mvn dependency:copy -Dartifact=com.google.javascript:closure-compiler:v20180610

mkdir -p target/web-compress
DIST='../../../target/web-compress'
cd src/main/webapp
compiler='java -jar node_modules/google-closure-compiler/compiler.jar'
$compiler assets/orion/built-editor.js \
          assets/orion/template.js assist.js >$DIST/editor.js
$compiler index.js \
          node_modules/google-closure-library/closure/**.js '!**_test.js' \
          --dependency_mode=STRICT --entry_point=cn.devit.util.PlantUmlEditor \
          >$DIST/index.js

css="java -jar ../../../target/dependency/closure-stylesheets-1.5.0-jar-with-dependencies.jar"

out=''
files='';
sed -n '/\/\/explode/,/\/\/\}/p' install.js | while read line;
do
  if [[ "${line}" == *"//explode css"* ]];then
    #//explode css("/goog.css");
     out=${line#*\"/}
     out=${out%\"*}
  fi
  if [[ "${line}" == 'css('* ]];then
    file1=${line#*\"/}
    file1=${file1%\"*}
    files="$files $file1"
  fi
  if [[ "${line}" == '//}'* ]];then
    if [[ "${out}" != "" ]];then
     echo "css $DIST/$out"
     $css $files>$DIST/$out
    fi
    out=''
    files=''
  fi
done

#把explode内部的行全部注释，如果explode后面跟了 js css，在把该行生效
# //explode css("1.css") => css("1.css")
sed -e '/\/\/explode/,/\/\/}/s/^/\/\//'  -e '/\/\/\/\/explode/s/^\/\/\/\/explode //' install.js | $compiler >$DIST/install.js

cd $OLDPWD
