<?php
/**
 * This code can be run on server side to execute PHP code from the interactive editor.
 * 
 * !!!  WARNING !!!
 * This script allows the execution of arbitrary PHP code. Attackers could use it to compromise your servers. Only
 * upload and run this script in specially protected server enviroments.
 * 
 * Without this special knowledge to protect your server, feel free to use our endpoint: http://execute.php-einfach.de/execute.php
 * 
 * @author: Nils Reimers, www.php-einfach.de
 */
session_start();
$code = $_POST['phpeinfach_code_compile'];
header("Access-Control-Allow-Origin: *");
ob_start();
eval(' ?>'.$code);
$output = ob_get_contents();
ob_end_clean();

if(strlen($output) > 512*1024) {
	echo "<strong>Error</strong> - Output exceeded the limit. The first 1024 characters were:<br />";
	echo substr($output, 0, 1024);
	die();
} else {
	echo $output;
}
?>
