<?php
/*
Plugin Name: Convergencia
*/

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

// wp_register_script('mainJS', __DIR__.'/js/main_agus.js', array('jquery'), false, true);
// wp_enqueue_script('mainJS');


add_shortcode( 'imagenes-clientes', 'print_imagenes_de_clientes' );


// hook into admin-ajax
// the text after 'wp_ajax_' and 'wp_ajax_no_priv_' in the add_action() calls
// that follow is what you will use as the value of data.action in the ajax
// call in your JS

// if the ajax call will be made from JS executed when user is logged into WP,
// then use this version
// if the ajax call will be made from JS executed when no user is logged into WP,
// then use this version
// add_action ('wp_ajax_nopriv_call_your_function', 'your_function') ;


include('functions.php');
add_action('admin_enqueue_scripts','convergencia_init');
add_action('admin_menu', 'test_plugin_setup_menu');
add_action ('wp_ajax_nopriv_subir_imagen_cliente', 'subir_imagen_cliente') ;