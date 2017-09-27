test(
  'atomic.tinymce.plugins.imagetools.ErrorsTest',

  [
    'ephox.agar.api.RawAssertions',
    'tinymce.plugins.imagetools.core.Errors'
  ],

  function (RawAssertions, Errors) {
    var testHttpErrors = function () {
      RawAssertions.assertEq('404', 'ImageProxy HTTP error: Could not find Image Proxy', Errors.getHttpErrorMsg(404));
      RawAssertions.assertEq('403', 'ImageProxy HTTP error: Rejected request', Errors.getHttpErrorMsg(403));
      RawAssertions.assertEq('0', 'ImageProxy HTTP error: Incorrect Image Proxy URL', Errors.getHttpErrorMsg(0));
    };

    var testServiceErrors = function () {
      RawAssertions.assertEq('key missing', 'The request did not include an api key.', Errors.getServiceErrorMsg('key_missing'));
      RawAssertions.assertEq('key not found', 'The provided api key could not be found.', Errors.getServiceErrorMsg('key_not_found'));
      RawAssertions.assertEq('key not found', 'The api key is not valid for the request origins.', Errors.getServiceErrorMsg('domain_not_trusted'));
    };

    testHttpErrors();
    testServiceErrors();
  }
);
