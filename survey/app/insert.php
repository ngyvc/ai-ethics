<?php
  session_start();

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  
  require_once "_includes/db_connect.php";

  // echo($_REQUEST["key"]."<br>");
  // echo($_REQUEST["value"]."<br>");

  
  //echo $sID;
/*
  * see if session_id exists
  if it does... update
  else insert
*/
//$results = [];
$insertedRows = 0;

//3 functions abstracted from main code
function sessionExists($db_connect){
  $sID = session_id();
  //need to pass db $db_connect to the function due to scope
  $query = "SELECT * FROM questionnaire WHERE sessionID = ?";
  if($stmt = mysqli_prepare($db_connect, $query)){

    mysqli_stmt_bind_param($stmt, "s", $sID);
    mysqli_stmt_execute($stmt);

    //get results
    $result = mysqli_stmt_get_result($stmt);
    //loop through
    while($row = mysqli_fetch_assoc($result)){
      //returning an array, although should only ever return 1
      $results[] = $row;
    }
  
    //encode & display json
    //return($results);\
    return mysqli_num_rows($result);
  
    //close the link to the db
    mysqli_close($db_connect);

  }else{
    throw new Exception("No session was found");
  }
};

//if record exists, then update
function updateData($db_connect){
  $key = $_REQUEST["key"];
  $value = $_REQUEST["value"];
  $sID = session_id();
  $query = "UPDATE questionnaire SET $key = ? WHERE sessionID = ?";

  if($stmt = mysqli_prepare($db_connect, $query)){
    mysqli_stmt_bind_param($stmt, "ss", $_REQUEST["value"], $sID);
    mysqli_stmt_execute($stmt);
    
    if (mysqli_stmt_affected_rows($stmt) <= 0) {
      throw new Exception("Error updating data: " . mysqli_stmt_error($stmt));
    }
    $results[] = ["updatedData() affected_rows man" => mysqli_stmt_affected_rows($stmt)];
    return mysqli_stmt_affected_rows($stmt);
  }
}

function insertData($db_connect){
  echo $_REQUEST["key"];
  $query = "INSERT INTO questionnaire (sessionID, ". $_REQUEST["key"]. ") VALUES (?, ?)";
  $sID = session_id();
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
    return $results;
  }

}


  //main logic of the application is in this try{} block of code.
  try{
    //see if session exists
      // -yes > update answers
      // -no insert new session
      // -or just check if answering q0 ?? 
      //$response = sessionExists($db_connect);
      //echo '<pre>'; print_r($response); echo '</pre>';
    if(sessionExists($db_connect)){
      //update
      $response[] = ["sessionExists" => "true"];
      $response[] = ["updatedRecords" => updateData($db_connect)];
      
    
    }else{
      //insert data
      $response[] = ["sessionExists"=>"false"];
      $response[] = ["insertedData" => insertData($db_connect)];

    }
      
  }catch(Exception $error){
    //add to results array rather than echoing out errors
    $response[] = ["error"=>$error->getMessage()];
  }finally{
    //echo out results
    echo json_encode($response);
  }
//4okjmjjpdo3923aplovprvncgi
//https://gamelab514.com/aiEthics/survey/app/insert.php?sessionID=4okjmjjpdo3923aplovprvncgi&q0=2&q1=3
//https://gamelab514.com/aiEthics/survey/app/insert.php?key=q0&value=6
?>