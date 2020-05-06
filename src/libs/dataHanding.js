/**
 * js前端数据处理
 * Created by：simon小讴（https://github.com/simon9124）
 */

import { Message } from "iview";

/**
 * 按照数组['','',''...]的指定规则，转换成3层的级联选择器
 * ["DM35S-3/28","DM35S-6/14","DM35R-3/28","DM35R-6/33"] => ["DM35","S","3/28"]
 * @param {Array} array 数组
 */
export function listToCascader(array) {
  let cascaderValue = [];
  let casList1 = [];
  let casList2 = [];

  // 转成 key-value 对象
  array.forEach(string => {
    // casList1：取前4位 + 去重 -> 最外层
    casList1.push(string.substring(0, 4));
    casList1 = Array.from(new Set(casList1));

    // casList2：按 "-" 分割 + 去重 -> 第二层
    casList2.push(string.split("-")[0]);
    casList2 = Array.from(new Set(casList2));

    // data：第三层（最内层）
  });

  // 塞入数据
  casList1.forEach(string1 => {
    const casList2Value = [];
    casList2.forEach(string2 => {
      const casList3Value = [];
      array.forEach(string3 => {
        string3.indexOf(string2) > -1 &&
          casList3Value.push({
            value: string3,
            label: string3
          });
      });
      string2.indexOf(string1) > -1 &&
        casList2Value.push({
          value: string2,
          label: string2,
          children: casList3Value
        });
    });
    cascaderValue.push({
      value: string1,
      label: string1,
      children: casList2Value
    });
  });

  return cascaderValue;
}

/**
 * 将菜单接口数据转换成iview树形数据结构(2层)
 *  =>
 * @param {Array} array 数组
 */
export const computedMenuData = array => {
  let treeData = [];

  // 外层节点
  array.forEach(menu => {
    menu.parenetId === "root" &&
      treeData.push({
        id: menu.id,
        name: menu.name,
        title: menu.title,
        url: menu.url,
        path: menu.path,
        sort: menu.sort,
        parenetId: menu.parenetId,
        parenetPath: menu.parenetPath,
        showLevel: menu.showLevel,
        isOutSide: menu.isOutSide,
        status: menu.status,
        description: menu.description,
        ico: menu.ico,
        children: []
      });
  });

  // 内层节点：递归
  const handleRecurrence = recurrenceData => {
    recurrenceData.forEach(data => {
      array.forEach(menu => {
        data.id === menu.parenetId &&
          data.children.push({
            id: menu.id,
            name: menu.name,
            title: menu.title,
            url: menu.url,
            path: menu.path,
            sort: menu.sort,
            parenetId: menu.parenetId,
            parenetPath: menu.parenetPath,
            showLevel: menu.showLevel,
            isOutSide: menu.isOutSide,
            status: menu.status,
            description: menu.description,
            ico: menu.ico,
            children: []
          });
      });
      // console.log(data);
      handleRecurrence(data.children);
    });
  };
  handleRecurrence(treeData);

  // 外层第一项若有内层，则展开
  treeData.length > 0 && (treeData[0].expand = true);
  return treeData;
};

/**
 * 按照对象数组[{},{},{}...]的某个object key，进行数组排序
 * @param {String} key 要排序的key
 * @param {String} sort 正序/倒序：asc/desc，默认为asc
 */
export function arraySort(key, sort) {
  return function(a, b) {
    if (sort === "asc" || sort === undefined || sort === "") {
      // 正序：a[key] > b[key]
      if (a[key] > b[key]) return 1;
      else if (a[key] < b[key]) return -1;
      else return 0;
    } else if (sort === "desc") {
      // 倒序：a[key] < b[key]
      if (a[key] < b[key]) return 1;
      else if (a[key] > b[key]) return -1;
      else return 0;
    }
  };
}

/**
 * 根据数组[{},{},{}...]中某个对象的key的value，查询该对象另一个key的value
 * @param {Array} array 数组
 * @param {String} queryKey 要查询的key
 * @param {String} queryValue 要查询的value
 * @param {String} getKey 要获取的key
 */
export function getValueByKey(array, queryKey, queryValue, getKey) {
  var getValue = "";
  array.forEach(item => {
    item[queryKey].toString() === queryValue && (getValue = item[getKey]);
  });
  return getValue;
}

/**
 * 上传excel多级表头使用
 * 根据上传后的原始数据，给表头最后一行（若被合并则同列向上找）每个label绑定key
 * @param {Object} tableHeader 表头原始数据
 */
export function setKeyFromTableHeader(tableHeader) {
  // 1.将表头对象放进数组
  var array = []; // 要放进的数组
  var arrayCopy = []; // copy这个数组
  Object.keys(tableHeader).forEach((key, i) => {
    array.push(key);
    arrayCopy.push(key);
  });
  // console.log(array);
  // console.log(arrayCopy);
  // 2.逆循环两个数组，取出双字母索引和单字母索引的最大值，形成新的数组
  var arrayTargetSingle = []; // 单字母excel索引list：A1、B1...
  var arrayTargetBiliteral = []; // 双字母excel索引list：AA1、AB1...
  var regex = /^[A-Z]+$/; // 正则判断大写字母
  for (var i = array.length - 1; i >= 0; i--) {
    var numBiliteral = 0;
    var numSingle = 0;
    for (var _i = arrayCopy.length - 1; _i >= 0; _i--) {
      // 双字母excel索引
      if (
        array[i].slice(0, 2) === arrayCopy[_i].slice(0, 2) &&
        regex.test(array[i][1])
      ) {
        numBiliteral++;
        if (
          numBiliteral > 0 &&
          array[i].slice(0, 1) !== "!" &&
          arrayTargetBiliteral.every(
            item => item.slice(0, 2) !== array[i].slice(0, 2)
          )
        ) {
          arrayTargetBiliteral.push(array[i]);
        }
      }
      // 单字母excel索引
      if (
        array[i].slice(0, 1) === arrayCopy[_i].slice(0, 1) &&
        !regex.test(array[i][1])
      ) {
        numSingle++;
        if (
          numSingle > 0 &&
          array[i].slice(0, 1) !== "!" &&
          arrayTargetSingle.every(
            item => item.slice(0, 1) !== array[i].slice(0, 1)
          )
        ) {
          arrayTargetSingle.push(array[i]);
        }
      }
    }
  }
  // 3.处理新的数组
  arrayTargetBiliteral = [...new Set(arrayTargetBiliteral)].sort();
  arrayTargetSingle = [...new Set(arrayTargetSingle)].sort();
  // console.log(arrayTargetBiliteral);
  // console.log(arrayTargetSingle);
  return arrayTargetSingle.concat(arrayTargetBiliteral);
}

/**
 * 封装数组[{},{},{}...]，根据条件求某个对象的key的和
 * @param {Array} array 数组
 * @param {String} key 要查询的key
 * @param {Function} condition 要根据的条件
 */
export const addValueByKey = (array, key, condition = true) => {
  var addValue = 0;
  array.forEach(item => {
    condition && (addValue += Number(item[key]));
  });
  return addValue;
};

/**
 * 封装回调函数，根据resultStatus的值弹出$Message提示，执行相应的回调函数
 * @param {Number} resultStatus 请求返回的data.status
 * @param {String} message 请求成功时，$Message要弹出的字段
 * @param {Function} success 请求成功时的回调函数
 * @param {Function} error 请求失败时的回调函数
 */
export const resultCallback = (resultStatus, message, success, error) => {
  if (resultStatus === 200) {
    Message.success({ content: message });
    return success.call();
  } else {
    return error.call();
  }
};
