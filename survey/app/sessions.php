<?php
  session_start();
  $data= array('one', 'two', 'three');
?>
<script type="text/javascript">
    var idr = '<?php echo session_id(); ?>';
    var datar = <?php echo json_encode($data); ?>;
    console.log(idr);
    console.log(datar);

    //3ov9q5albloeemg55s9uahsoc6
    //4okjmjjpdo3923aplovprvncgi


</script>

