/*************************************************************************************
 * PHP-Einfach.de - PHP Online Editor
 * Allows the execution of PHP Code directly in the browser of the user.
 * Feel free to change the code as you like. The code is provided without warranty.
 * 
 * Copyright: 2016 - Nils Reimers (info@php-einfach.de)
 * License: GPL v3 
 * URL: https://github.com/PHP-Einfach/online-php-editor/ | http://www.php-einfach.de
 *************************************************************************************/


function OnlinePHPEditor(element, language='en', url='http://execute.php-einfach.de/execute.php') {
	var lang = {
			'execute': 'Execute',
			'execute_code': 'Execute code',
			'switch views': 'Switch views',
			'download script': 'Download script',
			'define GET/POST variables': 'Define GET/POST-Variablen variables',
			'hide_get': 'Hide GET parameters',
			'hide_post': 'Hide POST parameters',
			'value': 'Value...',
			'help': 'Help',
			'last_execution': 'Last execution:',
			'error': "Sadly the PHP script couldn't be executed. One reason could be an too old browser version."
	}
	
	var lang_de = {
			'execute': 'Ausführen',
			'execute_code': 'Code ausführen',
			'switch views': 'Anzeige umschalten',
			'download script': 'Script herunterladen',
			'define GET/POST variables': 'GET/POST-Variablen definieren',
			'hide_get': 'GET-Parameter verbergen',
			'hide_post': 'POST-Parameter verbergen',
			'value': 'Wert...',
			'help': 'Hilfe',
			'last_execution': 'Letzte Ausführung:',
			'error': 'Leider ist ein Fehler beim Ausführen deines PHP-Scripts aufgetreten. Eine häufige Fehlerquelle sind veraltete Browser.'
	}
	
	if(language.toLowerCase() == 'de') {
		for (var attrname in lang_de) { lang[attrname] = lang_de[attrname]; }
	}
	
	this.lang = lang;
	
	
	var id = jQuery(element).data('ace-editor-id');
	var allowExecution = false;
	var mode = "ace/mode/php";
	var scriptName = "page.php";
	var hideVars = false;	
	var defaultGet = "";
	var defaultPost = "";
	
	if (jQuery(element).attr('data-ace-editor-allow-execution')) {
		allowExecution = jQuery(element).data('ace-editor-allow-execution') === true;
	}

	if (jQuery(element).attr('data-ace-editor-mode')) {
		mode = jQuery(element).data('ace-editor-mode');
	}
	
	if (jQuery(element).attr('data-ace-editor-hide-vars')) {
		hideVars = jQuery(element).data('ace-editor-hide-vars');
	}
	
	if (jQuery(element).attr('data-ace-editor-script-name')) {
		scriptName = jQuery(element).data('ace-editor-script-name');
	}
	
	if (jQuery(element).attr('data-ace-editor-default-get')) {
		defaultGet = jQuery(element).data('ace-editor-default-get');
	}
	
	if (jQuery(element).attr('data-ace-editor-default-post')) {
		defaultPost = jQuery(element).data('ace-editor-default-post');
	}
	
	this.editor = addEditor(id, allowExecution, scriptName, hideVars, defaultGet, defaultPost, url);
	this.url = url
	OnlinePHPEditor.editors[id] = this
	
	function addEditor(id, allowExecution, scriptName, hideVars, defaultGet, defaultPost) {
		function escapeHtml(string) {
			  var entityMap = {
					    "&": "&amp;",
				    "<": "&lt;",
				    ">": "&gt;",
				    '"': '&quot;',
				    "'": '&#39;',
				    "/": '&#x2F;'
				  };
	
			  return String(string).replace(/[&<>"'\/]/g, function (s) {
				  return entityMap[s];
			  });
		}
	
		
		allowExecution = typeof allowExecution !== 'undefined' ? allowExecution : false;
		scriptName = typeof scriptName !== 'undefined' ? scriptName : 'page.php';
		hideVars = typeof hideVars !== 'undefined' ? hideVars : false;
		defaultGet = typeof defaultGet !== 'undefined' ? defaultGet : '';
		defaultPost = typeof defaultPost !== 'undefined' ? defaultPost : '';
		
		defaultPostParameter = '';
		
		if(defaultPost.trim() != '') {
			parsedPost = JSON.parse('{'+defaultPost.trim()+'}');
			for (var key in parsedPost) {
				defaultPostParameter += '<input type="text" value="'+escapeHtml(key)+'" onkeyup="addPostValue(\''+id+'\')" /> <input type="text" value="'+escapeHtml(parsedPost[key])+'" onkeyup="addPostValue(\''+id+'\')"/><br />';
			}
		}
	
		
		if(allowExecution) {
			jQuery("#code_editor_"+id).after(
				'<div class="resultbox">'+
					'<div class="resultheader">'+ 
					'	<div class="code-navbar code-navbar-right">'+	
					'		<ul class="code-nav">'+
					'			<li class="hide-before-execution"><a href="#" onclick="OnlinePHPEditor.switchView(\''+id+'\'); return false;" title="'+lang['switch views']+'"><i  id="code_code-sym_'+id+'" class="fa fa-file-text-o"></i></a></li>'+ 
					'			<li><a href="#" onclick="OnlinePHPEditor.downloadScript(\''+id+'\', \''+scriptName+'\'); return false;" title="'+lang['download script']+'"><i class="fa fa-download"></i></a></li>'+ 
					'			<li><a href="http://www.php-einfach.de/interaktiver-editor" target="_blank" title="'+lang['help']+'"><i class="fa fa-question-circle"></i></a></li>'+		 		
					'		</ul>'+
					' 	</div>'+
					'	<div class="code-navbar">'+
					'		<ul class="code-nav">'+
					'			<li><a href="#" id="compileButton" onclick="OnlinePHPEditor.submitCode(\''+id+'\'); return false;" title="'+lang['execute_code']+'"><i id="code_gear-sym_'+id+'" class="fa fa-cog"></i> '+lang['execute']+' <span class="hide-before-execution">(F9)</span></a></li>'+
					((hideVars) ? '' : '<li><a href="#" title="'+lang['define GET/POST variables']+'" onclick="OnlinePHPEditor.cyclePostGetVars(\''+id+'\'); return false;">$</a></li>')+
					'		</ul>'+
					'	</div>'+		 	
					'</div>'+
					'<div class="result-get-parameters" id="code_get_parameters_'+id+'"><div style="float: right"><button type="button" class="close" title="'+lang['hide_get']+'" onclick="jQuery(\'#code_get_parameters_'+id+'\').slideUp();">×</button></div>GET-Parameter: '+scriptName+'?<input type="text" value="'+defaultGet+'" id="code_get_parameters_input_'+id+'" /></div>'+
					'<div class="result-post-parameters" id="code_post_parameters_'+id+'"><div style="float: right"><button type="button" class="close" title="'+lang['hide_post']+'" onclick="jQuery(\'#code_post_parameters_'+id+'\').slideUp();">×</button></div>'+
					'	POST-Parameter<br />'+
						defaultPostParameter+
					'	<input type="text" placeholder="Name..." onkeyup="OnlinePHPEditor.addPostValue(\''+id+'\')" /> <input type="text" placeholder="'+lang['value']+'" onkeyup="OnlinePHPEditor.addPostValue(\''+id+'\')"/>'+
					'</div>'+
					'<div class="result" id="code_result_'+id+'" data-view="html">'+
					'	<iframe class="resultHTML" id="code_resultHTML_'+id+'"></iframe>'+
					'	<div class="resultText" id="code_resultText_'+id+'" style="display: none;"></div>'+
					'	<div class="code-nav-status" id="code_code-nav-status_'+id+'"> </div>'+
					'</div>'+
				'</div>');
		}
		var editor = ace.edit("code_editor_"+id);
	
	    editor.setTheme("ace/theme/crimson_editor");
	    editor.session.setMode("ace/mode/php");
	    editor.setOptions({
	        maxLines: Infinity,
	        highlightActiveLine: false,
	        showPrintMargin: false
	    });
	
	    editor.commands.bindKey("F9", function(cm) {
			OnlinePHPEditor.submitCode(id);
		});
	
	    
	    jQuery('#code_'+id).on('keydown', function(e){
	    	if(e.keyCode == 120) { //Fp
	    		 submitCode(id);
	    	     return false;
	    	}
	    });
	
	    editor.session.setOption("useWorker", false);
	
	    if(!allowExecution) {
	    	editor.setReadOnly(true);
	    }
	    return editor;
	}
}

OnlinePHPEditor.editors = {};
OnlinePHPEditor.get = function(id) {
	return OnlinePHPEditor.editors[id];
}







OnlinePHPEditor.submitCode = function(id) {
	var editor = OnlinePHPEditor.get(id)
	var readOnly = editor.editor.getReadOnly();
	
	if(readOnly)
		return;
	
	jQuery("#code_gear-sym_"+id).addClass('fa-spin');
	var code = editor.editor.getValue();
	var get = jQuery('#code_get_parameters_input_'+id).val();
	var postInputs = jQuery('#code_post_parameters_'+id).find("input");

	var postValues = {phpeinfach_code_compile: code};
	
	for (i = 0; i < postInputs.length; i+=2) {
		postValues[jQuery(postInputs[i]).val()] = jQuery(postInputs[i+1]).val();
	}
	
	jQuery.support.cors = true;
	
	
	var url = editor.url+"?"+get
	
	jQuery.ajax({
		type: "POST",
		url: url,
		data: postValues,
		crossDomain: true
	})	
	.done(function( data, status, xhr ) {
		jQuery('#code_result_'+id).show();
		jQuery('#code_'+id).find('.hide-before-execution').show();
		jQuery('#code_resultHTML_'+id).contents().find('body').html(data);
		jQuery('#code_resultText_'+id).html("<pre>"+OnlinePHPEditor.htmlEntities(data)+"</pre>");
		

		//Resize iframe
		jQuery('#code_resultHTML_'+id).height('25px');
		var iframeBody = jQuery('#code_resultHTML_'+id).contents().find("body");
		var newHeight =  iframeBody[0].scrollHeight; // + options.heightOffset;
	 	//var newHeight = jQuery('#code_resultHTML_'+id).contents().find("body").outerHeight(); // +25;
	 	newHeight = Math.max(25, Math.min(500, newHeight));
	 	jQuery('#code_resultHTML_'+id).height(newHeight+'px');
		
		var date = new Date();
		var day = ('0' + date.getDate()).slice(-2);
		var month = ('0'+date.getMonth()+1).slice(-2);
		var year = date.getFullYear().toString().substring(2,4);
		var hour = ('0'+date.getHours()).slice(-2);
		var minute = ('0'+date.getMinutes()).slice(-2);
		var second = ('0'+date.getSeconds()).slice(-2);
		
		jQuery("#code_code-nav-status_"+id).text(editor.lang['last_execution']+" "+day+"."+month+"."+year+" "+hour+":"+minute+":"+second);

	 }).fail(function(data) {
	    alert(editor.lang['error']);
	 }).always(function() {
		 jQuery("#code_gear-sym_"+id).removeClass('fa-spin');	
	 });
	
}	  
OnlinePHPEditor.htmlEntities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


OnlinePHPEditor.switchView = function(id) {
	if(jQuery("#code_result_"+id).data('view') == "html") {
		jQuery("#code_resultHTML_"+id).hide();
		jQuery("#code_resultText_"+id).show();
		jQuery("#code_result_"+id).data('view', 'text');
		jQuery("#code_code-sym_"+id).removeClass("fa-fa-text-o").addClass("fa-code");
	} else {
		jQuery("#code_resultHTML_"+id).show();
		jQuery("#code_resultText_"+id).hide();
		jQuery("#code_result_"+id).data('view', 'html');
		jQuery("#code_code-sym_"+id).removeClass("fa-code").addClass("fa-file-text-o");
		
		//Resize iframe
		var newHeight = jQuery('#code_resultHTML_'+id).contents().find("body").height()+25;
	 	newHeight = Math.min(500, newHeight);
	 	jQuery('#code_resultHTML_'+id).height(newHeight+'px');
		
	}
}

/**
 * Enables the user to save the script locally
 * @param id
 * @param scriptName
 */
OnlinePHPEditor.downloadScript = function (id, scriptName) {
	var code = OnlinePHPEditor.get(id)['editor'].getValue();
	saveTextAs(code, scriptName);
}

OnlinePHPEditor.addPostValue = function(id) {
	var lastValue = jQuery('#code_post_parameters_'+id).children('input:last').val();
	if(lastValue.trim() != "") {
		jQuery('#code_post_parameters_'+id).append('<br /><input type="text" placeholder="Name..." onkeyup="addPostValue(\''+id+'\')" /> <input type="text" placeholder="Wert..." onkeyup="addPostValue(\''+id+'\')"/>');
	}
}

OnlinePHPEditor.cyclePostGetVars = function(id) {
	var getId = "#code_get_parameters_"+id;
	var postId = "#code_post_parameters_"+id;

	if(jQuery(getId).is(":visible") && jQuery(postId).is(":visible")) {
		jQuery(getId).slideUp();
		jQuery(postId).slideUp();
		
	} else {
		jQuery(getId).slideDown();
		jQuery(postId).slideDown();
	}
	
}