<?php 
date_default_timezone_set("Australia/Sydney");

function free($link)
{
	while(mysqli_more_results($link) && mysqli_next_result($link)) {
        $dummyResult = mysqli_use_result($link);
        if($dummyResult instanceof mysqli_result) {
            mysqli_free_result($link);
        }
    }
}
$json = json_decode(file_get_contents('php://input'));
$ID = $json -> ID;
$lat = $json -> lat;
$lng = $json -> lng;

$db = "";
$u = "";
$p = "";
$url = "";
$port = "";
$server = true;
if($server){
	$db = "a6773863_abn";
	$u = "a6773863_root";
	$p = "abn000";
	$url = "mysql12.000webhost.com";
	$port = "";
}else{
	$db="ABN";
	$u = "root";
	$p = "usbw";
	$url = "127.0.0.1";
	$port = "3307";
}

$link = mysqli_connect($url,$u,$p,$db,$port);
if (!$link) {
    die('Could not connect: ' . mysqli_error($link));
}
$success = true;
$sql = "
Insert Into location (userID, lat, lng)
Values ('$ID', '$lat', '$lng')
ON DUPLICATE KEY UPDATE
  lat     = VALUES(lat),
  lng = VALUES(lng);
";
$result = mysqli_query($link,$sql)  or die("Error: ".mysqli_error($link)) or $success = false;

if($success){
    echo json_encode(true);
}
else echo json_encode(false);
header('Content-type: application/json');
mysqli_close($link);
?>