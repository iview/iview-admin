define(
  'tinymce.plugins.paste.test.MockDataTransfer',
  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj'
  ],
  function (Arr, Obj) {
    var notImplemented = function () {
      throw new Error('Mockup function is not implemented.');
    };

    var createDataTransferItem = function (mime, content) {
      return {
        kind: 'string',
        type: mime,
        getAsFile: notImplemented,
        getAsString: function () {
          return content;
        }
      };
    };

    var create = function (inputData) {
      var data = {}, result;

      var clearData = function () {
        data = {};
        result.items = [];
        result.types = [];
      };

      var getData = function (mime) {
        return mime in data ? data[mime] : '';
      };

      var setData = function (mime, content) {
        data[mime] = content;
        result.types = Obj.keys(data);
        result.items = Arr.map(result.types, function (type) {
          return createDataTransferItem(type, data[type]);
        });
      };

      result = {
        dropEffect: '',
        effectAllowed: 'all',
        files: [],
        items: [],
        types: [],
        clearData: clearData,
        getData: getData,
        setData: setData,
        setDragImage: notImplemented,
        addElement: notImplemented
      };

      Obj.each(inputData, function (value, key) {
        setData(key, value);
      });

      return result;
    };

    return {
      create: create
    };
  }
);
