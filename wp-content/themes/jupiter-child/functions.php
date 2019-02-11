<?php


// scripts and styles
wp_register_script('mainCanvas', get_stylesheet_directory_uri().'/js/canvas.js', array(), false, true);
wp_register_script('smoothScroll', get_stylesheet_directory_uri().'/js/smooth-scroll.js', array('jquery'), false, true);
wp_register_style('customCss', get_stylesheet_directory_uri().'/css/main.css');

wp_enqueue_script('mainCanvas');
wp_localize_script( 'mainCanvas', 'themeUri', array(get_stylesheet_directory_uri()) );
wp_enqueue_script('smoothScroll');
wp_enqueue_style('customCss');

// hooks
add_action('wp_footer', 'wsp_btn');
add_filter( 'mime_types', 'mi_nuevo_mime_type' );


// custom functions
function wsp_btn() {
  ?>
    <a target='_new' href='https://api.whatsapp.com/send?phone=541158260750' class='wsp-icon'></a>
  <?php
}
function mi_nuevo_mime_type( $existing_mimes ) {
	// añade webp a la lista de mime types
	$existing_mimes['webm'] = 'image/webp';
	// devuelve el array a la funcion con el nuevo mime type
	return $existing_mimes;
}

// function print_imagenes_de_clientes( $atts ){
//   $directorio = dirname(__DIR__, 3).'/img/clientes';
//   $ficheros1  = scandir($directorio);
//   // var_dump($ficheros1);
//   echo '<div class="marcas-de-clientes">';
//   foreach ($ficheros1 as $key => $name) {
//     if ($name === '.' || $name === '..') continue;
//     echo  '<div class="marca"><img src="'.home_url().'/img/clientes/'.$name.'" /></div>';
//   }
//   echo '</div>';
//   if (is_admin() || current_user_can('editor') || current_user_can('administrator')) {
//     echo '<input type="file" id="subirImagenCliente1"/><button id="subirImagenCliente2">Subir</button>';
//   }
// }

// add_shortcode( 'imagenes-clientes', 'print_imagenes_de_clientes' );


// // hook into admin-ajax
// // the text after 'wp_ajax_' and 'wp_ajax_no_priv_' in the add_action() calls
// // that follow is what you will use as the value of data.action in the ajax
// // call in your JS

// // if the ajax call will be made from JS executed when user is logged into WP,
// // then use this version
// add_action ('wp_ajax_subir_imagen_cliente', 'subir_imagen_cliente') ;
// // if the ajax call will be made from JS executed when no user is logged into WP,
// // then use this version
// // add_action ('wp_ajax_nopriv_call_your_function', 'your_function') ;

// function subir_imagen_cliente () {
//   die();

//   $target_dir = dirname(__DIR__, 3).'/img/clientes';
//   $target_file = $target_dir . basename($_FILES["image"]["name"]);
//   $uploadOk = 1;
//   $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
//   // Check if image file is a actual image or fake image
//   $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
//   if($check !== false) {
//       echo "File is an image - " . $check["mime"] . ".";
//       $uploadOk = 1;
//   } else {
//       echo "File is not an image.";
//       $uploadOk = 0;
//   }

//   // Check if file already exists
//   if (file_exists($target_file)) {
//       echo "Sorry, file already exists.";
//       $uploadOk = 0;
//   }

//   // Allow certain file formats
//   if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
//   && $imageFileType != "gif" ) {
//       echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
//       $uploadOk = 0;
//   }

//   // Check if $uploadOk is set to 0 by an error
//   if ($uploadOk == 0) {
//       echo "Sorry, your file was not uploaded.";
//   // if everything is ok, try to upload file
//   } else {
//       if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
//           wp_send_json_success() ;
//       } else {
//           echo "Sorry, there was an error uploading your file.";
//       }
//   }
// }