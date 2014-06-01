<?php 
date_default_timezone_set("Australia/Sydney");
class user
{
    var $ID;
	var $username;
    var $firstname;
    var $lastname;
    var $detection;
    var $selectedfriends;
    function user($row,$user)
    {
    	$this->ID = (int)$row["ID"];
        $this->username = $user;
        $this->firstname = $row["firstname"];
        $this->lastname = $row["lastname"];
        $this->detection = $row["detection"];
        $this->selectedfriends = $row["selectedfriends"];
    }
    
}
class response
{
	var $user;
    var $validated;
	function response($user,$val)
    {
		$this->user = $user;
        $this->validated = $val;
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
$user = $json -> username;
$pass = $json -> password;

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
	$port = "3306";
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
$success = false;
$sql = "
Select ID, firstname, lastname, detection, selectedfriends
From users
Where username = '$user' && password = '$pass';
";
$result = mysqli_query($link,$sql)  or die("Error: ".mysqli_error($link)) or $success = false;

$ruser;
while ($row = mysqli_fetch_array($result))
{
	$ruser = new user($row,$user);
    $success = true;
}
if($success){
    echo json_encode(new response($ruser,true));
}
else echo json_encode(false);
header('Content-type: application/json');
mysqli_close($link);
?>