<?php
  session_start();

  // ini_set('display_errors', 1);
  // ini_set('display_startup_errors', 1);
  // error_reporting(E_ALL);
  
  require_once "_includes/db_connect.php";

  // echo($_REQUEST["key"]."<br>");
  // echo($_REQUEST["value"]."<br>");

  $sID = session_id();
  // echo $sID;
/*
  * see if session_id exists
  if it does... update
  else insert
*/





/* or insert */

$query = "INSERT INTO questionnaire (sessionID, ".$_REQUEST["key"].") VALUES (?, ?)";
if($stmt = mysqli_prepare($db_connect, $query)){
  mysqli_stmt_bind_param($stmt, 'ss', $sID, $_REQUEST["value"]);
  mysqli_stmt_execute($stmt);
  $insertedRows = mysqli_stmt_affected_rows($stmt);
  
  if($insertedRows > 0){
    $results[] = [
      "insertedRows"=>$insertedRows,
      "id" => $db_connect->insert_id,
      "sessionID" => session_id(),
      "key" => $_REQUEST["key"],
      "value" => $_REQUEST["value"]
    ];
  }
  echo json_encode($results);
}

//4okjmjjpdo3923aplovprvncgi
//https://gamelab514.com/aiEthics/survey/app/insert.php?sessionID=4okjmjjpdo3923aplovprvncgi&q0=2&q1=3
//https://gamelab514.com/aiEthics/survey/app/insert.php?key=q0&value=6



?>