<?php
  session_start();

  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  
  require_once "_includes/db_connect.php";

  // echo($_REQUEST["key"]."<br>");
  // echo($_REQUEST["value"]."<br>");

  $sID = session_id();
  //echo $sID;
/*
  * see if session_id exists
  if it does... update
  else insert
*/
$results = [];
$insertedRows = 0;

//3 functions abstracted from main code
function sessionExists($db_connect){
  //need to pass db $db_connect to the function due to scope
  $query = "SELECT * FROM questionnaire";

  if($stmt = mysqli_prepare($db_connect, $query)){
    //mysqli_stmt_bind_param($stmt, "s", $sID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    echo mysqli_num_rows($result);
    $results[] = ["mysqli_num_rows" => mysqli_num_rows($result)];
     //should only be 1 record... but I'm lazy so still "looping"
    while($row = mysqli_fetch_assoc($result)){
      $results[] = $row;
     // echo $row;
    }
    return $results;
    //return mysqli_num_rows($result) > 0;

  }else{
    throw new Exception("No session was found");
  }
}

function updateData($db_connect){
  $query = "UPDATE demo SET tvshow = ? WHERE email = ?";

  if($stmt = mysqli_prepare($db_connect, $query)){
    mysqli_stmt_bind_param($stmt, "ss", $_REQUEST["tvshow"], $_REQUEST["email"]);
    mysqli_stmt_execute($stmt);
    
    if (mysqli_stmt_affected_rows($stmt) <= 0) {
      throw new Exception("Error updating data: " . mysqli_stmt_error($stmt));
    }
    $results[] = ["updatedData() affected_rows man" => mysqli_stmt_affected_rows($stmt)];
    return mysqli_stmt_affected_rows($stmt);
  }
}

function insertData($db_connect){
  $query = "INSERT INTO demo (name, email, tvshow) VALUES (?, ?, ?)";

  if($stmt = mysqli_prepare($db_connect, $query)){
    mysqli_stmt_bind_param($stmt, "sss", $_REQUEST["full_name"], $_REQUEST["email"], $_REQUEST["tvshow"]);
    mysqli_stmt_execute($stmt);
    $insertedRows = mysqli_stmt_affected_rows($stmt);

    if($insertedRows > 0){
      $results[] = [
        "insertedRows"=>$insertedRows,
        "id" => $db_connect->insert_id,
        "full_name" => $_REQUEST["full_name"],
        "tvshow" => $_REQUEST["tvshow"]
      ];
    }else{
      throw new Exception("No rows were inserted");
    }
    //removed the echo from here
    //echo json_encode($results);
  }
}

//main logic of the application is in this try{} block of code.
try{
  //see if user has entered data
  if(!isset($_REQUEST["key"]) || !isset($_REQUEST["value"])){
    throw new Exception('Required data is missing i.e. key, value');
  }else{
    //get userID from $_SESSION
    //$userID = $_SESSION['userID'];
    //first see if movieTitle is already in the db.
    if(!sessionExists($db_connect)){
      $results[] = ["sessionExists()" => false];
     // then insert new movie & favourite. See if genre exists
     // or do this all in the front end!!
    }else{
      $results[] = ["sessionExists()" => true];

      //if user does not exist, insert the data
      //$results[] = ["insertData()" => "called insertData()"];
      //$results[] = ["insertData() affected_rows" => insertData($db_connect)];
    }
  }
    
}catch(Exception $error){
  //add to results array rather than echoing out errors
  $results[] = ["error"=>$error->getMessage()];
}finally{
  //echo out results
  echo json_encode($results);
}

//4okjmjjpdo3923aplovprvncgi
//https://gamelab514.com/aiEthics/survey/app/insert.php?sessionID=4okjmjjpdo3923aplovprvncgi&q0=2&q1=3
//https://gamelab514.com/aiEthics/survey/app/insert.php?key=q0&value=6



?>