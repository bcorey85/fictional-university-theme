<?php
  $theParent = wp_get_post_parent_id(get_the_ID());
  get_header();

  while(have_posts()) {
    the_post(); 
    pageBanner();
    ?>

    <div class="container container--narrow page-section">
      <?php if( $theParent ) { ?>
        <div class="metabox metabox--position-up metabox--with-home-link">
          <p>
            <a class="metabox__blog-home-link" href="<?php echo get_permalink($theParent) ?>">
              <i class="fa fa-home" aria-hidden="true"></i> 
              Back to <?php echo get_the_title($theParent) ?>
            </a> 
            <span class="metabox__main"><?php the_title(); ?></span>
          </p>
        </div>
      <?php } ?>
      <?php 
        $testArray = get_pages([
          'child_of' => get_the_ID()
        ]);
      if ($theParent || $testArray) { ?>
        <div class="page-links">
          <h2 class="page-links__title"><a href="<?php echo get_permalink($theParent); ?>"><?php echo get_the_title($theParent); ?></a></h2>
          <ul class="min-list">
            <?php
              // if theres a parent id, find children of parent
              // if no parent id, find children of current id
              if ($theParent) {
                $findChildrenOf = $theParent;
              } else {
                $findChildrenOf = get_the_ID();
              }

              $pageArray = [
                'title_li' => null,
                'child_of' => $findChildrenOf,
                'sort_column' => 'menu_order'
              ];

              wp_list_pages($pageArray);
            ?>
          </ul>
        </div>
      <?php } ?>

      <div class="generic-content">
       <?php get_search_form(); ?>
      </div>

    </div>
  <?php }

  get_footer();

?>