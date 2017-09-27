test(
  'atomic.tinymce.plugins.visualchars.NodesTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.sugar.api.node.Element',
    'global!document',
    'tinymce.plugins.visualchars.core.Nodes'
  ],
  function (Assertions, Element, document, Nodes) {
    var nbsp = '\u00a0';
    var shy = '\u00AD';

    var testReplaceWithSpans = function () {
      Assertions.assertHtml(
        'should return span around shy and nbsp',
        'a<span data-mce-bogus="1" class="mce-nbsp">\u00a0</span>b<span data-mce-bogus="1" class="mce-shy">\u00AD</span>',
        Nodes.replaceWithSpans('a' + nbsp + 'b' + shy)
      );
    };

    var testFilterDescendants = function () {
      var div = document.createElement('div');
      div.innerHTML = '<p>a</p>' +
                      '<p>b' + nbsp + '</p>' +
                      '<p>c</p>' +
                      '<p>d' + shy + '</p>';

      Assertions.assertEq(
        'should return list with nodes with shy or nbsp in it',
        2,
        Nodes.filterDescendants(Element.fromDom(div), Nodes.isMatch).length
      );
    };

    var testFilterDescendants2 = function () {
      var div = document.createElement('div');
      div.innerHTML = '<p>a' + nbsp + '</p>' +
                      '<p>b' + nbsp + '</p>' +
                      '<p>c' + nbsp + '</p>' +
                      '<p>d' + shy + '</p>';

      Assertions.assertEq(
        'should return list with nodes with shy or nbsp in it',
        4,
        Nodes.filterDescendants(Element.fromDom(div), Nodes.isMatch).length
      );
    };

    testReplaceWithSpans();
    testFilterDescendants();
    testFilterDescendants2();
  }
);
