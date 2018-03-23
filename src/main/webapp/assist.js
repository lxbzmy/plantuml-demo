function PlantUmlAsist(){}

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
    
    function title(title){
        return {
            proposal: '',
            description: title , //$NON-NLS-0$
            style: 'noemphasis_title', //$NON-NLS-0$
            unselectable: true
          }
    }
    function template(prefix,desc,late){
        return new Template.Template(prefix, desc, late).getProposal('', offset, context)
    }
    function word(word){
        return {proposal:word}
    }
  
  return [
      title('通用'),
      template('title','title 标题','title ${图形标题}'),
      {proposal:'note right: ',description:'备注，右边'},
      {proposal:'note left: ',description:'备注，左边'},
      title('用例图(usecase'),
      template('actor','actor --> usecase','${actor} --> (${usecase})'),
      template('actor','actor name as alias','actor :${Last actor}: as ${alias}'),
//      template('usecase','usecase . as .','usecase ${alias} as ${long desc}'),
      template('usecase','(usecase) as (..)','(${case}) as (${short})'),
      title('顺序图(sequence)'),
      template('--','角色 -> 角色：操作','${actor1} -> ${actor2}: ${operation}'),
      template("== title ==",'== 分隔符 == ','== ${title for split} =='),
      template('activate','生命线激活','activate '),
      template('deactivate','生命线结束','deactivate '),
      template('ca','声明参与者','participant ${display name} as ${alias}'),
      title('关键字'),
      {proposal:'->',description:''},
      {proposal:'-->',description:''},
      {proposal:' : ',description:''},
      {proposal:'>',description:'>'},
      word('actor'),
      word('boundary'),
      word('control'),
      word('entity'),
      word('database'), 
      word('usecase')
  ]
}