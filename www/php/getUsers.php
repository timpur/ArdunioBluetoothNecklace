<?php 
date_default_timezone_set("Australia/Sydney");
class user
{
    var $ID;
    var $firstname;
    var $lastname;
    function user($row)
    {
    	$this->ID = (int)$row["ID"];
        $this->firstname = $row["firstname"];
        $this->lastname = $row["lastname"];
    }
    
}
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

$db = "";
$u = "";
$p = "";
$url = "";
$port = "";
$server = false;
if($server){
	$db = "";
	$u = "";
	$p = "";
	$url = "";
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
Select ID, firstname, lastname
From users;
";
$result = mysqli_query($link,$sql)  or die("Error: ".mysqli_error($link)) or $success = false;

$users = array();
$i = 0;
while ($row = mysqli_fetch_array($result))
{
	$users[$i] = new user($row);
    $i += 1;
}
if($success){
    echo json_encode($users);
}
else echo json_encode(false);
header('Content-type: application/json');
mysqli_close($link);
?>