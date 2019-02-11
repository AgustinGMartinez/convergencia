<?php

print_r(json_encode($_POST));

$name = $_POST['nombre'];

$file = '../../../img/clientes/'.$name;

if (file_exists($file)) {
    unlink($file);
    echo json_encode(array("status" => 200, "msg" => "ok"));
}