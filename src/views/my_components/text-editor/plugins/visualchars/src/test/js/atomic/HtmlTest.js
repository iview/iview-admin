test(
  'atomic.tinymce.plugins.visualchars.HtmlTest',
  [
    'ephox.agar.api.RawAssertions',
    'tinymce.plugins.visualchars.core.Html'
  ],
    function (RawAssertions, Html) {
      var nbsp = '\u00a0';
      var shy = '\u00AD';

      RawAssertions.assertEq(
        'should return correct span',
        '<span data-mce-bogus="1" class="mce-nbsp">' + nbsp + '</span>',
        Html.wrapCharWithSpan(nbsp)
      );

      RawAssertions.assertEq(
        'should return correct span',
        '<span data-mce-bogus="1" class="mce-shy">' + shy + '</span>',
        Html.wrapCharWithSpan(shy)
      );
    }
);
