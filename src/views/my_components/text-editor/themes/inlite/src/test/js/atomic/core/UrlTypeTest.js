test(
  'atomic.themes.core.UrlTypeTest',
  [
    'tinymce.themes.inlite.core.UrlType'
  ],
  function (UrlType) {
    var testIsDomainLike = function () {
      var mostUsedTopLevelDomains = [
        'com', 'org', 'edu', 'gov', 'uk', 'net', 'ca', 'de', 'jp',
        'fr', 'au', 'us', 'ru', 'ch', 'it', 'nl', 'se', 'no', 'es', 'mil'
      ];

      assert.eq(UrlType.isDomainLike('www.site.com'), true);
      assert.eq(UrlType.isDomainLike('www.site.xyz'), true);
      assert.eq(UrlType.isDomainLike('   www.site.xyz'), true);
      assert.eq(UrlType.isDomainLike('site.xyz'), false);

      mostUsedTopLevelDomains.forEach(function (tld) {
        assert.eq(UrlType.isDomainLike('site.' + tld), true);
        assert.eq(UrlType.isDomainLike('  site.' + tld), true);
        assert.eq(UrlType.isDomainLike('site.' + tld + '  '), true);
      });

      assert.eq(UrlType.isDomainLike('/a/b'), false);
    };

    var testIsAbsoluteUrl = function () {
      assert.eq(UrlType.isAbsolute('http://www.site.com'), true);
      assert.eq(UrlType.isAbsolute('https://www.site.com'), true);
      assert.eq(UrlType.isAbsolute('www.site.com'), false);
      assert.eq(UrlType.isAbsolute('file.gif'), false);
    };

    testIsDomainLike();
    testIsAbsoluteUrl();
  }
);
