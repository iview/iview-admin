let util = {

};

util.getPathObjByName = function(vm, name) {
    let pathObj = vm.$store.state.routers.filter( (item) => {
        if(item.children.length<=1){
            return item.name === name;
        } else {
            let i = 0,
                childArr = item.children,
                len = childArr.length;
            while(i < len){
                if(childArr[i].name === name){
                    return true;
                }
                i ++;
            }
            return false;
        }
    })[0];
    return pathObj;
};

util.setCurrentPath = function(vm, name) {
    let currentPathObj = vm.$store.state.routers.filter( (item) => {
        if(item.children.length<=1){
            return item.children[0].name === name;
        } else {
            let i = 0,
                childArr = item.children,
                len = childArr.length;
            while(i < len){
                if(childArr[i].name === name){
                    return true;
                }
                i ++;
            }
            return false;
        }
    })[0];
    let currentPathArr = [];
    if(currentPathObj.children.length<=1 && currentPathObj.name === 'home'){
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ];
    }else if(currentPathObj.children.length<=1 && currentPathObj.name !== 'home') {
        currentPathArr = [
            {
                title: '首页',
                path: '/home',
                name: 'home_index'
            },
            {
                title: currentPathObj.title,
                path: '',
                name: name,
            }
        ];
    } else {
        let childObj = currentPathObj.children.filter( (child) => {
            return child.name === name;
        })[0];
        currentPathArr = [
            {
                title: '首页',
                path: '/home',
                name: 'home_index'
            },
            {
                title: currentPathObj.title,
                path: '',
                name: currentPathObj.name,
            },
            {
                title: childObj.title,
                path: currentPathObj.path+'/'+childObj.path,
                name: name,
            }
        ];
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

export default util;