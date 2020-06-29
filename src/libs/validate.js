/* eslint-disable no-useless-escape */
/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* 邮箱 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  return re.test(email);
}

/* ip地址 */
export function validateIP(ip) {
  const re = /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/;

  return re.test(ip);
}

/* 域名 */
export function validateDSN(dsn) {
  const re = /(http:\/\/|https:\/\/|[A-Za-z0-9]+[\-]?[A-Za-z0-9]+\.|[A-Za-z0-9]+\.)((\w|=|\?|\.|\/|&|-)*)$/;
  return re.test(dsn);
}

/* 电话号码 */
export function validateTel(tel) {
  const re = /^[1][3,4,5,7,8][0-9]{9}$/;
  return re.test(tel);
}

/* 非负整数 */
export function validateNumber(num) {
  const re = /^[1-9]+\d*$/;
  return re.test(num);
}

/* qq号 */
export function validateQQ(qq) {
  const re = /^[1-9][0-9]{4,10}$/gim;
  return re.test(qq);
}

/* 密码 */
export function validatePassword(pwd) {
  const re = /^(?![a-zA-Z]+$)(?![a-z\d]+$)(?![a-z!@#\$%]+$)(?![A-Z\d]+$)(?![A-Z!@#\$%]+$)(?![\d!@#\$%]+$)[a-zA-Z\d!@#\$%]+$/;
  return re.test(pwd);
}

// 密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串
export function levenshteinDistance(user, pwd) {
  var LevenshteinDistance;
  LevenshteinDistance = {
    str1: null,
    str3: null,
    matrix: null,
    isString(s) {
      return Object.prototype.toString.call(s) === "[object String]";
    },
    isNumber(s) {
      return Object.prototype.toString.call(s) === "[object Number]";
    },
    init(str1, str2) {
      if (!this.isString(str1) || !this.isString(str2)) return;

      this.str1 = str1;
      this.str2 = str2;

      str1.length &&
        str2.length &&
        this.createMatrix(str1.length + 1, str2.length + 1);
      this.matrix && this.initMatrix();

      return this;
    },
    get() {
      return (
        1 - this.getDistance() / Math.max(this.str1.length, this.str2.length)
      );
    },
    // 计算编辑距离
    getDistance: function() {
      var len1 = this.str1.length;
      var len2 = this.str2.length;

      if (!len1 || !len2) return Math.max(len1, len2);

      var str1 = this.str1.split("");
      var str2 = this.str2.split("");

      var i = 0;
      var j = 0;
      var temp = 0;
      while (i++ < len1) {
        j = 0;
        while (j++ < len2) {
          temp = str1[i - 1] === str2[j - 1] ? 0 : 1;
          this.matrix[i][j] = Math.min(
            this.matrix[i - 1][j] + 1,
            this.matrix[i][j - 1] + 1,
            this.matrix[i - 1][j - 1] + temp
          );
        }
      }
      return this.matrix[i - 1][j - 1];
    },
    /*
     * 初始化矩阵
     * 为第一行、第一列赋值
     */
    initMatrix: function() {
      var cols = this.matrix[0].length;
      var rows = this.matrix.length;
      var l = Math.max(cols, rows);
      while (l--) {
        cols - 1 >= l && (this.matrix[0][l] = l);
        rows - 1 >= l && (this.matrix[l][0] = l);
      }
    },
    /*
     * 创建矩阵
     * n:行
     * m:列
     */
    createMatrix: function(n, m) {
      if (!this.isNumber(n) || !this.isNumber(m) || n < 1 || m < 1) return;

      this.matrix = new Array(n);
      var i = 0;
      while (i < n) this.matrix[i++] = new Array(m);
    }
  };
  return LevenshteinDistance.init(pwd, user).get() > 0.5;
}

// 密码不得包含和用户名完整字符串，大小写变位，形似变换的字符串
export function similarityString(user, pwd) {
  // 不得包含和用户名完整字符串，大小写变位的字符串
  if (
    pwd.indexOf(user) !== -1 ||
    pwd.toLocaleUpperCase().indexOf(user.toLocaleUpperCase()) !== -1
  ) {
    return true;
  }
  return false;
}

// 密码避免键盘排序
export function keyboardSortPassword(pwd) {
  pwd = pwd.toLocaleLowerCase();
  var i = 0;
  var arr = [
    "1234567890",
    "qwertyuiop[]",
    "|asdfghjklzxcvbnm",
    "~!@#$%^&*()_+"
  ];
  for (i = 0; i < arr.length; i++) {
    if (arr[i].indexOf(pwd) !== -1) {
      break;
    }
  }
  if (i < arr.length) {
    return true;
  }
  return false;
}

// 检测是否为外链
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 检测是否为演练展示
export function isExhibit(path) {
  return path.indexOf("/exhibit") > -1;
}

/* 检测是否为正整数及是否在规定范围内 */
export function isPositiveInteger(number, superLimit = 9999, lowerLimit = 0) {
  return (
    number <= superLimit && number >= lowerLimit && number.indexOf(".") === -1
  );
}
