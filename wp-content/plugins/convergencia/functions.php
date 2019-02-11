<?php

function convergencia_init() {
    wp_enqueue_script( 'mainJS', plugins_url( '/js/main_agus.js', __FILE__ ));
    wp_localize_script('mainJS', 'ajax_object', array( 'ajax_url' => home_url() ) );
}

function print_imagenes_de_clientes($isAdmin = false) {
  $directorio = dirname(__DIR__, 3).'/img/clientes';
  $ficheros1  = scandir($directorio);
  // var_dump($ficheros1);
  echo '<div class="marcas-de-clientes">';
  foreach ($ficheros1 as $key => $name) {
    if ($name === '.' || $name === '..') continue;
    echo  '<div data-id="'.$name.'" class="marca"><img src="'.home_url().'/img/clientes/'.$name.'" />';
    if ($isAdmin) {
      echo '<button onclick="borrarImagen(\''.$name.'\')">Borrar</button>';
    }
    echo'</div>';
  }
  echo '</div>';
}


function subir_imagen_cliente () {

  $target_dir = dirname(__DIR__, 3).'/img/clientes';
  $target_file = $target_dir . basename($_FILES["image"]["name"]);
  $uploadOk = 1;
  $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
  // Check if image file is a actual image or fake image
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
      echo "File is an image - " . $check["mime"] . ".";
      $uploadOk = 1;
  } else {
      echo "File is not an image.";
      $uploadOk = 0;
  }

  // Check if file already exists
  if (file_exists($target_file)) {
      echo "Sorry, file already exists.";
      $uploadOk = 0;
  }

  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" ) {
      echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
      $uploadOk = 0;
  }

  // Check if $uploadOk is set to 0 by an error
  if ($uploadOk == 0) {
      echo "Sorry, your file was not uploaded.";
  // if everything is ok, try to upload file
  } else {
      if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
          wp_send_json_success() ;
      } else {
          echo "Sorry, there was an error uploading your file.";
      }
  }
}
 
function test_plugin_setup_menu(){
  add_menu_page( 'Subir Clientes', 'Subir Clientes', 'manage_options', 'subir-clientes', 'admin_page' );
}

function admin_page() {
  if (is_admin()):
    echo '<div><input type="file" id="subirImagenCliente1"/><button id="subirImagenCliente2">Subir</button></div>';
  endif;

  print_imagenes_de_clientes(true);
}