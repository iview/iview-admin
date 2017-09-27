test(
  'atomic.themes.alien.UuidTest',
  [
    'tinymce.themes.inlite.alien.Uuid'
  ],
  function (Uuid) {
    var testUuid = function () {
      assert.eq(Uuid.uuid('mce').indexOf('mce'), 0);
      assert.eq(Uuid.uuid('mce') !== Uuid.uuid('mce'), true);
    };

    testUuid();
  }
);
