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
  'tinymce.plugins.link.api.Settings',
  [
  ],
  function () {
    var assumeExternalTargets = function (editorSettings) {
      return typeof editorSettings.link_assume_external_targets === 'boolean' ? editorSettings.link_assume_external_targets : false;
    };

    var hasContextToolbar = function (editorSettings) {
      return typeof editorSettings.link_context_toolbar === 'boolean' ? editorSettings.link_context_toolbar : false;
    };

    var getLinkList = function (editorSettings) {
      return editorSettings.link_list;
    };

    var hasDefaultLinkTarget = function (editorSettings) {
      return typeof editorSettings.default_link_target === 'string';
    };

    var getDefaultLinkTarget = function (editorSettings) {
      return editorSettings.default_link_target;
    };

    var getTargetList = function (editorSettings) {
      return editorSettings.target_list;
    };

    var setTargetList = function (editor, list) {
      editor.settings.target_list = list;
    };

    var shouldShowTargetList = function (editorSettings) {
      return getTargetList(editorSettings) !== false;
    };

    var getRelList = function (editorSettings) {
      return editorSettings.rel_list;
    };

    var hasRelList = function (editorSettings) {
      return getRelList(editorSettings) !== undefined;
    };

    var getLinkClassList = function (editorSettings) {
      return editorSettings.link_class_list;
    };

    var hasLinkClassList = function (editorSettings) {
      return getLinkClassList(editorSettings) !== undefined;
    };

    var shouldShowLinkTitle = function (editorSettings) {
      return editorSettings.link_title !== false;
    };

    var allowUnsafeLinkTarget = function (editorSettings) {
      return typeof editorSettings.allow_unsafe_link_target === 'boolean' ? editorSettings.allow_unsafe_link_target : false;
    };

    return {
      assumeExternalTargets: assumeExternalTargets,
      hasContextToolbar: hasContextToolbar,
      getLinkList: getLinkList,
      hasDefaultLinkTarget: hasDefaultLinkTarget,
      getDefaultLinkTarget: getDefaultLinkTarget,
      getTargetList: getTargetList,
      setTargetList: setTargetList,
      shouldShowTargetList: shouldShowTargetList,
      getRelList: getRelList,
      hasRelList: hasRelList,
      getLinkClassList: getLinkClassList,
      hasLinkClassList: hasLinkClassList,
      shouldShowLinkTitle: shouldShowLinkTitle,
      allowUnsafeLinkTarget: allowUnsafeLinkTarget
    };
  }
);
