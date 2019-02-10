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
