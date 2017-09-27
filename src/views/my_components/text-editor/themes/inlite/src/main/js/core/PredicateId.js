/**
 * PredicateId.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.core.PredicateId',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var create = function (id, predicate) {
      return {
        id: id,
        predicate: predicate
      };
    };

    // fromContextToolbars :: [ContextToolbar] -> [PredicateId]
    var fromContextToolbars = function (toolbars) {
      return Tools.map(toolbars, function (toolbar) {
        return create(toolbar.id, toolbar.predicate);
      });
    };

    return {
      create: create,
      fromContextToolbars: fromContextToolbars
    };
  }
);
