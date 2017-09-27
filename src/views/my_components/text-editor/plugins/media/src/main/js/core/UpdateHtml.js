/**
 * UpdateHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.UpdateHtml',
  [
    'tinymce.core.html.Writer',
    'tinymce.core.html.SaxParser',
    'tinymce.core.html.Schema',
    'tinymce.core.dom.DOMUtils',
    'tinymce.plugins.media.core.Size'
  ],
  function (Writer, SaxParser, Schema, DOMUtils, Size) {
    var DOM = DOMUtils.DOM;

    var setAttributes = function (attrs, updatedAttrs) {
      var name;
      var i;
      var value;
      var attr;

      for (name in updatedAttrs) {
        value = "" + updatedAttrs[name];

        if (attrs.map[name]) {
          i = attrs.length;
          while (i--) {
            attr = attrs[i];

            if (attr.name === name) {
              if (value) {
                attrs.map[name] = value;
                attr.value = value;
              } else {
                delete attrs.map[name];
                attrs.splice(i, 1);
              }
            }
          }
        } else if (value) {
          attrs.push({
            name: name,
            value: value
          });

          attrs.map[name] = value;
        }
      }
    };

    var normalizeHtml = function (html) {
      var writer = new Writer();
      var parser = new SaxParser(writer);
      parser.parse(html);
      return writer.getContent();
    };

    var updateHtmlSax = function (html, data, updateAll) {
      var writer = new Writer();
      var sourceCount = 0;
      var hasImage;

      new SaxParser({
        validate: false,
        allow_conditional_comments: true,
        special: 'script,noscript',

        comment: function (text) {
          writer.comment(text);
        },

        cdata: function (text) {
          writer.cdata(text);
        },

        text: function (text, raw) {
          writer.text(text, raw);
        },

        start: function (name, attrs, empty) {
          switch (name) {
            case "video":
            case "object":
            case "embed":
            case "img":
            case "iframe":
              if (data.height !== undefined && data.width !== undefined) {
                setAttributes(attrs, {
                  width: data.width,
                  height: data.height
                });
              }
              break;
          }

          if (updateAll) {
            switch (name) {
              case "video":
                setAttributes(attrs, {
                  poster: data.poster,
                  src: ""
                });

                if (data.source2) {
                  setAttributes(attrs, {
                    src: ""
                  });
                }
                break;

              case "iframe":
                setAttributes(attrs, {
                  src: data.source1
                });
                break;

              case "source":
                sourceCount++;

                if (sourceCount <= 2) {
                  setAttributes(attrs, {
                    src: data["source" + sourceCount],
                    type: data["source" + sourceCount + "mime"]
                  });

                  if (!data["source" + sourceCount]) {
                    return;
                  }
                }
                break;

              case "img":
                if (!data.poster) {
                  return;
                }

                hasImage = true;
                break;
            }
          }

          writer.start(name, attrs, empty);
        },

        end: function (name) {
          if (name === "video" && updateAll) {
            for (var index = 1; index <= 2; index++) {
              if (data["source" + index]) {
                var attrs = [];
                attrs.map = {};

                if (sourceCount < index) {
                  setAttributes(attrs, {
                    src: data["source" + index],
                    type: data["source" + index + "mime"]
                  });

                  writer.start("source", attrs, true);
                }
              }
            }
          }

          if (data.poster && name === "object" && updateAll && !hasImage) {
            var imgAttrs = [];
            imgAttrs.map = {};

            setAttributes(imgAttrs, {
              src: data.poster,
              width: data.width,
              height: data.height
            });

            writer.start("img", imgAttrs, true);
          }

          writer.end(name);
        }
      }, new Schema({})).parse(html);

      return writer.getContent();
    };

    var isEphoxEmbed = function (html) {
      var fragment = DOM.createFragment(html);
      return DOM.getAttrib(fragment.firstChild, 'data-ephox-embed-iri') !== '';
    };

    var updateEphoxEmbed = function (html, data) {
      var fragment = DOM.createFragment(html);
      var div = fragment.firstChild;

      Size.setMaxWidth(div, data.width);
      Size.setMaxHeight(div, data.height);

      return normalizeHtml(div.outerHTML);
    };

    var updateHtml = function (html, data, updateAll) {
      return isEphoxEmbed(html) ? updateEphoxEmbed(html, data) : updateHtmlSax(html, data, updateAll);
    };

    return {
      updateHtml: updateHtml
    };
  }
);