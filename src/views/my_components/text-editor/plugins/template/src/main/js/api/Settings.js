/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.api.Settings',
  [
    'tinymce.core.dom.DOMUtils'
  ],
  function (DOMUtils) {
    var getCreationDateClasses = function (editor) {
      return editor.getParam('template_cdate_classes', 'cdate');
    };

    var getModificationDateClasses = function (editor) {
      return editor.getParam('template_mdate_classes', 'mdate');
    };

    var getSelectedContentClasses = function (editor) {
      return editor.getParam('template_selected_content_classes', 'selcontent');
    };

    var getPreviewReplaceValues = function (editor) {
      return editor.getParam('template_preview_replace_values');
    };

    var getTemplateReplaceValues = function (editor) {
      return editor.getParam('template_replace_values');
    };

    var getTemplates = function (editorSettings) {
      return editorSettings.templates;
    };

    var getCdateFormat = function (editor) {
      return editor.getParam('template_cdate_format', editor.getLang('template.cdate_format'));
    };

    var getMdateFormat = function (editor) {
      return editor.getParam("template_mdate_format", editor.getLang("template.mdate_format"));
    };

    var getDialogWidth = function (editor) {
      return editor.getParam('template_popup_width', 600);
    };

    var getDialogHeight = function (editor) {
      return Math.min(DOMUtils.DOM.getViewPort().h, editor.getParam('template_popup_height', 500));
    };

    return {
      getCreationDateClasses: getCreationDateClasses,
      getModificationDateClasses: getModificationDateClasses,
      getSelectedContentClasses: getSelectedContentClasses,
      getPreviewReplaceValues: getPreviewReplaceValues,
      getTemplateReplaceValues: getTemplateReplaceValues,
      getTemplates: getTemplates,
      getCdateFormat: getCdateFormat,
      getMdateFormat: getMdateFormat,
      getDialogWidth: getDialogWidth,
      getDialogHeight: getDialogHeight
    };
  }
);

