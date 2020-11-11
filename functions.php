<?php
require get_theme_file_path('/includes/search-route.php');
require get_theme_file_path('/includes/like-route.php');

function university_files() {
  wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

  wp_enqueue_script('google-maps', '//maps.googleapis.com/maps/api/js?key=null', null, '1.0', true);

  if(strstr($_SERVER['SERVER_NAME'], 'fictionaluniversity.local')) {
    wp_enqueue_script('main-university-js', 'http://localhost:3000/bundled.js', null, '1.0', true);
  } else {
    wp_enqueue_script('our-vendors-js', get_theme_file_uri('/bundled-assets/vendors~scripts.8c97d901916ad616a264.js'), null, '1.0', true);
    wp_enqueue_script('main-university-js', get_theme_file_uri('/bundled-assets/scripts.361ae884830d52b8ba98.js'), null, '1.0', true);
    wp_enqueue_style('our-main-styles', get_theme_file_uri('/bundled-assets/styles.361ae884830d52b8ba98.css'));
  }
  
  wp_localize_script('main-university-js', 'universityData', [
    'root_url' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest')
  ]);
}

function university_features() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_image_size('professorLandscape', 400, 260, true);
  add_image_size('professorPortrait', 480, 650, true);
  add_image_size('pageBanner', 1500, 350, true);
}


function university_adjust_queries($query) {
  $today = date('Ymd');
  if (!is_admin() && is_post_type_archive('event') && $query->is_main_query()) {
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', [
      [
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      ]
    ]);
  }

  if (!is_admin() && is_post_type_archive('program') && $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }

  if (!is_admin() && is_post_type_archive('campus') && $query->is_main_query()) {
    $query->set('posts_per_page', -1);
  }
}

function pageBanner($config = []) {
  //php logic here
  if (!array_key_exists('title', $config)) {
    $config['title'] =  get_the_title();
  }

  if (!array_key_exists('subtitle', $config)) {
    $config['subtitle'] = get_field('page_banner_subtitle');
  }

  if (!array_key_exists('image', $config)) {
    if (get_field('page_banner_background_image') && !is_archive() && !is_home() ) {
      $config['image'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
    } else {
      $config['image'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }

  ?> 
    <div class="page-banner">
      <div class="page-banner__bg-image" 
          style="background-image: url(<?php echo $config['image']; ?>);">
      </div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $config['title']; ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $config['subtitle'] ?></p>
        </div> 
      </div>  
    </div>
  <?php
}

function university_custom_rest() {
  register_rest_field('post', 'authorName', [
    'get_callback' => function() { return get_the_author();}
  ]);

  register_rest_field('note', 'userNoteCount', [
    'get_callback' => function() { return count_user_posts(get_current_user_id(), 'note');}
  ]);
}

// redirect out of admin and onto homepage
function redirectSubsToFrontend() {
  $ourCurrentUser = wp_get_current_user();

  if (count($ourCurrentUser->roles) === 1 && $ourCurrentUser->roles[0] === 'subscriber') {
    wp_redirect(site_url('/'));
    exit;
  }
}

function noSubsAdminBar() {
   $ourCurrentUser = wp_get_current_user();

  if (count($ourCurrentUser->roles) === 1 && $ourCurrentUser->roles[0] === 'subscriber') {
    show_admin_bar(false);
  }
}

//customize login screen
function ourHeaderUrl() {
  return esc_url(site_url('/'));
}

function ourLoginCSS() {
  wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('our-main-styles', get_theme_file_uri('/bundled-assets/styles.361ae884830d52b8ba98.css'));
}

function ourLoginTitle() {
  return get_bloginfo('name');
}

//force note posts to be private
function makeNotePrivate($data, $postarr) {
  if($data['post_type'] === 'note') {
    if (count_user_posts(get_current_user_id(), 'note') > 4 && !$postarr['ID'])  {
      die('You have reached your note limit');
    }

    $data['post_title'] = sanitize_text_field($data['post_title']);
    $data['post_content'] = sanitize_textarea_field($data['post_content']);
  }

  if($data['post_type'] === 'note' && $data['post_status'] !== 'trash') {
    $data['post_status'] = 'private';
  }
  
  return $data;
}

add_filter('wp_insert_post_data', 'makeNotePrivate', 10, 2);
add_filter('login_headertitle', 'ourLoginTitle');
add_action('login_enqueue_scripts', 'ourLoginCSS' );
add_filter('login_headerurl', 'ourHeaderUrl');
add_action('admin_init', 'redirectSubsToFrontend');
add_action('wp_loaded', 'noSubsAdminBar');
add_action('wp_enqueue_scripts', 'university_files');
add_action('after_setup_theme', 'university_features');
add_action('pre_get_posts', 'university_adjust_queries');
add_action('rest_api_init', 'university_custom_rest');

