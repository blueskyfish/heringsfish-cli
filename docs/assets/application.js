/*!
 * heringsfish-cli - https://github.com/blueskyfish/heringsfish-cli.git
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 BlueSkyFish
 */

(function (window, $) {

  'use strict';

  $(function () {
    var url = window.location.href;
    $('nav .menu-item').each(function () {
      var item = $(this);
      var link = item.attr('data-link');
      if (url.endsWith(link)) {
        item.addClass('active');
      }
    });
  });

} (window, jQuery));
