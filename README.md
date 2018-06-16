# Online PHP Editor
This editor allows to execute PHP script direct in the browser. Users must not need to install PHP on their local machine. An example of this editor in action can be seen here: [PHP-Einfach.de - Interactive Editor](http://www.php-einfach.de/interaktiver-editor/)

## Use the Online PHP Editor for your project
Using this editor for your project is easy. Download and unpack the [ZIP Archive](https://github.com/PHP-Einfach/online-php-editor/archive/master.zip) of this project. In this zip archieve you will find an `index.php` which includes several examples.

The editor has the following dependencies:
* jQuery
* Font Awesome
* FileSaver.js
* Ace Webeditor

To include the editor in your page, use the following code snippet:
```html
<!-- Include the dependencies -->
<link rel="stylesheet" id="font-awesome"  href="libs/font-awesome.min.css" type="text/css" />
<script type="text/javascript" src="libs/jquery-2.1.4.min.js"></script>	
<script type="text/javascript" src="libs/ace/ace.js"></script>
<script type="text/javascript" src="libs/FileSaver.js"></script>

<!-- Include the script and css for the online php editor -->	
<link rel="stylesheet" href="css/php-einfach-online-php-editor.css" type="text/css" />
<script type="text/javascript" src="js/php-einfach-online-php-editor.js"></script>


<!-- Include this code snippet where ever you like to have it in your site -->
<div  class="code" id="code_1" data-ace-editor-id="1"
	data-ace-editor-allow-execution="true" data-ace-editor-hide-vars="false" 
	data-ace-editor-script-name="page.php" data-ace-editor-default-get="" data-ace-editor-default-post="">
<pre class="editor" id="code_editor_1" > &lt;?php
echo "Hi and welcome for our Online PHP Editor. The current time is: ".date("H:i:s")." <br />";
echo "Press the button below to execute the code";
?&gt; </pre></div>

<!-- Call this script to transform your HTML code to actual editors -->
<script>
jQuery('div[data-ace-editor-id]').each(function() {
	var url='http://execute.php-einfach.de:9999/execute.php';
	var language = 'en'; //Choose 'de' for German
	new OnlinePHPEditor(this, language, url);
});
</script>
```
## License and Warranty
This script is provided *without warranty*. To be able to execute the PHP code inside the editor, a PHP backend is required. We provide an open backend at `http://execute.php-einfach.de:9999/execute.php` which you can use as long as you do not cause too much traffic.
The code is licensed under GPL v3. Feel free to change the code as you like.

In case you like the editor, we would ask you to include a link to our website [www.php-einfach.de](http://www.php-einfach.de)

