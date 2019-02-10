<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

define( 'WP_MEMORY_LIMIT', '96M' );

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'convergencia');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'wWA=-`7EM<@#Zr7jJ]6Z{fP)[LSFw1Nj.6v#_xo-as;>[N/4vGjVOfiKxI]T O.X');
define('SECURE_AUTH_KEY',  'Jjwn[n $pT+tAw&$e?UHh-]Hbj/<GTy7?ZG$J|[g_4c> G M&8%q9h10,7=t)V:u');
define('LOGGED_IN_KEY',    '{>l_)O96OdYQ3}N=Q56/?/SpLaNYol{CJ!bs8@<C3HTit8-&,ec0iHgW.fc1gu*C');
define('NONCE_KEY',        't7oXxDXJkk%mGrH8|vO @<>v}o$4gD&>P l1[<B}J0{-r(-F~-I]K|G$+3oweD#a');
define('AUTH_SALT',        'C?0aiTqbf#N|(4F>so!^qh+t-zu@?*]`,yiD}~A1b-WG>:fgk~3v-OT3#KFl3bz7');
define('SECURE_AUTH_SALT', 'xW@_n4@L-Ofn=[/?dC- SGqSB.m^Nh+SW5)x_e4P/U_xR})C}`LyiL5}>H<cs;@`');
define('LOGGED_IN_SALT',   'qc1{Ein.ME4EqLn%5O2t4O/8it4&fnfuOz9htWuzR:h$3U^PZ`qmj4kv0ZqexVH>');
define('NONCE_SALT',       'S%%_`F,8;w8Px-u;Eho(JI:<Fen}JoQQP.9JhG2/v_v]C)fj3GK8qAb1F1gE]0+`');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
