/**
 * zrender: 生成唯一id
 *
 * @author errorrik (errorrik@gmail.com)
 */


    var idStart = 0x0907;

    module.exports = function () {
        return idStart++;
    };

