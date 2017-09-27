test(
  'tinymce.plugins.paste.browser.NewlinesTest', [
    'ephox.agar.api.Assertions',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Arr',
    'tinymce.themes.modern.Theme',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.paste.core.Newlines'
  ],
  function (Assertions, Obj, Arr, Theme, PastePlugin, Newlines) {

    Theme();
    PastePlugin();

    // testing Newlines.isPlainText()
    var textCases = [
      {
        label: "Basic Chrome markup (including span-wrapped tab)",
        content: '<div><span style="white-space:pre">  </span>a</div><div><br></div><div>b</div>',
        isText: true
      },
      {
        label: "Case shouldn't matter",
        content: '<DIV>a</DIV><DIV><BR></DIV>',
        isText: true
      },
      {
        label: "Support all BR types",
        content: '<br><br />',
        isText: true
      },
      {
        label: "Basic IE markup",
        content: '<p>a</p><p><br></p><p>b</p>',
        isText: true
      },
      {
        label: "White-space wrapper (Chrome)",
        content: '<div><span style="white-space: pre;"> </span>a</div>',
        isText: true
      },
      {
        label: "White-space wrapper (Chrome) with additional styles",
        content: '<div><span style="white-space: pre; color: red;"> </span>a</div>',
        isText: false
      },
      {
        label: "Allowed tag but with attributes qualifies string as not a plain text",
        content: '<br data-mce-bogus="all" />',
        isText: false
      }
    ];

    // only DIV,P,BR and SPAN[style="white-space:pre"] tags are allowed in "plain text" string
    Arr.each('a,abbr,address,article,aside,audio,b,bdi,bdo,blockquote,button,cite,code,del,details,dfn,dl,em,embed,fieldset,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,ins,label,menu,nav,noscript,object,ol,pre,q,s,script,section,select,small,strong,style,sub,sup,svg,table,textarea,time,u,ul,var,video,wbr'.split(','),
      function (tag) {
        var content = '<p>a</p><' + tag + '>b</' + tag + '><p>c<br>d</p>';
        textCases.push({
          label: tag.toUpperCase() + ' tag should qualify content (' + content + ') as not a plain text',
          content: content,
          isText: false
        });
      }
    );

    Obj.each(textCases, function (c) {
      Assertions.assertEq(c.label || "Asserting: " + c.content, c.isText, Newlines.isPlainText(c.content));
    });
  }
);