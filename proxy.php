<?php
/**
 * This is a proxy PHP scripts which takes the request from the user and forwards
 * it to our server, where the PHP code is executed.
 * 
 * This proxy script is required when the browser does not support cross domain requests
 * or when your website is using https.
 * 
 * @author Nils Reimers, www.php-einfach.de
 */
$url = 'http://execute.php-einfach.de:9999/execute.php?'.$_SERVER['QUERY_STRING'];
$send_cookies = false;
$send_session = false;

$ch = curl_init( $url );
  
if (isset($_SERVER['REQUEST_METHOD']) && strtolower($_SERVER['REQUEST_METHOD']) == 'post' ) {
	curl_setopt( $ch, CURLOPT_POST, true );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $_POST );
}
  

if ( $send_cookies ) {
    $cookie = array();
    foreach ( $_COOKIE as $key => $value ) {
      $cookie[] = $key . '=' . $value;
    }
    if ( $send_session ) {
      $cookie[] = SID;
    }
    $cookie = implode( '; ', $cookie );
    
    curl_setopt( $ch, CURLOPT_COOKIE, $cookie );
}
  
curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
//   curl_setopt( $ch, CURLOPT_HEADER, true );
  
curl_setopt( $ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] );
  
$contents = curl_exec( $ch );
  
//   list( $header, $contents ) = preg_split( '/([\n][\n])\\1/', curl_exec( $ch ), 2 );
  
//   $status = curl_getinfo( $ch );
  
curl_close( $ch );

print($contents);
?>
