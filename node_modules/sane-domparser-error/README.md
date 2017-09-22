# sane-domparser-error

<a href="https://www.npmjs.org/package/sane-domparser-error">
    <img src="https://badge.fury.io/js/sane-domparser-error.svg"
        align="right" alt="NPM version" height="18">
</a>

Provides sane and machine readable parser errors for DOMParser and XHR (with `XMLHttpRequest.responseType = 'document'`).

## Why?

DOMParser and XHR currently do not throw an exception if a document could not be parsed, but [instead return](http://stackoverflow.com/questions/11563554/how-do-i-detect-xml-parsing-errors-when-using-javascripts-domparser-in-a-cross) an [error document](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#Error_handling).

Instead of

```xml
<parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">
  XML Parsing Error: prefix not bound to a namespace\n Location: file:////tmp/index.html
  Line Number 1, Column 57:
  <sourcetext>
    &lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;&lt;head/&gt;&lt;body&gt;&lt;namespace:customtag&gt;&lt;!-- namespace:customtag--&gt;&lt;/namespace:customtag&gt;&lt;/body&gt;&lt;/html&gt;
    --------------------------------------------------------^
  </sourcetext>
</parsererror>
```

you'll receive

```js
new Error('XML Parsing Error: prefix not bound to a namespace');
```

## Develop

    $ npm run-script watchify
    $ xdg-open test/test.html

or just

    $ npm test
