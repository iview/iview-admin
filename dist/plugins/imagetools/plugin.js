(function () {

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
var register_3795 = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
    target = target[fragments[i]];
  }
  target[fragments[fragments.length - 1]] = module;
};

var instantiate = function (id) {
  var actual = defs[id];
  var dependencies = actual.deps;
  var definition = actual.defn;
  var len = dependencies.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances[i] = dem(dependencies[i]);
  var defResult = definition.apply(null, instances);
  if (defResult === undefined)
     throw 'module [' + id + '] returned undefined';
  actual.instance = defResult;
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var len = ids.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
};

var ephox = {};

ephox.bolt = {
  module: {
    api: {
      define: def,
      require: req,
      demand: dem
    }
  }
};

var define = def;
var require = req;
var demand = dem;
// this helps with minificiation when using a lot of global references
var defineGlobal = function (id, ref) {
  define(id, [], function () { return ref; });
};
/*jsc
["tinymce.plugins.imagetools.Plugin","ephox.imagetools.api.BlobConversions","ephox.imagetools.api.ImageTransformations","tinymce.core.Env","tinymce.core.PluginManager","tinymce.core.util.Delay","tinymce.core.util.Promise","tinymce.core.util.Tools","tinymce.core.util.URI","tinymce.plugins.imagetools.core.ImageSize","tinymce.plugins.imagetools.core.Proxy","tinymce.plugins.imagetools.ui.Dialog","ephox.imagetools.util.Conversions","ephox.imagetools.util.ImageResult","ephox.imagetools.transformations.Filters","ephox.imagetools.transformations.ImageTools","global!tinymce.util.Tools.resolve","tinymce.plugins.imagetools.core.Errors","tinymce.plugins.imagetools.core.Utils","global!Math","tinymce.core.dom.DOMUtils","tinymce.core.ui.Factory","tinymce.plugins.imagetools.core.UndoStack","tinymce.plugins.imagetools.ui.ImagePanel","ephox.imagetools.util.Promise","ephox.imagetools.util.Canvas","ephox.imagetools.util.Mime","ephox.imagetools.util.ImageSize","ephox.imagetools.transformations.ColorMatrix","ephox.imagetools.transformations.ImageResizerCanvas","ephox.katamari.api.Arr","ephox.katamari.api.Fun","tinymce.core.geom.Rect","tinymce.plugins.imagetools.ui.CropRect","ephox.katamari.api.Option","global!Array","global!Error","global!String","tinymce.core.dom.DomQuery","tinymce.core.util.Observable","tinymce.core.util.VK","global!Object"]
jsc*/
/* eslint-disable */
/* jshint ignore:start */

/**
 * Modifed to be a feature fill and wrapped as tinymce module.
 *
 * Promise polyfill under MIT license: https://github.com/taylorhakes/promise-polyfill
 */
define(
  'ephox.imagetools.util.Promise',
  [
  ],
  function () {
    if (window.Promise) {
      return window.Promise;
    }

    // Use polyfill for setImmediate for performance gains
    var asap = Promise.immediateFn || (typeof setImmediate === 'function' && setImmediate) ||
      function (fn) { setTimeout(fn, 1); };

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }

    var isArray = Array.isArray || function (value) { return Object.prototype.toString.call(value) === "[object Array]"; };

    function Promise(fn) {
      if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      this._state = null;
      this._value = null;
      this._deferreds = [];

      doResolve(fn, bind(resolve, this), bind(reject, this));
    }

    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        }
        catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }

    function resolve(newValue) {
      try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) { reject.call(this, e); }
    }

    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }

    function finale() {
      for (var i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
      }
      this._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done) return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done) return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done) return;
        done = true;
        onRejected(ex);
      }
    }

    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };

    Promise.all = function () {
      var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

      return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) { res(i, val); }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    };

    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };

    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };

    return Promise;
  });

/* jshint ignore:end */
/* eslint-enable */

define(
  'ephox.imagetools.util.Canvas',
  [
  ],
  function () {
    function create(width, height) {
      return resize(document.createElement('canvas'), width, height);
    }

    function clone(canvas) {
      var tCanvas, ctx;
      tCanvas = create(canvas.width, canvas.height);
      ctx = get2dContext(tCanvas);
      ctx.drawImage(canvas, 0, 0);
      return tCanvas;
    }

    function get2dContext(canvas) {
      return canvas.getContext("2d");
    }

    function get3dContext(canvas) {
      var gl = null;
      try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      }
      catch (e) { }

      if (!gl) { // it seems that sometimes it doesn't throw exception, but still fails to get context
        gl = null;
      }
      return gl;
    }

    function resize(canvas, width, height) {
      canvas.width = width;
      canvas.height = height;

      return canvas;
    }

    return {
      create: create,
      clone: clone,
      resize: resize,
      get2dContext: get2dContext,
      get3dContext: get3dContext
    };
  });
define(
  'ephox.imagetools.util.Mime',
  [
  ],
  function () {
    function getUriPathName(uri) {
      var a = document.createElement('a');
      a.href = uri;
      return a.pathname;
    }

    function guessMimeType(uri) {
      var parts, ext, mimes, matches;

      if (uri.indexOf('data:') === 0) {
        uri = uri.split(',');
        matches = /data:([^;]+)/.exec(uri[0]);
        return matches ? matches[1] : '';
      } else {
        mimes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png'
        };

        parts = getUriPathName(uri).split('.');
        ext = parts[parts.length - 1];

        if (ext) {
          ext = ext.toLowerCase();
        }
        return mimes[ext];
      }
    }


    return {
      guessMimeType: guessMimeType
    };
  });
define(
  'ephox.imagetools.util.ImageSize',
  [
  ],
  function() {
  function getWidth(image) {
    return image.naturalWidth || image.width;
  }

  function getHeight(image) {
    return image.naturalHeight || image.height;
  }

  return {
    getWidth: getWidth,
    getHeight: getHeight
  };
});
define(
  'ephox.imagetools.util.Conversions',
  [
    'ephox.imagetools.util.Promise',
    'ephox.imagetools.util.Canvas',
    'ephox.imagetools.util.Mime',
    'ephox.imagetools.util.ImageSize'
  ],
  function (Promise, Canvas, Mime, ImageSize) {
    function loadImage(image) {
      return new Promise(function (resolve) {
        function loaded() {
          image.removeEventListener('load', loaded);
          resolve(image);
        }

        if (image.complete) {
          resolve(image);
        } else {
          image.addEventListener('load', loaded);
        }
      });
    }

    function imageToCanvas(image) {
      return loadImage(image).then(function (image) {
        var context, canvas;

        canvas = Canvas.create(ImageSize.getWidth(image), ImageSize.getHeight(image));
        context = Canvas.get2dContext(canvas);
        context.drawImage(image, 0, 0);

        return canvas;
      });
    }

    function imageToBlob(image) {
      return loadImage(image).then(function (image) {
        var src = image.src;

        if (src.indexOf('blob:') === 0) {
          return blobUriToBlob(src);
        }

        if (src.indexOf('data:') === 0) {
          return dataUriToBlob(src);
        }

        return imageToCanvas(image).then(function (canvas) {
          return dataUriToBlob(canvas.toDataURL(Mime.guessMimeType(src)));
        });
      });
    }

    function blobToImage(blob) {
      return new Promise(function (resolve) {
        var image = new Image();

        function loaded() {
          image.removeEventListener('load', loaded);
          resolve(image);
        }

        image.addEventListener('load', loaded);
        image.src = URL.createObjectURL(blob);

        if (image.complete) {
          loaded();
        }
      });
    }

    function blobUriToBlob(url) {
      return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          }
        };

        xhr.send();
      });
    }

    function dataUriToBlobSync(uri) {
      var str, arr, i, matches, type, blobBuilder;

      uri = uri.split(',');

      matches = /data:([^;]+)/.exec(uri[0]);
      if (matches) {
        type = matches[1];
      }

      str = atob(uri[1]);

      if (window.WebKitBlobBuilder) {
        /*globals WebKitBlobBuilder:false */
        blobBuilder = new WebKitBlobBuilder();

        arr = new ArrayBuffer(str.length);
        for (i = 0; i < arr.length; i++) {
          arr[i] = str.charCodeAt(i);
        }

        blobBuilder.append(arr);
        return blobBuilder.getBlob(type);
      }

      arr = new Uint8Array(str.length);
      for (i = 0; i < arr.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return new Blob([arr], { type: type });
    }

    function dataUriToBlob(uri) {
      return new Promise(function (resolve) {
        resolve(dataUriToBlobSync(uri));
      });
    }

    function uriToBlob(url) {
      if (url.indexOf('blob:') === 0) {
        return blobUriToBlob(url);
      }

      if (url.indexOf('data:') === 0) {
        return dataUriToBlob(url);
      }

      return null;
    }

    function canvasToBlob(canvas, type, quality) {
      type = type || 'image/png';

      if (HTMLCanvasElement.prototype.toBlob) {
        return new Promise(function (resolve) {
          canvas.toBlob(function (blob) {
            resolve(blob);
          }, type, quality);
        });
      } else {
        return dataUriToBlob(canvas.toDataURL(type, quality));
      }
    }

    function blobToDataUri(blob) {
      return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onloadend = function () {
          resolve(reader.result);
        };

        reader.readAsDataURL(blob);
      });
    }

    function blobToBase64(blob) {
      return blobToDataUri(blob).then(function (dataUri) {
        return dataUri.split(',')[1];
      });
    }

    function revokeImageUrl(image) {
      URL.revokeObjectURL(image.src);
    }

    return {
      // used outside
      blobToImage: blobToImage,
      // used outside
      imageToBlob: imageToBlob,
      // used outside
      blobToDataUri: blobToDataUri,
      // used outside
      blobToBase64: blobToBase64,

      // helper method
      imageToCanvas: imageToCanvas,
      // helper method
      canvasToBlob: canvasToBlob,
      // helper method
      revokeImageUrl: revokeImageUrl,
      // helper method
      uriToBlob: uriToBlob,
      // helper method
      dataUriToBlobSync: dataUriToBlobSync
    };
  });
define(
  'ephox.imagetools.util.ImageResult',
  [
    'ephox.imagetools.util.Promise',
    'ephox.imagetools.util.Conversions',
    'ephox.imagetools.util.Mime',
    'ephox.imagetools.util.Canvas'
  ],
  function (Promise, Conversions, Mime, Canvas) {
    function create(canvas, initialType) {
      function getType() {
        return initialType;
      }

      function toBlob(type, quality) {
        return Conversions.canvasToBlob(canvas, type || initialType, quality);
      }

      function toDataURL(type, quality) {
        return canvas.toDataURL(type || initialType, quality);
      }

      function toBase64(type, quality) {
        return toDataURL(type, quality).split(',')[1];
      }

      function toCanvas() {
        return Canvas.clone(canvas);
      }

      return {
        getType: getType,
        toBlob: toBlob,
        toDataURL: toDataURL,
        toBase64: toBase64,
        toCanvas: toCanvas
      };
    }

    function fromBlob(blob) {
      return Conversions.blobToImage(blob)
        .then(function (image) {
          var result = Conversions.imageToCanvas(image);
          Conversions.revokeImageUrl(image);
          return result;
        })
        .then(function (canvas) {
          return create(canvas, blob.type);
        });
    }

    function fromCanvas(canvas, type) {
      return new Promise(function (resolve) {
        resolve(create(canvas, type));
      });
    }

    function fromImage(image) {
      var type = Mime.guessMimeType(image.src);
      return Conversions.imageToCanvas(image).then(function (canvas) {
        return create(canvas, type);
      });
    }

    return {
      fromBlob: fromBlob,
      fromCanvas: fromCanvas,
      fromImage: fromImage
    };
  });

define(
  'ephox.imagetools.api.BlobConversions',
  [
    'ephox.imagetools.util.Conversions',
    'ephox.imagetools.util.ImageResult'
  ],
  function (Conversions, ImageResult) {
    var blobToImage = function (image) {
      return Conversions.blobToImage(image);
    };

    var imageToBlob = function (blob) {
      return Conversions.imageToBlob(blob);
    };

    var blobToDataUri = function (blob) {
      return Conversions.blobToDataUri(blob);
    };

    var blobToBase64 = function (blob) {
      return Conversions.blobToBase64(blob);
    };

    var blobToImageResult = function(blob) {
      return ImageResult.fromBlob(blob);
    };

    var dataUriToImageResult = function(uri) {
      return Conversions.uriToBlob(uri).then(ImageResult.fromBlob);
    };

    var imageToImageResult = function(image) {
      return ImageResult.fromImage(image);
    };

    var imageResultToBlob = function(ir, type, quality) {
      return ir.toBlob(type, quality);
    };

    var imageResultToBlobSync = function(ir, type, quality) {
      return Conversions.dataUriToBlobSync(ir.toDataURL(type, quality));
    };

    return {
      // used outside
      blobToImage: blobToImage,
      // used outside
      imageToBlob: imageToBlob,
      // used outside
      blobToDataUri: blobToDataUri,
      // used outside
      blobToBase64: blobToBase64,
      // used outside
      blobToImageResult: blobToImageResult,
      // used outside
      dataUriToImageResult: dataUriToImageResult,
      // used outside
      imageToImageResult: imageToImageResult,
      // used outside
      imageResultToBlob: imageResultToBlob,
      // just in case
      imageResultToBlobSync: imageResultToBlobSync
    };
  }
);
define(
  'ephox.imagetools.transformations.ColorMatrix',
  [
  ],
  function () {
    function clamp(value, min, max) {
      value = parseFloat(value);

      if (value > max) {
        value = max;
      } else if (value < min) {
        value = min;
      }

      return value;
    }

    function identity() {
      return [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ];
    }

    var DELTA_INDEX = [
      0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11,
      0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.20, 0.21, 0.22, 0.24,
      0.25, 0.27, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42,
      0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68,
      0.71, 0.74, 0.77, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98,
      1.0, 1.06, 1.12, 1.18, 1.24, 1.30, 1.36, 1.42, 1.48, 1.54,
      1.60, 1.66, 1.72, 1.78, 1.84, 1.90, 1.96, 2.0, 2.12, 2.25,
      2.37, 2.50, 2.62, 2.75, 2.87, 3.0, 3.2, 3.4, 3.6, 3.8,
      4.0, 4.3, 4.7, 4.9, 5.0, 5.5, 6.0, 6.5, 6.8, 7.0,
      7.3, 7.5, 7.8, 8.0, 8.4, 8.7, 9.0, 9.4, 9.6, 9.8,
      10.0
    ];

    function multiply(matrix1, matrix2) {
      var i, j, k, val, col = [], out = new Array(10);

      for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
          col[j] = matrix2[j + i * 5];
        }

        for (j = 0; j < 5; j++) {
          val = 0;

          for (k = 0; k < 5; k++) {
            val += matrix1[j + k * 5] * col[k];
          }

          out[j + i * 5] = val;
        }
      }

      return out;
    }

    function adjust(matrix, adjustValue) {
      adjustValue = clamp(adjustValue, 0, 1);

      return matrix.map(function (value, index) {
        if (index % 6 === 0) {
          value = 1.0 - ((1 - value) * adjustValue);
        } else {
          value *= adjustValue;
        }

        return clamp(value, 0, 1);
      });
    }

    function adjustContrast(matrix, value) {
      var x;

      value = clamp(value, -1, 1);
      value *= 100;

      if (value < 0) {
        x = 127 + value / 100 * 127;
      } else {
        x = value % 1;

        if (x === 0) {
          x = DELTA_INDEX[value];
        } else {
          // use linear interpolation for more granularity.
          x = DELTA_INDEX[(Math.floor(value))] * (1 - x) + DELTA_INDEX[(Math.floor(value)) + 1] * x;
        }

        x = x * 127 + 127;
      }

      return multiply(matrix, [
        x / 127, 0, 0, 0, 0.5 * (127 - x),
        0, x / 127, 0, 0, 0.5 * (127 - x),
        0, 0, x / 127, 0, 0.5 * (127 - x),
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ]);
    }

    function adjustSaturation(matrix, value) {
      var x, lumR, lumG, lumB;

      value = clamp(value, -1, 1);
      x = 1 + ((value > 0) ? 3 * value : value);
      lumR = 0.3086;
      lumG = 0.6094;
      lumB = 0.0820;

      return multiply(matrix, [
        lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0,
        lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0,
        lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ]);
    }

    function adjustHue(matrix, angle) {
      var cosVal, sinVal, lumR, lumG, lumB;

      angle = clamp(angle, -180, 180) / 180 * Math.PI;
      cosVal = Math.cos(angle);
      sinVal = Math.sin(angle);
      lumR = 0.213;
      lumG = 0.715;
      lumB = 0.072;

      return multiply(matrix, [
        lumR + cosVal * (1 - lumR) + sinVal * (-lumR), lumG + cosVal * (-lumG) + sinVal * (-lumG),
        lumB + cosVal * (-lumB) + sinVal * (1 - lumB), 0, 0,
        lumR + cosVal * (-lumR) + sinVal * (0.143), lumG + cosVal * (1 - lumG) + sinVal * (0.140),
        lumB + cosVal * (-lumB) + sinVal * (-0.283), 0, 0,
        lumR + cosVal * (-lumR) + sinVal * (-(1 - lumR)), lumG + cosVal * (-lumG) + sinVal * (lumG),
        lumB + cosVal * (1 - lumB) + sinVal * (lumB), 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ]);
    }

    function adjustBrightness(matrix, value) {
      value = clamp(255 * value, -255, 255);

      return multiply(matrix, [
        1, 0, 0, 0, value,
        0, 1, 0, 0, value,
        0, 0, 1, 0, value,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ]);
    }

    function adjustColors(matrix, adjustR, adjustG, adjustB) {
      adjustR = clamp(adjustR, 0, 2);
      adjustG = clamp(adjustG, 0, 2);
      adjustB = clamp(adjustB, 0, 2);

      return multiply(matrix, [
        adjustR, 0, 0, 0, 0,
        0, adjustG, 0, 0, 0,
        0, 0, adjustB, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ]);
    }

    function adjustSepia(matrix, value) {
      value = clamp(value, 0, 1);

      return multiply(matrix, adjust([
        0.393, 0.769, 0.189, 0, 0,
        0.349, 0.686, 0.168, 0, 0,
        0.272, 0.534, 0.131, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ], value));
    }

    function adjustGrayscale(matrix, value) {
      value = clamp(value, 0, 1);

      return multiply(matrix, adjust([
        0.33, 0.34, 0.33, 0, 0,
        0.33, 0.34, 0.33, 0, 0,
        0.33, 0.34, 0.33, 0, 0,
        0, 0, 0, 1, 0,
        0, 0, 0, 0, 1
      ], value));
    }

    return {
      identity: identity,
      adjust: adjust,
      multiply: multiply,
      adjustContrast: adjustContrast,
      adjustBrightness: adjustBrightness,
      adjustSaturation: adjustSaturation,
      adjustHue: adjustHue,
      adjustColors: adjustColors,
      adjustSepia: adjustSepia,
      adjustGrayscale: adjustGrayscale
    };
  });
define(
  'ephox.imagetools.transformations.Filters',
  [
    'ephox.imagetools.util.Canvas',
    'ephox.imagetools.util.ImageResult',
    'ephox.imagetools.transformations.ColorMatrix'
  ],
  function (Canvas, ImageResult, ColorMatrix) {
    function colorFilter(ir, matrix) {
      var canvas = ir.toCanvas();
      var context = Canvas.get2dContext(canvas);
      var pixels;

      function applyMatrix(pixels, m) {
        var d = pixels.data, r, g, b, a, i,
          m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4],
          m5 = m[5], m6 = m[6], m7 = m[7], m8 = m[8], m9 = m[9],
          m10 = m[10], m11 = m[11], m12 = m[12], m13 = m[13], m14 = m[14],
          m15 = m[15], m16 = m[16], m17 = m[17], m18 = m[18], m19 = m[19];

        for (i = 0; i < d.length; i += 4) {
          r = d[i];
          g = d[i + 1];
          b = d[i + 2];
          a = d[i + 3];

          d[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4;
          d[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9;
          d[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14;
          d[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19;
        }

        return pixels;
      }

      pixels = applyMatrix(context.getImageData(0, 0, canvas.width, canvas.height), matrix);
      context.putImageData(pixels, 0, 0);

      return ImageResult.fromCanvas(canvas, ir.getType());
    }

    function convoluteFilter(ir, matrix) {
      var canvas = ir.toCanvas();
      var context = Canvas.get2dContext(canvas);
      var pixelsIn, pixelsOut;

      function applyMatrix(pixelsIn, pixelsOut, matrix) {
        var rgba, drgba, side, halfSide, x, y, r, g, b,
          cx, cy, scx, scy, offset, wt, w, h;

        function clamp(value, min, max) {
          if (value > max) {
            value = max;
          } else if (value < min) {
            value = min;
          }

          return value;
        }

        // Calc side and half side of matrix
        side = Math.round(Math.sqrt(matrix.length));
        halfSide = Math.floor(side / 2);
        rgba = pixelsIn.data;
        drgba = pixelsOut.data;
        w = pixelsIn.width;
        h = pixelsIn.height;

        // Apply convolution matrix to pixels
        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            r = g = b = 0;

            for (cy = 0; cy < side; cy++) {
              for (cx = 0; cx < side; cx++) {
                // Calc relative x, y based on matrix
                scx = clamp(x + cx - halfSide, 0, w - 1);
                scy = clamp(y + cy - halfSide, 0, h - 1);

                // Calc r, g, b
                offset = (scy * w + scx) * 4;
                wt = matrix[cy * side + cx];
                r += rgba[offset] * wt;
                g += rgba[offset + 1] * wt;
                b += rgba[offset + 2] * wt;
              }
            }

            // Set new RGB to destination buffer
            offset = (y * w + x) * 4;
            drgba[offset] = clamp(r, 0, 255);
            drgba[offset + 1] = clamp(g, 0, 255);
            drgba[offset + 2] = clamp(b, 0, 255);
          }
        }

        return pixelsOut;
      }

      pixelsIn = context.getImageData(0, 0, canvas.width, canvas.height);
      pixelsOut = context.getImageData(0, 0, canvas.width, canvas.height);
      pixelsOut = applyMatrix(pixelsIn, pixelsOut, matrix);
      context.putImageData(pixelsOut, 0, 0);

      return ImageResult.fromCanvas(canvas, ir.getType());
    }

    function functionColorFilter(colorFn) {
      return function (ir, value) {
        var canvas = ir.toCanvas();
        var context = Canvas.get2dContext(canvas);
        var pixels, i, lookup = new Array(256);

        function applyLookup(pixels, lookup) {
          var d = pixels.data, i;

          for (i = 0; i < d.length; i += 4) {
            d[i] = lookup[d[i]];
            d[i + 1] = lookup[d[i + 1]];
            d[i + 2] = lookup[d[i + 2]];
          }

          return pixels;
        }

        for (i = 0; i < lookup.length; i++) {
          lookup[i] = colorFn(i, value);
        }

        pixels = applyLookup(context.getImageData(0, 0, canvas.width, canvas.height), lookup);
        context.putImageData(pixels, 0, 0);

        return ImageResult.fromCanvas(canvas, ir.getType());
      };
    }

    function complexAdjustableColorFilter(matrixAdjustFn) {
      return function (ir, adjust) {
        return colorFilter(ir, matrixAdjustFn(ColorMatrix.identity(), adjust));
      };
    }

    function basicColorFilter(matrix) {
      return function (ir) {
        return colorFilter(ir, matrix);
      };
    }

    function basicConvolutionFilter(kernel) {
      return function (ir) {
        return convoluteFilter(ir, kernel);
      };
    }

    return {
      invert: basicColorFilter([
        -1, 0, 0, 0, 255,
        0, -1, 0, 0, 255,
        0, 0, -1, 0, 255,
        0, 0, 0, 1, 0
      ]),

      brightness: complexAdjustableColorFilter(ColorMatrix.adjustBrightness),
      hue: complexAdjustableColorFilter(ColorMatrix.adjustHue),
      saturate: complexAdjustableColorFilter(ColorMatrix.adjustSaturation),
      contrast: complexAdjustableColorFilter(ColorMatrix.adjustContrast),
      grayscale: complexAdjustableColorFilter(ColorMatrix.adjustGrayscale),
      sepia: complexAdjustableColorFilter(ColorMatrix.adjustSepia),
      colorize: function (ir, adjustR, adjustG, adjustB) {
        return colorFilter(ir, ColorMatrix.adjustColors(ColorMatrix.identity(), adjustR, adjustG, adjustB));
      },

      sharpen: basicConvolutionFilter([
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
      ]),

      emboss: basicConvolutionFilter([
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
      ]),

      gamma: functionColorFilter(function (color, value) {
        return Math.pow(color / 255, 1 - value) * 255;
      }),

      exposure: functionColorFilter(function (color, value) {
        return 255 * (1 - Math.exp(-(color / 255) * value));
      }),

      colorFilter: colorFilter,
      convoluteFilter: convoluteFilter
    };
  });
define(
  'ephox.imagetools.transformations.ImageResizerCanvas',
  [
    'ephox.imagetools.util.Promise',
    'ephox.imagetools.util.Conversions',
    'ephox.imagetools.util.Canvas',
    'ephox.imagetools.util.ImageSize'
  ],
  function (Promise, Conversions, Canvas, ImageSize) {
    /**
     * @method scale
     * @static
     * @param image {Image|Canvas}
     * @param dW {Number} Width that the image should be scaled to
     * @param dH {Number} Height that the image should be scaled to
     * @returns {Promise}
     */
    function scale(image, dW, dH) {
      var sW = ImageSize.getWidth(image);
      var sH = ImageSize.getHeight(image);
      var wRatio = dW / sW;
      var hRatio = dH / sH;
      var scaleCapped = false;

      if (wRatio < 0.5 || wRatio > 2) {
        wRatio = wRatio < 0.5 ? 0.5 : 2;
        scaleCapped = true;
      }
      if (hRatio < 0.5 || hRatio > 2) {
        hRatio = hRatio < 0.5 ? 0.5 : 2;
        scaleCapped = true;
      }

      var scaled = _scale(image, wRatio, hRatio);

      return !scaleCapped ? scaled : scaled.then(function (tCanvas) {
        return scale(tCanvas, dW, dH);
      });
    }


    function _scale(image, wRatio, hRatio) {
      return new Promise(function (resolve) {
        var sW = ImageSize.getWidth(image);
        var sH = ImageSize.getHeight(image);
        var dW = Math.floor(sW * wRatio);
        var dH = Math.floor(sH * hRatio);
        var canvas = Canvas.create(dW, dH);
        var context = Canvas.get2dContext(canvas);

        context.drawImage(image, 0, 0, sW, sH, 0, 0, dW, dH);

        resolve(canvas);
      });
    }

    return {
      scale: scale
    };

  });

define(
  'ephox.imagetools.transformations.ImageTools',
  [
    'ephox.imagetools.util.Canvas',
    'ephox.imagetools.util.ImageResult',
    'ephox.imagetools.transformations.ImageResizerCanvas'
  ],
  function (Canvas, ImageResult, ImageResizerCanvas) {
    function rotate(ir, angle) {
      var image = ir.toCanvas();
      var canvas = Canvas.create(image.width, image.height);
      var context = Canvas.get2dContext(canvas);
      var translateX = 0, translateY = 0;

      angle = angle < 0 ? 360 + angle : angle;

      if (angle == 90 || angle == 270) {
        Canvas.resize(canvas, canvas.height, canvas.width);
      }

      if (angle == 90 || angle == 180) {
        translateX = canvas.width;
      }

      if (angle == 270 || angle == 180) {
        translateY = canvas.height;
      }

      context.translate(translateX, translateY);
      context.rotate(angle * Math.PI / 180);
      context.drawImage(image, 0, 0);

      return ImageResult.fromCanvas(canvas, ir.getType());
    }

    function flip(ir, axis) {
      var image = ir.toCanvas();
      var canvas = Canvas.create(image.width, image.height);
      var context = Canvas.get2dContext(canvas);

      if (axis == 'v') {
        context.scale(1, -1);
        context.drawImage(image, 0, -canvas.height);
      } else {
        context.scale(-1, 1);
        context.drawImage(image, -canvas.width, 0);
      }

      return ImageResult.fromCanvas(canvas, ir.getType());
    }

    function crop(ir, x, y, w, h) {
      var image = ir.toCanvas();
      var canvas = Canvas.create(w, h);
      var context = Canvas.get2dContext(canvas);

      context.drawImage(image, -x, -y);

      return ImageResult.fromCanvas(canvas, ir.getType());
    }


    function resize(ir, w, h) {
      return ImageResizerCanvas.scale(ir.toCanvas(), w, h)
        .then(function (canvas) {
          return ImageResult.fromCanvas(canvas, ir.getType());
        });
    }

    return {
      rotate: rotate,
      flip: flip,
      crop: crop,
      resize: resize
    };
  });

define(
  'ephox.imagetools.api.ImageTransformations',
  [
    'ephox.imagetools.transformations.Filters',
    'ephox.imagetools.transformations.ImageTools'
  ],
  function (Filters, ImageTools) {
    var invert = function (ir) {
      return Filters.invert(ir);
    };

    var sharpen = function (ir) {
      return Filters.sharpen(ir);
    };

    var emboss = function (ir) {
      return Filters.emboss(ir);
    };

    var gamma = function (ir, value) {
      return Filters.gamma(ir, value);
    };

    var exposure = function (ir, value) {
      return Filters.exposure(ir, value);
    };

    var colorize = function (ir, adjustR, adjustG, adjustB) {
      return Filters.colorize(ir, adjustR, adjustG, adjustB);
    };

    var brightness = function (ir, adjust) {
      return Filters.brightness(ir, adjust);
    };

    var hue = function (ir, adjust) {
      return Filters.hue(ir, adjust);
    };

    var saturate = function (ir, adjust) {
      return Filters.saturate(ir, adjust);
    };

    var contrast = function (ir, adjust) {
      return Filters.contrast(ir, adjust);
    };

    var grayscale = function (ir, adjust) {
      return Filters.grayscale(ir, adjust);
    };

    var sepia = function (ir, adjust) {
      return Filters.sepia(ir, adjust);
    };

    var flip = function (ir, axis) {
      return ImageTools.flip(ir, axis);
    };

    var crop = function (ir, x, y, w, h) {
      return ImageTools.crop(ir, x, y, w, h);
    };

    var resize = function (ir, w, h) {
      return ImageTools.resize(ir, w, h);
    };

    var rotate = function (ir, angle) {
      return ImageTools.rotate(ir, angle);
    };

    return {
      invert: invert,
      sharpen: sharpen,
      emboss: emboss,
      brightness: brightness,
      hue: hue,
      saturate: saturate,
      contrast: contrast,
      grayscale: grayscale,
      sepia: sepia,
      colorize: colorize,
      gamma: gamma,
      exposure: exposure,

      flip: flip,
      crop: crop,
      resize: resize,
      rotate: rotate
    };
  }
);
defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.Env',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.Env');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.PluginManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.PluginManager');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Delay',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Delay');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Promise',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Promise');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Tools',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Tools');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.URI',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.URI');
  }
);

/**
 * ImageSize.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.ImageSize',
  [
  ],
  function () {
    function getImageSize(img) {
      var width, height;

      function isPxValue(value) {
        return /^[0-9\.]+px$/.test(value);
      }

      width = img.style.width;
      height = img.style.height;
      if (width || height) {
        if (isPxValue(width) && isPxValue(height)) {
          return {
            w: parseInt(width, 10),
            h: parseInt(height, 10)
          };
        }

        return null;
      }

      width = img.width;
      height = img.height;

      if (width && height) {
        return {
          w: parseInt(width, 10),
          h: parseInt(height, 10)
        };
      }

      return null;
    }

    function setImageSize(img, size) {
      var width, height;

      if (size) {
        width = img.style.width;
        height = img.style.height;

        if (width || height) {
          img.style.width = size.w + 'px';
          img.style.height = size.h + 'px';
          img.removeAttribute('data-mce-style');
        }

        width = img.width;
        height = img.height;

        if (width || height) {
          img.setAttribute('width', size.w);
          img.setAttribute('height', size.h);
        }
      }
    }

    function getNaturalImageSize(img) {
      return {
        w: img.naturalWidth,
        h: img.naturalHeight
      };
    }

    return {
      getImageSize: getImageSize,
      setImageSize: setImageSize,
      getNaturalImageSize: getNaturalImageSize
    };
  }
);

defineGlobal("global!Array", Array);
defineGlobal("global!Error", Error);
define(
  'ephox.katamari.api.Fun',

  [
    'global!Array',
    'global!Error'
  ],

  function (Array, Error) {

    var noop = function () { };

    var compose = function (fa, fb) {
      return function () {
        return fa(fb.apply(null, arguments));
      };
    };

    var constant = function (value) {
      return function () {
        return value;
      };
    };

    var identity = function (x) {
      return x;
    };

    var tripleEquals = function(a, b) {
      return a === b;
    };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
    var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++) args[i-1] = arguments[i];

      return function () {
        var newArgs = new Array(arguments.length);
        for (var j = 0; j < newArgs.length; j++) newArgs[j] = arguments[j];

        var all = args.concat(newArgs);
        return f.apply(null, all);
      };
    };

    var not = function (f) {
      return function () {
        return !f.apply(null, arguments);
      };
    };

    var die = function (msg) {
      return function () {
        throw new Error(msg);
      };
    };

    var apply = function (f) {
      return f();
    };

    var call = function(f) {
      f();
    };

    var never = constant(false);
    var always = constant(true);
    

    return {
      noop: noop,
      compose: compose,
      constant: constant,
      identity: identity,
      tripleEquals: tripleEquals,
      curry: curry,
      not: not,
      die: die,
      apply: apply,
      call: call,
      never: never,
      always: always
    };
  }
);

defineGlobal("global!Object", Object);
define(
  'ephox.katamari.api.Option',

  [
    'ephox.katamari.api.Fun',
    'global!Object'
  ],

  function (Fun, Object) {

    var never = Fun.never;
    var always = Fun.always;

    /**
      Option objects support the following methods:

      fold :: this Option a -> ((() -> b, a -> b)) -> Option b

      is :: this Option a -> a -> Boolean

      isSome :: this Option a -> () -> Boolean

      isNone :: this Option a -> () -> Boolean

      getOr :: this Option a -> a -> a

      getOrThunk :: this Option a -> (() -> a) -> a

      getOrDie :: this Option a -> String -> a

      or :: this Option a -> Option a -> Option a
        - if some: return self
        - if none: return opt

      orThunk :: this Option a -> (() -> Option a) -> Option a
        - Same as "or", but uses a thunk instead of a value

      map :: this Option a -> (a -> b) -> Option b
        - "fmap" operation on the Option Functor.
        - same as 'each'

      ap :: this Option a -> Option (a -> b) -> Option b
        - "apply" operation on the Option Apply/Applicative.
        - Equivalent to <*> in Haskell/PureScript.

      each :: this Option a -> (a -> b) -> Option b
        - same as 'map'

      bind :: this Option a -> (a -> Option b) -> Option b
        - "bind"/"flatMap" operation on the Option Bind/Monad.
        - Equivalent to >>= in Haskell/PureScript; flatMap in Scala.

      flatten :: {this Option (Option a))} -> () -> Option a
        - "flatten"/"join" operation on the Option Monad.

      exists :: this Option a -> (a -> Boolean) -> Boolean

      forall :: this Option a -> (a -> Boolean) -> Boolean

      filter :: this Option a -> (a -> Boolean) -> Option a

      equals :: this Option a -> Option a -> Boolean

      equals_ :: this Option a -> (Option a, a -> Boolean) -> Boolean

      toArray :: this Option a -> () -> [a]

    */

    var none = function () { return NONE; };

    var NONE = (function () {
      var eq = function (o) {
        return o.isNone();
      };

      // inlined from peanut, maybe a micro-optimisation?
      var call = function (thunk) { return thunk(); };
      var id = function (n) { return n; };
      var noop = function () { };

      var me = {
        fold: function (n, s) { return n(); },
        is: never,
        isSome: never,
        isNone: always,
        getOr: id,
        getOrThunk: call,
        getOrDie: function (msg) {
          throw new Error(msg || 'error: getOrDie called on none.');
        },
        or: id,
        orThunk: call,
        map: none,
        ap: none,
        each: noop,
        bind: none,
        flatten: none,
        exists: never,
        forall: always,
        filter: none,
        equals: eq,
        equals_: eq,
        toArray: function () { return []; },
        toString: Fun.constant("none()")
      };
      if (Object.freeze) Object.freeze(me);
      return me;
    })();


    /** some :: a -> Option a */
    var some = function (a) {

      // inlined from peanut, maybe a micro-optimisation?
      var constant_a = function () { return a; };

      var self = function () {
        // can't Fun.constant this one
        return me;
      };

      var map = function (f) {
        return some(f(a));
      };

      var bind = function (f) {
        return f(a);
      };

      var me = {
        fold: function (n, s) { return s(a); },
        is: function (v) { return a === v; },
        isSome: always,
        isNone: never,
        getOr: constant_a,
        getOrThunk: constant_a,
        getOrDie: constant_a,
        or: self,
        orThunk: self,
        map: map,
        ap: function (optfab) {
          return optfab.fold(none, function(fab) {
            return some(fab(a));
          });
        },
        each: function (f) {
          f(a);
        },
        bind: bind,
        flatten: constant_a,
        exists: bind,
        forall: bind,
        filter: function (f) {
          return f(a) ? me : NONE;
        },
        equals: function (o) {
          return o.is(a);
        },
        equals_: function (o, elementEq) {
          return o.fold(
            never,
            function (b) { return elementEq(a, b); }
          );
        },
        toArray: function () {
          return [a];
        },
        toString: function () {
          return 'some(' + a + ')';
        }
      };
      return me;
    };

    /** from :: undefined|null|a -> Option a */
    var from = function (value) {
      return value === null || value === undefined ? NONE : some(value);
    };

    return {
      some: some,
      none: none,
      from: from
    };
  }
);

defineGlobal("global!String", String);
define(
  'ephox.katamari.api.Arr',

  [
    'ephox.katamari.api.Option',
    'global!Array',
    'global!Error',
    'global!String'
  ],

  function (Option, Array, Error, String) {
    // Use the native Array.indexOf if it is available (IE9+) otherwise fall back to manual iteration
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
    var rawIndexOf = (function () {
      var pIndexOf = Array.prototype.indexOf;

      var fastIndex = function (xs, x) { return  pIndexOf.call(xs, x); };

      var slowIndex = function(xs, x) { return slowIndexOf(xs, x); };

      return pIndexOf === undefined ? slowIndex : fastIndex;
    })();

    var indexOf = function (xs, x) {
      // The rawIndexOf method does not wrap up in an option. This is for performance reasons.
      var r = rawIndexOf(xs, x);
      return r === -1 ? Option.none() : Option.some(r);
    };

    var contains = function (xs, x) {
      return rawIndexOf(xs, x) > -1;
    };

    // Using findIndex is likely less optimal in Chrome (dynamic return type instead of bool)
    // but if we need that micro-optimisation we can inline it later.
    var exists = function (xs, pred) {
      return findIndex(xs, pred).isSome();
    };

    var range = function (num, f) {
      var r = [];
      for (var i = 0; i < num; i++) {
        r.push(f(i));
      }
      return r;
    };

    // It's a total micro optimisation, but these do make some difference.
    // Particularly for browsers other than Chrome.
    // - length caching
    // http://jsperf.com/browser-diet-jquery-each-vs-for-loop/69
    // - not using push
    // http://jsperf.com/array-direct-assignment-vs-push/2

    var chunk = function (array, size) {
      var r = [];
      for (var i = 0; i < array.length; i += size) {
        var s = array.slice(i, i + size);
        r.push(s);
      }
      return r;
    };

    var map = function(xs, f) {
      // pre-allocating array size when it's guaranteed to be known
      // http://jsperf.com/push-allocated-vs-dynamic/22
      var len = xs.length;
      var r = new Array(len);
      for (var i = 0; i < len; i++) {
        var x = xs[i];
        r[i] = f(x, i, xs);
      }
      return r;
    };

    // Unwound implementing other functions in terms of each.
    // The code size is roughly the same, and it should allow for better optimisation.
    var each = function(xs, f) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        f(x, i, xs);
      }
    };

    var eachr = function (xs, f) {
      for (var i = xs.length - 1; i >= 0; i--) {
        var x = xs[i];
        f(x, i, xs);
      }
    };

    var partition = function(xs, pred) {
      var pass = [];
      var fail = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var arr = pred(x, i, xs) ? pass : fail;
        arr.push(x);
      }
      return { pass: pass, fail: fail };
    };

    var filter = function(xs, pred) {
      var r = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          r.push(x);
        }
      }
      return r;
    };

    /*
     * Groups an array into contiguous arrays of like elements. Whether an element is like or not depends on f.
     *
     * f is a function that derives a value from an element - e.g. true or false, or a string.
     * Elements are like if this function generates the same value for them (according to ===).
     *
     *
     * Order of the elements is preserved. Arr.flatten() on the result will return the original list, as with Haskell groupBy function.
     *  For a good explanation, see the group function (which is a special case of groupBy)
     *  http://hackage.haskell.org/package/base-4.7.0.0/docs/Data-List.html#v:group
     */
    var groupBy = function (xs, f) {
      if (xs.length === 0) {
        return [];
      } else {
        var wasType = f(xs[0]); // initial case for matching
        var r = [];
        var group = [];

        for (var i = 0, len = xs.length; i < len; i++) {
          var x = xs[i];
          var type = f(x);
          if (type !== wasType) {
            r.push(group);
            group = [];
          }
          wasType = type;
          group.push(x);
        }
        if (group.length !== 0) {
          r.push(group);
        }
        return r;
      }
    };

    var foldr = function (xs, f, acc) {
      eachr(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };

    var foldl = function (xs, f, acc) {
      each(xs, function (x) {
        acc = f(acc, x);
      });
      return acc;
    };

    var find = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(x);
        }
      }
      return Option.none();
    };

    var findIndex = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        if (pred(x, i, xs)) {
          return Option.some(i);
        }
      }

      return Option.none();
    };

    var slowIndexOf = function (xs, x) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        if (xs[i] === x) {
          return i;
        }
      }

      return -1;
    };

    var push = Array.prototype.push;
    var flatten = function (xs) {
      // Note, this is possible because push supports multiple arguments:
      // http://jsperf.com/concat-push/6
      // Note that in the past, concat() would silently work (very slowly) for array-like objects.
      // With this change it will throw an error.
      var r = [];
      for (var i = 0, len = xs.length; i < len; ++i) {
        // Ensure that each value is an array itself
        if (! Array.prototype.isPrototypeOf(xs[i])) throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
        push.apply(r, xs[i]);
      }
      return r;
    };

    var bind = function (xs, f) {
      var output = map(xs, f);
      return flatten(output);
    };

    var forall = function (xs, pred) {
      for (var i = 0, len = xs.length; i < len; ++i) {
        var x = xs[i];
        if (pred(x, i, xs) !== true) {
          return false;
        }
      }
      return true;
    };

    var equal = function (a1, a2) {
      return a1.length === a2.length && forall(a1, function (x, i) {
        return x === a2[i];
      });
    };

    var slice = Array.prototype.slice;
    var reverse = function (xs) {
      var r = slice.call(xs, 0);
      r.reverse();
      return r;
    };

    var difference = function (a1, a2) {
      return filter(a1, function (x) {
        return !contains(a2, x);
      });
    };

    var mapToObject = function(xs, f) {
      var r = {};
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };

    var pure = function(x) {
      return [x];
    };

    var sort = function (xs, comparator) {
      var copy = slice.call(xs, 0);
      copy.sort(comparator);
      return copy;
    };

    return {
      map: map,
      each: each,
      eachr: eachr,
      partition: partition,
      filter: filter,
      groupBy: groupBy,
      indexOf: indexOf,
      foldr: foldr,
      foldl: foldl,
      find: find,
      findIndex: findIndex,
      flatten: flatten,
      bind: bind,
      forall: forall,
      exists: exists,
      contains: contains,
      equal: equal,
      reverse: reverse,
      chunk: chunk,
      difference: difference,
      mapToObject: mapToObject,
      pure: pure,
      sort: sort,
      range: range
    };
  }
);
/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.Utils',
  [
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools'
  ],
  function (Promise, Tools) {
    var isValue = function (obj) {
      return obj !== null && obj !== undefined;
    };

    var traverse = function (json, path) {
      var value;

      value = path.reduce(function (result, key) {
        return isValue(result) ? result[key] : undefined;
      }, json);

      return isValue(value) ? value : null;
    };

    var requestUrlAsBlob = function (url, headers) {
      return new Promise(function (resolve) {
        var xhr;

        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            resolve({
              status: xhr.status,
              blob: this.response
            });
          }
        };

        xhr.open('GET', url, true);

        Tools.each(headers, function (value, key) {
          xhr.setRequestHeader(key, value);
        });

        xhr.responseType = 'blob';
        xhr.send();
      });
    };

    var readBlob = function (blob) {
      return new Promise(function (resolve) {
        var fr = new FileReader();

        fr.onload = function (e) {
          var data = e.target;
          resolve(data.result);
        };

        fr.readAsText(blob);
      });
    };

    var parseJson = function (text) {
      var json;

      try {
        json = JSON.parse(text);
      } catch (ex) {
        // Ignore
      }

      return json;
    };

    return {
      traverse: traverse,
      readBlob: readBlob,
      requestUrlAsBlob: requestUrlAsBlob,
      parseJson: parseJson
    };
  }
);

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

/**
 * Proxy.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Handles loading images though a proxy for working around cors.
 */
define(
  'tinymce.plugins.imagetools.core.Proxy',
  [
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.plugins.imagetools.core.Errors',
    'tinymce.plugins.imagetools.core.Utils'
  ],
  function (Promise, Tools, Errors, Utils) {
    var appendApiKey = function (url, apiKey) {
      var separator = url.indexOf('?') === -1 ? '?' : '&';
      if (/[?&]apiKey=/.test(url) || !apiKey) {
        return url;
      } else {
        return url + separator + 'apiKey=' + encodeURIComponent(apiKey);
      }
    };

    var requestServiceBlob = function (url, apiKey) {
      return Utils.requestUrlAsBlob(appendApiKey(url, apiKey), {
        'Content-Type': 'application/json;charset=UTF-8',
        'tiny-api-key': apiKey
      }).then(function (result) {
        return result.status < 200 || result.status >= 300 ? Errors.handleServiceErrorResponse(result.status, result.blob) : Promise.resolve(result.blob);
      });
    };

    function requestBlob(url) {
      return Utils.requestUrlAsBlob(url, {})
        .then(function (result) {
          return result.status < 200 || result.status >= 300 ? Errors.handleHttpError(result.status) : Promise.resolve(result.blob);
        });
    }

    var getUrl = function (url, apiKey) {
      return apiKey ? requestServiceBlob(url, apiKey) : requestBlob(url);
    };

    return {
      getUrl: getUrl
    };
  }
);

defineGlobal("global!Math", Math);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.ui.Factory',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.ui.Factory');
  }
);

/**
 * UndoStack.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.UndoStack',
  [
  ],
  function () {
    return function () {
      var data = [], index = -1;

      function add(state) {
        var removed;

        removed = data.splice(++index);
        data.push(state);

        return {
          state: state,
          removed: removed
        };
      }

      function undo() {
        if (canUndo()) {
          return data[--index];
        }
      }

      function redo() {
        if (canRedo()) {
          return data[++index];
        }
      }

      function canUndo() {
        return index > 0;
      }

      function canRedo() {
        return index != -1 && index < data.length - 1;
      }

      return {
        data: data,
        add: add,
        undo: undo,
        redo: redo,
        canUndo: canUndo,
        canRedo: canRedo
      };
    };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.geom.Rect',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.geom.Rect');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.DomQuery',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DomQuery');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.Observable',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.Observable');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.VK',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.VK');
  }
);

/**
 * CropRect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.CropRect',
  [
    'tinymce.core.dom.DomQuery',
    'tinymce.core.geom.Rect',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Observable',
    'tinymce.core.util.Tools',
    'tinymce.core.util.VK'
  ],
  function (DomQuery, Rect, Factory, Observable, Tools, VK) {
    var count = 0;

    return function (currentRect, viewPortRect, clampRect, containerElm, action) {
      var instance, handles, dragHelpers, blockers, prefix = 'mce-', id = prefix + 'crid-' + (count++);

      handles = [
        { name: 'move', xMul: 0, yMul: 0, deltaX: 1, deltaY: 1, deltaW: 0, deltaH: 0, label: 'Crop Mask' },
        { name: 'nw', xMul: 0, yMul: 0, deltaX: 1, deltaY: 1, deltaW: -1, deltaH: -1, label: 'Top Left Crop Handle' },
        { name: 'ne', xMul: 1, yMul: 0, deltaX: 0, deltaY: 1, deltaW: 1, deltaH: -1, label: 'Top Right Crop Handle' },
        { name: 'sw', xMul: 0, yMul: 1, deltaX: 1, deltaY: 0, deltaW: -1, deltaH: 1, label: 'Bottom Left Crop Handle' },
        { name: 'se', xMul: 1, yMul: 1, deltaX: 0, deltaY: 0, deltaW: 1, deltaH: 1, label: 'Bottom Right Crop Handle' }
      ];

      blockers = ["top", "right", "bottom", "left"];

      function getAbsoluteRect(outerRect, relativeRect) {
        return {
          x: relativeRect.x + outerRect.x,
          y: relativeRect.y + outerRect.y,
          w: relativeRect.w,
          h: relativeRect.h
        };
      }

      function getRelativeRect(outerRect, innerRect) {
        return {
          x: innerRect.x - outerRect.x,
          y: innerRect.y - outerRect.y,
          w: innerRect.w,
          h: innerRect.h
        };
      }

      function getInnerRect() {
        return getRelativeRect(clampRect, currentRect);
      }

      function moveRect(handle, startRect, deltaX, deltaY) {
        var x, y, w, h, rect;

        x = startRect.x;
        y = startRect.y;
        w = startRect.w;
        h = startRect.h;

        x += deltaX * handle.deltaX;
        y += deltaY * handle.deltaY;
        w += deltaX * handle.deltaW;
        h += deltaY * handle.deltaH;

        if (w < 20) {
          w = 20;
        }

        if (h < 20) {
          h = 20;
        }

        rect = currentRect = Rect.clamp({ x: x, y: y, w: w, h: h }, clampRect, handle.name == 'move');
        rect = getRelativeRect(clampRect, rect);

        instance.fire('updateRect', { rect: rect });
        setInnerRect(rect);
      }

      function render() {
        function createDragHelper(handle) {
          var startRect;
          var DragHelper = Factory.get('DragHelper');

          return new DragHelper(id, {
            document: containerElm.ownerDocument,
            handle: id + '-' + handle.name,

            start: function () {
              startRect = currentRect;
            },

            drag: function (e) {
              moveRect(handle, startRect, e.deltaX, e.deltaY);
            }
          });
        }

        DomQuery(
          '<div id="' + id + '" class="' + prefix + 'croprect-container"' +
          ' role="grid" aria-dropeffect="execute">'
        ).appendTo(containerElm);

        Tools.each(blockers, function (blocker) {
          DomQuery('#' + id, containerElm).append(
            '<div id="' + id + '-' + blocker + '"class="' + prefix + 'croprect-block" style="display: none" data-mce-bogus="all">'
          );
        });

        Tools.each(handles, function (handle) {
          DomQuery('#' + id, containerElm).append(
            '<div id="' + id + '-' + handle.name + '" class="' + prefix +
            'croprect-handle ' + prefix + 'croprect-handle-' + handle.name + '"' +
            'style="display: none" data-mce-bogus="all" role="gridcell" tabindex="-1"' +
            ' aria-label="' + handle.label + '" aria-grabbed="false">'
          );
        });

        dragHelpers = Tools.map(handles, createDragHelper);

        repaint(currentRect);

        DomQuery(containerElm).on('focusin focusout', function (e) {
          DomQuery(e.target).attr('aria-grabbed', e.type === 'focus');
        });

        DomQuery(containerElm).on('keydown', function (e) {
          var activeHandle;

          Tools.each(handles, function (handle) {
            if (e.target.id == id + '-' + handle.name) {
              activeHandle = handle;
              return false;
            }
          });

          function moveAndBlock(evt, handle, startRect, deltaX, deltaY) {
            evt.stopPropagation();
            evt.preventDefault();

            moveRect(activeHandle, startRect, deltaX, deltaY);
          }

          switch (e.keyCode) {
            case VK.LEFT:
              moveAndBlock(e, activeHandle, currentRect, -10, 0);
              break;

            case VK.RIGHT:
              moveAndBlock(e, activeHandle, currentRect, 10, 0);
              break;

            case VK.UP:
              moveAndBlock(e, activeHandle, currentRect, 0, -10);
              break;

            case VK.DOWN:
              moveAndBlock(e, activeHandle, currentRect, 0, 10);
              break;

            case VK.ENTER:
            case VK.SPACEBAR:
              e.preventDefault();
              action();
              break;
          }
        });
      }

      function toggleVisibility(state) {
        var selectors;

        selectors = Tools.map(handles, function (handle) {
          return '#' + id + '-' + handle.name;
        }).concat(Tools.map(blockers, function (blocker) {
          return '#' + id + '-' + blocker;
        })).join(',');

        if (state) {
          DomQuery(selectors, containerElm).show();
        } else {
          DomQuery(selectors, containerElm).hide();
        }
      }

      function repaint(rect) {
        function updateElementRect(name, rect) {
          if (rect.h < 0) {
            rect.h = 0;
          }

          if (rect.w < 0) {
            rect.w = 0;
          }

          DomQuery('#' + id + '-' + name, containerElm).css({
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h
          });
        }

        Tools.each(handles, function (handle) {
          DomQuery('#' + id + '-' + handle.name, containerElm).css({
            left: rect.w * handle.xMul + rect.x,
            top: rect.h * handle.yMul + rect.y
          });
        });

        updateElementRect('top', { x: viewPortRect.x, y: viewPortRect.y, w: viewPortRect.w, h: rect.y - viewPortRect.y });
        updateElementRect('right', { x: rect.x + rect.w, y: rect.y, w: viewPortRect.w - rect.x - rect.w + viewPortRect.x, h: rect.h });
        updateElementRect('bottom', {
          x: viewPortRect.x,
          y: rect.y + rect.h,
          w: viewPortRect.w,
          h: viewPortRect.h - rect.y - rect.h + viewPortRect.y
        });
        updateElementRect('left', { x: viewPortRect.x, y: rect.y, w: rect.x - viewPortRect.x, h: rect.h });
        updateElementRect('move', rect);
      }

      function setRect(rect) {
        currentRect = rect;
        repaint(currentRect);
      }

      function setViewPortRect(rect) {
        viewPortRect = rect;
        repaint(currentRect);
      }

      function setInnerRect(rect) {
        setRect(getAbsoluteRect(clampRect, rect));
      }

      function setClampRect(rect) {
        clampRect = rect;
        repaint(currentRect);
      }

      function destroy() {
        Tools.each(dragHelpers, function (helper) {
          helper.destroy();
        });

        dragHelpers = [];
      }

      render(containerElm);

      instance = Tools.extend({
        toggleVisibility: toggleVisibility,
        setClampRect: setClampRect,
        setRect: setRect,
        getInnerRect: getInnerRect,
        setInnerRect: setInnerRect,
        setViewPortRect: setViewPortRect,
        destroy: destroy
      }, Observable);

      return instance;
    };
  }
);

/**
 * ImagePanel.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.ImagePanel',
  [
    'tinymce.core.geom.Rect',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.plugins.imagetools.ui.CropRect'
  ],
  function (Rect, Factory, Promise, Tools, CropRect) {
    function loadImage(image) {
      return new Promise(function (resolve) {
        function loaded() {
          image.removeEventListener('load', loaded);
          resolve(image);
        }

        if (image.complete) {
          resolve(image);
        } else {
          image.addEventListener('load', loaded);
        }
      });
    }

    var create = function (settings) {
      var Control = Factory.get('Control');
      var ImagePanel = Control.extend({
        Defaults: {
          classes: "imagepanel"
        },

        selection: function (rect) {
          if (arguments.length) {
            this.state.set('rect', rect);
            return this;
          }

          return this.state.get('rect');
        },

        imageSize: function () {
          var viewRect = this.state.get('viewRect');

          return {
            w: viewRect.w,
            h: viewRect.h
          };
        },

        toggleCropRect: function (state) {
          this.state.set('cropEnabled', state);
        },

        imageSrc: function (url) {
          var self = this, img = new Image();

          img.src = url;

          loadImage(img).then(function () {
            var rect, $img, lastRect = self.state.get('viewRect');

            $img = self.$el.find('img');
            if ($img[0]) {
              $img.replaceWith(img);
            } else {
              var bg = document.createElement('div');
              bg.className = 'mce-imagepanel-bg';
              self.getEl().appendChild(bg);
              self.getEl().appendChild(img);
            }

            rect = { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
            self.state.set('viewRect', rect);
            self.state.set('rect', Rect.inflate(rect, -20, -20));

            if (!lastRect || lastRect.w != rect.w || lastRect.h != rect.h) {
              self.zoomFit();
            }

            self.repaintImage();
            self.fire('load');
          });
        },

        zoom: function (value) {
          if (arguments.length) {
            this.state.set('zoom', value);
            return this;
          }

          return this.state.get('zoom');
        },

        postRender: function () {
          this.imageSrc(this.settings.imageSrc);
          return this._super();
        },

        zoomFit: function () {
          var self = this, $img, pw, ph, w, h, zoom, padding;

          padding = 10;
          $img = self.$el.find('img');
          pw = self.getEl().clientWidth;
          ph = self.getEl().clientHeight;
          w = $img[0].naturalWidth;
          h = $img[0].naturalHeight;
          zoom = Math.min((pw - padding) / w, (ph - padding) / h);

          if (zoom >= 1) {
            zoom = 1;
          }

          self.zoom(zoom);
        },

        repaintImage: function () {
          var x, y, w, h, pw, ph, $img, $bg, zoom, rect, elm;

          elm = this.getEl();
          zoom = this.zoom();
          rect = this.state.get('rect');
          $img = this.$el.find('img');
          $bg = this.$el.find('.mce-imagepanel-bg');
          pw = elm.offsetWidth;
          ph = elm.offsetHeight;
          w = $img[0].naturalWidth * zoom;
          h = $img[0].naturalHeight * zoom;
          x = Math.max(0, pw / 2 - w / 2);
          y = Math.max(0, ph / 2 - h / 2);

          $img.css({
            left: x,
            top: y,
            width: w,
            height: h
          });

          $bg.css({
            left: x,
            top: y,
            width: w,
            height: h
          });

          if (this.cropRect) {
            this.cropRect.setRect({
              x: rect.x * zoom + x,
              y: rect.y * zoom + y,
              w: rect.w * zoom,
              h: rect.h * zoom
            });

            this.cropRect.setClampRect({
              x: x,
              y: y,
              w: w,
              h: h
            });

            this.cropRect.setViewPortRect({
              x: 0,
              y: 0,
              w: pw,
              h: ph
            });
          }
        },

        bindStates: function () {
          var self = this;

          function setupCropRect(rect) {
            self.cropRect = new CropRect(
              rect,
              self.state.get('viewRect'),
              self.state.get('viewRect'),
              self.getEl(),
              function () {
                self.fire('crop');
              }
            );

            self.cropRect.on('updateRect', function (e) {
              var rect = e.rect, zoom = self.zoom();

              rect = {
                x: Math.round(rect.x / zoom),
                y: Math.round(rect.y / zoom),
                w: Math.round(rect.w / zoom),
                h: Math.round(rect.h / zoom)
              };

              self.state.set('rect', rect);
            });

            self.on('remove', self.cropRect.destroy);
          }

          self.state.on('change:cropEnabled', function (e) {
            self.cropRect.toggleVisibility(e.value);
            self.repaintImage();
          });

          self.state.on('change:zoom', function () {
            self.repaintImage();
          });

          self.state.on('change:rect', function (e) {
            var rect = e.value;

            if (!self.cropRect) {
              setupCropRect(rect);
            }

            self.cropRect.setRect(rect);
          });
        }
      });

      return new ImagePanel(settings);
    };

    return {
      create: create
    };
  }
);

/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.Dialog',
  [
    'ephox.imagetools.api.BlobConversions',
    'ephox.imagetools.api.ImageTransformations',
    'global!Math',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.plugins.imagetools.core.UndoStack',
    'tinymce.plugins.imagetools.ui.ImagePanel'
  ],
  function (BlobConversions, ImageTransformations, Math, DOMUtils, Factory, Promise, Tools, UndoStack, ImagePanel) {
    function createState(blob) {
      return {
        blob: blob,
        url: URL.createObjectURL(blob)
      };
    }

    function destroyState(state) {
      if (state) {
        URL.revokeObjectURL(state.url);
      }
    }

    function destroyStates(states) {
      Tools.each(states, destroyState);
    }

    function open(editor, currentState, resolve, reject) {
      var win, undoStack = new UndoStack(), mainPanel, filtersPanel, tempState,
        cropPanel, resizePanel, flipRotatePanel, imagePanel, sidePanel, mainViewContainer,
        invertPanel, brightnessPanel, huePanel, saturatePanel, contrastPanel, grayscalePanel,
        sepiaPanel, colorizePanel, sharpenPanel, embossPanel, gammaPanel, exposurePanel, panels,
        width, height, ratioW, ratioH;

      function recalcSize(e) {
        var widthCtrl, heightCtrl, newWidth, newHeight;

        widthCtrl = win.find('#w')[0];
        heightCtrl = win.find('#h')[0];

        newWidth = parseInt(widthCtrl.value(), 10);
        newHeight = parseInt(heightCtrl.value(), 10);

        if (win.find('#constrain')[0].checked() && width && height && newWidth && newHeight) {
          if (e.control.settings.name == 'w') {
            newHeight = Math.round(newWidth * ratioW);
            heightCtrl.value(newHeight);
          } else {
            newWidth = Math.round(newHeight * ratioH);
            widthCtrl.value(newWidth);
          }
        }

        width = newWidth;
        height = newHeight;
      }

      function floatToPercent(value) {
        return Math.round(value * 100) + '%';
      }

      function updateButtonUndoStates() {
        win.find('#undo').disabled(!undoStack.canUndo());
        win.find('#redo').disabled(!undoStack.canRedo());
        win.statusbar.find('#save').disabled(!undoStack.canUndo());
      }

      function disableUndoRedo() {
        win.find('#undo').disabled(true);
        win.find('#redo').disabled(true);
      }

      function displayState(state) {
        if (state) {
          imagePanel.imageSrc(state.url);
        }
      }

      function switchPanel(targetPanel) {
        return function () {
          var hidePanels = Tools.grep(panels, function (panel) {
            return panel.settings.name != targetPanel;
          });

          Tools.each(hidePanels, function (panel) {
            panel.hide();
          });

          targetPanel.show();
          targetPanel.focus();
        };
      }

      function addTempState(blob) {
        tempState = createState(blob);
        displayState(tempState);
      }

      function addBlobState(blob) {
        currentState = createState(blob);
        displayState(currentState);
        destroyStates(undoStack.add(currentState).removed);
        updateButtonUndoStates();
      }

      function crop() {
        var rect = imagePanel.selection();

        BlobConversions.blobToImageResult(currentState.blob).
          then(function (ir) {
            ImageTransformations.crop(ir, rect.x, rect.y, rect.w, rect.h).
              then(imageResultToBlob).
              then(function (blob) {
                addBlobState(blob);
                cancel();
              });
          });
      }

      function tempAction(fn) {
        var args = [].slice.call(arguments, 1);

        return function () {
          var state = tempState || currentState;

          BlobConversions.blobToImageResult(state.blob).
            then(function (ir) {
              fn.apply(this, [ir].concat(args)).then(imageResultToBlob).then(addTempState);
            });
        };
      }

      function action(fn) {
        var args = [].slice.call(arguments, 1);

        return function () {
          BlobConversions.blobToImageResult(currentState.blob).
            then(function (ir) {
              fn.apply(this, [ir].concat(args)).then(imageResultToBlob).then(addBlobState);
            });
        };
      }

      function cancel() {
        displayState(currentState);
        destroyState(tempState);
        switchPanel(mainPanel)();
        updateButtonUndoStates();
      }

      function waitForTempState(times, applyCall) {
        if (tempState) {
          applyCall();
        } else {
          setTimeout(function () {
            if (times-- > 0) {
              waitForTempState(times, applyCall);
            } else {
              editor.windowManager.alert('Error: failed to apply image operation.');
            }
          }, 10);
        }
      }

      function applyTempState() {
        if (tempState) {
          addBlobState(tempState.blob);
          cancel();
        } else {
          waitForTempState(100, applyTempState);
        }
      }

      function zoomIn() {
        var zoom = imagePanel.zoom();

        if (zoom < 2) {
          zoom += 0.1;
        }

        imagePanel.zoom(zoom);
      }

      function zoomOut() {
        var zoom = imagePanel.zoom();

        if (zoom > 0.1) {
          zoom -= 0.1;
        }

        imagePanel.zoom(zoom);
      }

      function undo() {
        currentState = undoStack.undo();
        displayState(currentState);
        updateButtonUndoStates();
      }

      function redo() {
        currentState = undoStack.redo();
        displayState(currentState);
        updateButtonUndoStates();
      }

      function save() {
        resolve(currentState.blob);
        win.close();
      }

      function createPanel(items) {
        return Factory.create('Form', {
          layout: 'flex',
          direction: 'row',
          labelGap: 5,
          border: '0 0 1 0',
          align: 'center',
          pack: 'center',
          padding: '0 10 0 10',
          spacing: 5,
          flex: 0,
          minHeight: 60,
          defaults: {
            classes: 'imagetool',
            type: 'button'
          },
          items: items
        });
      }

      var imageResultToBlob = function (ir) {
        return ir.toBlob();
      };

      function createFilterPanel(title, filter) {
        return createPanel([
          { text: 'Back', onclick: cancel },
          { type: 'spacer', flex: 1 },
          { text: 'Apply', subtype: 'primary', onclick: applyTempState }
        ]).hide().on('show', function () {
          disableUndoRedo();

          BlobConversions.blobToImageResult(currentState.blob).
            then(function (ir) {
              return filter(ir);
            }).
            then(imageResultToBlob).
            then(function (blob) {
              var newTempState = createState(blob);

              displayState(newTempState);
              destroyState(tempState);
              tempState = newTempState;
            });
        });
      }

      function createVariableFilterPanel(title, filter, value, min, max) {
        function update(value) {
          BlobConversions.blobToImageResult(currentState.blob).
            then(function (ir) {
              return filter(ir, value);
            }).
            then(imageResultToBlob).
            then(function (blob) {
              var newTempState = createState(blob);
              displayState(newTempState);
              destroyState(tempState);
              tempState = newTempState;
            });
        }

        return createPanel([
          { text: 'Back', onclick: cancel },
          { type: 'spacer', flex: 1 },
          {
            type: 'slider',
            flex: 1,
            ondragend: function (e) {
              update(e.value);
            },
            minValue: min,
            maxValue: max,
            value: value,
            previewFilter: floatToPercent
          },
          { type: 'spacer', flex: 1 },
          { text: 'Apply', subtype: 'primary', onclick: applyTempState }
        ]).hide().on('show', function () {
          this.find('slider').value(value);
          disableUndoRedo();
        });
      }

      function createRgbFilterPanel(title, filter) {
        function update() {
          var r, g, b;

          r = win.find('#r')[0].value();
          g = win.find('#g')[0].value();
          b = win.find('#b')[0].value();

          BlobConversions.blobToImageResult(currentState.blob).
          then(function (ir) {
            return filter(ir, r, g, b);
          }).
          then(imageResultToBlob).
          then(function (blob) {
            var newTempState = createState(blob);
            displayState(newTempState);
            destroyState(tempState);
            tempState = newTempState;
          });
        }

        return createPanel([
          { text: 'Back', onclick: cancel },
          { type: 'spacer', flex: 1 },
          {
            type: 'slider', label: 'R', name: 'r', minValue: 0,
            value: 1, maxValue: 2, ondragend: update, previewFilter: floatToPercent
          },
          {
            type: 'slider', label: 'G', name: 'g', minValue: 0,
            value: 1, maxValue: 2, ondragend: update, previewFilter: floatToPercent
          },
          {
            type: 'slider', label: 'B', name: 'b', minValue: 0,
            value: 1, maxValue: 2, ondragend: update, previewFilter: floatToPercent
          },
          { type: 'spacer', flex: 1 },
          { text: 'Apply', subtype: 'primary', onclick: applyTempState }
        ]).hide().on('show', function () {
          win.find('#r,#g,#b').value(1);
          disableUndoRedo();
        });
      }

      cropPanel = createPanel([
        { text: 'Back', onclick: cancel },
        { type: 'spacer', flex: 1 },
        { text: 'Apply', subtype: 'primary', onclick: crop }
      ]).hide().on('show hide', function (e) {
        imagePanel.toggleCropRect(e.type == 'show');
      }).on('show', disableUndoRedo);

      function toggleConstrain(e) {
        if (e.control.value() === true) {
          ratioW = height / width;
          ratioH = width / height;
        }
      }

      resizePanel = createPanel([
        { text: 'Back', onclick: cancel },
        { type: 'spacer', flex: 1 },
        { type: 'textbox', name: 'w', label: 'Width', size: 4, onkeyup: recalcSize },
        { type: 'textbox', name: 'h', label: 'Height', size: 4, onkeyup: recalcSize },
        { type: 'checkbox', name: 'constrain', text: 'Constrain proportions', checked: true, onchange: toggleConstrain },
        { type: 'spacer', flex: 1 },
        { text: 'Apply', subtype: 'primary', onclick: 'submit' }
      ]).hide().on('submit', function (e) {
        var width = parseInt(win.find('#w').value(), 10),
          height = parseInt(win.find('#h').value(), 10);

        e.preventDefault();

        action(ImageTransformations.resize, width, height)();
        cancel();
      }).on('show', disableUndoRedo);

      flipRotatePanel = createPanel([
        { text: 'Back', onclick: cancel },
        { type: 'spacer', flex: 1 },
        { icon: 'fliph', tooltip: 'Flip horizontally', onclick: tempAction(ImageTransformations.flip, 'h') },
        { icon: 'flipv', tooltip: 'Flip vertically', onclick: tempAction(ImageTransformations.flip, 'v') },
        { icon: 'rotateleft', tooltip: 'Rotate counterclockwise', onclick: tempAction(ImageTransformations.rotate, -90) },
        { icon: 'rotateright', tooltip: 'Rotate clockwise', onclick: tempAction(ImageTransformations.rotate, 90) },
        { type: 'spacer', flex: 1 },
        { text: 'Apply', subtype: 'primary', onclick: applyTempState }
      ]).hide().on('show', disableUndoRedo);

      invertPanel = createFilterPanel("Invert", ImageTransformations.invert);
      sharpenPanel = createFilterPanel("Sharpen", ImageTransformations.sharpen);
      embossPanel = createFilterPanel("Emboss", ImageTransformations.emboss);

      brightnessPanel = createVariableFilterPanel("Brightness", ImageTransformations.brightness, 0, -1, 1);
      huePanel = createVariableFilterPanel("Hue", ImageTransformations.hue, 180, 0, 360);
      saturatePanel = createVariableFilterPanel("Saturate", ImageTransformations.saturate, 0, -1, 1);
      contrastPanel = createVariableFilterPanel("Contrast", ImageTransformations.contrast, 0, -1, 1);
      grayscalePanel = createVariableFilterPanel("Grayscale", ImageTransformations.grayscale, 0, 0, 1);
      sepiaPanel = createVariableFilterPanel("Sepia", ImageTransformations.sepia, 0, 0, 1);
      colorizePanel = createRgbFilterPanel("Colorize", ImageTransformations.colorize);
      gammaPanel = createVariableFilterPanel("Gamma", ImageTransformations.gamma, 0, -1, 1);
      exposurePanel = createVariableFilterPanel("Exposure", ImageTransformations.exposure, 1, 0, 2);

      filtersPanel = createPanel([
        { text: 'Back', onclick: cancel },
        { type: 'spacer', flex: 1 },
        { text: 'hue', icon: 'hue', onclick: switchPanel(huePanel) },
        { text: 'saturate', icon: 'saturate', onclick: switchPanel(saturatePanel) },
        { text: 'sepia', icon: 'sepia', onclick: switchPanel(sepiaPanel) },
        { text: 'emboss', icon: 'emboss', onclick: switchPanel(embossPanel) },
        { text: 'exposure', icon: 'exposure', onclick: switchPanel(exposurePanel) },
        { type: 'spacer', flex: 1 }
      ]).hide();

      mainPanel = createPanel([
        { tooltip: 'Crop', icon: 'crop', onclick: switchPanel(cropPanel) },
        { tooltip: 'Resize', icon: 'resize2', onclick: switchPanel(resizePanel) },
        { tooltip: 'Orientation', icon: 'orientation', onclick: switchPanel(flipRotatePanel) },
        { tooltip: 'Brightness', icon: 'sun', onclick: switchPanel(brightnessPanel) },
        { tooltip: 'Sharpen', icon: 'sharpen', onclick: switchPanel(sharpenPanel) },
        { tooltip: 'Contrast', icon: 'contrast', onclick: switchPanel(contrastPanel) },
        { tooltip: 'Color levels', icon: 'drop', onclick: switchPanel(colorizePanel) },
        { tooltip: 'Gamma', icon: 'gamma', onclick: switchPanel(gammaPanel) },
        { tooltip: 'Invert', icon: 'invert', onclick: switchPanel(invertPanel) }
        //{text: 'More', onclick: switchPanel(filtersPanel)}
      ]);

      imagePanel = ImagePanel.create({
        flex: 1,
        imageSrc: currentState.url
      });

      sidePanel = Factory.create('Container', {
        layout: 'flex',
        direction: 'column',
        border: '0 1 0 0',
        padding: 5,
        spacing: 5,
        items: [
          { type: 'button', icon: 'undo', tooltip: 'Undo', name: 'undo', onclick: undo },
          { type: 'button', icon: 'redo', tooltip: 'Redo', name: 'redo', onclick: redo },
          { type: 'button', icon: 'zoomin', tooltip: 'Zoom in', onclick: zoomIn },
          { type: 'button', icon: 'zoomout', tooltip: 'Zoom out', onclick: zoomOut }
        ]
      });

      mainViewContainer = Factory.create('Container', {
        type: 'container',
        layout: 'flex',
        direction: 'row',
        align: 'stretch',
        flex: 1,
        items: [sidePanel, imagePanel]
      });

      panels = [
        mainPanel,
        cropPanel,
        resizePanel,
        flipRotatePanel,
        filtersPanel,
        invertPanel,
        brightnessPanel,
        huePanel,
        saturatePanel,
        contrastPanel,
        grayscalePanel,
        sepiaPanel,
        colorizePanel,
        sharpenPanel,
        embossPanel,
        gammaPanel,
        exposurePanel
      ];

      win = editor.windowManager.open({
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        minWidth: Math.min(DOMUtils.DOM.getViewPort().w, 800),
        minHeight: Math.min(DOMUtils.DOM.getViewPort().h, 650),
        title: 'Edit image',
        items: panels.concat([mainViewContainer]),
        buttons: [
          { text: 'Save', name: 'save', subtype: 'primary', onclick: save },
          { text: 'Cancel', onclick: 'close' }
        ]
      });

      win.on('close', function () {
        reject();
        destroyStates(undoStack.data);
        undoStack = null;
        tempState = null;
      });

      undoStack.add(currentState);
      updateButtonUndoStates();

      imagePanel.on('load', function () {
        width = imagePanel.imageSize().w;
        height = imagePanel.imageSize().h;
        ratioW = height / width;
        ratioH = width / height;

        win.find('#w').value(width);
        win.find('#h').value(height);
      });

      imagePanel.on('crop', crop);
    }

    function edit(editor, imageResult) {
      return new Promise(function (resolve, reject) {
        return imageResult.toBlob().then(function (blob) {
          open(editor, createState(blob), resolve, reject);
        });
      });
    }

    //edit('img/dogleft.jpg');

    return {
      edit: edit
    };
  }
);

/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.Plugin',
  [
    'ephox.imagetools.api.BlobConversions',
    'ephox.imagetools.api.ImageTransformations',
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.core.util.Delay',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.core.util.URI',
    'tinymce.plugins.imagetools.core.ImageSize',
    'tinymce.plugins.imagetools.core.Proxy',
    'tinymce.plugins.imagetools.ui.Dialog'
  ],
  function (
    BlobConversions, ImageTransformations, Env, PluginManager, Delay, Promise, Tools,
    URI, ImageSize, Proxy, Dialog
  ) {
    var plugin = function (editor) {
      var count = 0, imageUploadTimer, lastSelectedImage;

      if (!Env.fileApi) {
        return;
      }

      function displayError(error) {
        editor.notificationManager.open({
          text: error,
          type: 'error'
        });
      }

      function getSelectedImage() {
        return editor.selection.getNode();
      }

      function extractFilename(url) {
        var m = url.match(/\/([^\/\?]+)?\.(?:jpeg|jpg|png|gif)(?:\?|$)/i);
        if (m) {
          return editor.dom.encode(m[1]);
        }
        return null;
      }

      function createId() {
        return 'imagetools' + count++;
      }

      function isLocalImage(img) {
        var url = img.src;

        return url.indexOf('data:') === 0 || url.indexOf('blob:') === 0 || new URI(url).host === editor.documentBaseURI.host;
      }

      function isCorsImage(img) {
        return Tools.inArray(editor.settings.imagetools_cors_hosts, new URI(img.src).host) !== -1;
      }

      function getApiKey() {
        return editor.settings.api_key || editor.settings.imagetools_api_key;
      }

      function imageToBlob(img) {
        var src = img.src, apiKey;

        if (isCorsImage(img)) {
          return Proxy.getUrl(img.src, null);
        }

        if (!isLocalImage(img)) {
          src = editor.settings.imagetools_proxy;
          src += (src.indexOf('?') === -1 ? '?' : '&') + 'url=' + encodeURIComponent(img.src);
          apiKey = getApiKey();
          return Proxy.getUrl(src, apiKey);
        }

        return BlobConversions.imageToBlob(img);
      }

      function findSelectedBlob() {
        var blobInfo;
        blobInfo = editor.editorUpload.blobCache.getByUri(getSelectedImage().src);
        if (blobInfo) {
          return Promise.resolve(blobInfo.blob());
        }

        return imageToBlob(getSelectedImage());
      }

      function startTimedUpload() {
        imageUploadTimer = Delay.setEditorTimeout(editor, function () {
          editor.editorUpload.uploadImagesAuto();
        }, editor.settings.images_upload_timeout || 30000);
      }

      function cancelTimedUpload() {
        clearTimeout(imageUploadTimer);
      }

      function updateSelectedImage(ir, uploadImmediately) {
        return ir.toBlob().then(function (blob) {
          var uri, name, blobCache, blobInfo, selectedImage;

          blobCache = editor.editorUpload.blobCache;
          selectedImage = getSelectedImage();
          uri = selectedImage.src;

          if (editor.settings.images_reuse_filename) {
            blobInfo = blobCache.getByUri(uri);
            if (blobInfo) {
              uri = blobInfo.uri();
              name = blobInfo.name();
            } else {
              name = extractFilename(uri);
            }
          }

          blobInfo = blobCache.create({
            id: createId(),
            blob: blob,
            base64: ir.toBase64(),
            uri: uri,
            name: name
          });

          blobCache.add(blobInfo);

          editor.undoManager.transact(function () {
            function imageLoadedHandler() {
              editor.$(selectedImage).off('load', imageLoadedHandler);
              editor.nodeChanged();

              if (uploadImmediately) {
                editor.editorUpload.uploadImagesAuto();
              } else {
                cancelTimedUpload();
                startTimedUpload();
              }
            }

            editor.$(selectedImage).on('load', imageLoadedHandler);

            editor.$(selectedImage).attr({
              src: blobInfo.blobUri()
            }).removeAttr('data-mce-src');
          });

          return blobInfo;
        });
      }

      function selectedImageOperation(fn) {
        return function () {
          return editor._scanForImages().
            then(findSelectedBlob).
            then(BlobConversions.blobToImageResult).
            then(fn).
            then(updateSelectedImage, displayError);
        };
      }

      function rotate(angle) {
        return function () {
          return selectedImageOperation(function (imageResult) {
            var size = ImageSize.getImageSize(getSelectedImage());

            if (size) {
              ImageSize.setImageSize(getSelectedImage(), {
                w: size.h,
                h: size.w
              });
            }

            return ImageTransformations.rotate(imageResult, angle);
          })();
        };
      }

      function flip(axis) {
        return function () {
          return selectedImageOperation(function (imageResult) {
            return ImageTransformations.flip(imageResult, axis);
          })();
        };
      }

      function editImageDialog() {
        var img = getSelectedImage(), originalSize = ImageSize.getNaturalImageSize(img);

        var handleDialogBlob = function (blob) {
          return new Promise(function (resolve) {
            BlobConversions.blobToImage(blob).
              then(function (newImage) {
                var newSize = ImageSize.getNaturalImageSize(newImage);

                if (originalSize.w != newSize.w || originalSize.h != newSize.h) {
                  if (ImageSize.getImageSize(img)) {
                    ImageSize.setImageSize(img, newSize);
                  }
                }

                URL.revokeObjectURL(newImage.src);
                resolve(blob);
              });
          });
        };

        var openDialog = function (imageResult) {
          return Dialog.edit(editor, imageResult).then(handleDialogBlob).
            then(BlobConversions.blobToImageResult).
            then(function (imageResult) {
              return updateSelectedImage(imageResult, true);
            }, function () {
              // Close dialog
            });
        };

        findSelectedBlob().
          then(BlobConversions.blobToImageResult).
          then(openDialog, displayError);
      }

      function addButtons() {
        editor.addButton('rotateleft', {
          title: 'Rotate counterclockwise',
          cmd: 'mceImageRotateLeft'
        });

        editor.addButton('rotateright', {
          title: 'Rotate clockwise',
          cmd: 'mceImageRotateRight'
        });

        editor.addButton('flipv', {
          title: 'Flip vertically',
          cmd: 'mceImageFlipVertical'
        });

        editor.addButton('fliph', {
          title: 'Flip horizontally',
          cmd: 'mceImageFlipHorizontal'
        });

        editor.addButton('editimage', {
          title: 'Edit image',
          cmd: 'mceEditImage'
        });

        editor.addButton('imageoptions', {
          title: 'Image options',
          icon: 'options',
          cmd: 'mceImage'
        });

        /*
        editor.addButton('crop', {
          title: 'Crop',
          onclick: startCrop
        });
        */
      }

      function addEvents() {
        editor.on('NodeChange', function (e) {
          // If the last node we selected was an image
          // And had a source that doesn't match the current blob url
          // We need to attempt to upload it
          if (lastSelectedImage && lastSelectedImage.src != e.element.src) {
            cancelTimedUpload();
            editor.editorUpload.uploadImagesAuto();
            lastSelectedImage = undefined;
          }

          // Set up the lastSelectedImage
          if (isEditableImage(e.element)) {
            lastSelectedImage = e.element;
          }
        });
      }

      function isEditableImage(img) {
        var selectorMatched = editor.dom.is(img, 'img:not([data-mce-object],[data-mce-placeholder])');

        return selectorMatched && (isLocalImage(img) || isCorsImage(img) || editor.settings.imagetools_proxy);
      }

      function addToolbars() {
        var toolbarItems = editor.settings.imagetools_toolbar;

        if (!toolbarItems) {
          toolbarItems = 'rotateleft rotateright | flipv fliph | crop editimage imageoptions';
        }

        editor.addContextToolbar(
          isEditableImage,
          toolbarItems
        );
      }

      Tools.each({
        mceImageRotateLeft: rotate(-90),
        mceImageRotateRight: rotate(90),
        mceImageFlipVertical: flip('v'),
        mceImageFlipHorizontal: flip('h'),
        mceEditImage: editImageDialog
      }, function (fn, cmd) {
        editor.addCommand(cmd, fn);
      });

      addButtons();
      addToolbars();
      addEvents();
    };

    PluginManager.add('imagetools', plugin);

    return function () { };
  }
);

dem('tinymce.plugins.imagetools.Plugin')();
})();
