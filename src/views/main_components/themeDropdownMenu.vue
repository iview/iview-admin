<template>
    <Dropdown trigger="click" @on-click="setTheme">
        <a href="javascript:void(0)">
            <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="paintbucket"></Icon>
            <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in themeList" :key="index" :name="item.name">
                <Row type="flex" justify="center" align="middle">
                    <span style="margin-right:10px;"><Icon :size="20" :type="item.name.substr(0, 1) !== 'b' ? 'happy-outline' : 'happy'" :color="item.menu"/></span>
                    <span><Icon :size="22" type="record" :color="item.element"/></span>
                </Row>
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'themeDropdownMenu',
    data () {
        return {
            themeList: [
                {
                    name: 'black_b',
                    menu: '#495060',
                    element: '#2d8cf0'
                },
                {
                    name: 'black_g',
                    menu: '#495060',
                    element: '#64d572'
                },
                {
                    name: 'black_y',
                    menu: '#495060',
                    element: '#ffd572'
                },
                {
                    name: 'black_r',
                    menu: '#495060',
                    element: '#f25e43'
                },
                {
                    name: 'light_b',
                    menu: '#495060',
                    element: '#2d8cf0'
                },
                {
                    name: 'light_g',
                    menu: '#495060',
                    element: '#64d572'
                },
                {
                    name: 'light_y',
                    menu: '#495060',
                    element: '#ffd572'
                },
                {
                    name: 'light_r',
                    menu: '#495060',
                    element: '#f25e43'
                }
            ]
        };
    },
    methods: {
        setTheme (themeFile) {
            let menuTheme = themeFile.substr(0, 1);
            let mainTheme = themeFile.substr(-1, 1);
            if (menuTheme === 'b') {
                // 黑色菜单
                this.$store.commit('changeMenuTheme', 'dark');
                menuTheme = 'dark';
            } else {
                this.$store.commit('changeMenuTheme', 'light');
                menuTheme = 'light';
            }
            let path = '';
            let themeLink = document.querySelector('link[name="theme"]');
            let userName = Cookies.get('user');
            if (localStorage.theme) {
                let themeList = JSON.parse(localStorage.theme);
                let index = 0;
                let hasThisUser = themeList.some((item, i) => {
                    if (item.userName === userName) {
                        index = i;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (hasThisUser) {
                    themeList[index].mainTheme = mainTheme;
                    themeList[index].menuTheme = menuTheme;
                } else {
                    themeList.push({
                        userName: userName,
                        mainTheme: mainTheme,
                        menuTheme: menuTheme
                    });
                }
                localStorage.theme = JSON.stringify(themeList);
            } else {
                localStorage.theme = JSON.stringify([{
                    userName: userName,
                    mainTheme: mainTheme,
                    menuTheme: menuTheme
                }]);
            }
            if (mainTheme !== 'b') {
                path = 'dist/' + mainTheme + '.css';
            } else {
                path = '';
            }
            themeLink.setAttribute('href', path);
        }
    }
};
</script>
