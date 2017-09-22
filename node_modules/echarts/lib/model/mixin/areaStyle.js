
    module.exports = {
        getAreaStyle: require('./makeStyleMapper')(
            [
                ['fill', 'color'],
                ['shadowBlur'],
                ['shadowOffsetX'],
                ['shadowOffsetY'],
                ['opacity'],
                ['shadowColor']
            ]
        )
    };
