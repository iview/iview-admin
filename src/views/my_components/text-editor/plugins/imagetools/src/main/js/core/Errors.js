define(
  'tinymce.plugins.imagetools.core.Errors',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'tinymce.core.util.Promise',
    'tinymce.plugins.imagetools.core.Utils'
  ],

  function (Arr, Fun, Promise, Utils) {
    var friendlyHttpErrors = [
      { code: 404, message: 'Could not find Image Proxy' },
      { code: 403, message: 'Rejected request' },
      { code: 0, message: 'Incorrect Image Proxy URL' }
    ];
    var friendlyServiceErrors = [
      { type: 'key_missing', message: 'The request did not include an api key.' },
      { type: 'key_not_found', message: 'The provided api key could not be found.' },
      { type: 'domain_not_trusted', message: 'The api key is not valid for the request origins.' }
    ];

    var isServiceErrorCode = function (code) {
      return code === 400 || code === 403 || code === 500;
    };

    var getHttpErrorMsg = function (status) {
      var message = Arr.find(friendlyHttpErrors, function (error) {
        return status === error.code;
      }).fold(
        Fun.constant('Unknown ImageProxy error'),
        function (error) {
          return error.message;
        }
      );

      return "ImageProxy HTTP error: " + message;
    };

    var handleHttpError = function (status) {
      var message = getHttpErrorMsg(status);

      return Promise.reject(message);
    };

    var getServiceErrorMsg = function (type) {
      return Arr.find(friendlyServiceErrors, function (error) {
        return error.type === type;
      }).fold(
        Fun.constant('Unknown service error'),
        function (error) {
          return error.message;
        }
      );
    };

    var getServiceError = function (text) {
      var serviceError = Utils.parseJson(text);
      var errorType = Utils.traverse(serviceError, ['error', 'type']);
      var errorMsg = errorType ? getServiceErrorMsg(errorType) : 'Invalid JSON in service error message';

      return "ImageProxy Service error: " + errorMsg;
    };

    var handleServiceError = function (status, blob) {
      return Utils.readBlob(blob).then(function (text) {
        var serviceError = getServiceError(text);

        return Promise.reject(serviceError);
      });
    };

    var handleServiceErrorResponse = function (status, blob) {
      return isServiceErrorCode(status) ? handleServiceError(status, blob) : handleHttpError(status);
    };

    return {
      handleServiceErrorResponse: handleServiceErrorResponse,
      handleHttpError: handleHttpError,
      getHttpErrorMsg: getHttpErrorMsg,
      getServiceErrorMsg: getServiceErrorMsg
    };
  }
);
