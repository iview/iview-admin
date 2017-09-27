<template>
    <Dropdown trigger="click" @on-click="setTheme">
        <a href="javascript:void(0)">
            更换主题
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
                this.$store.commit('changeTheme', 'dark');
                localStorage.menuTheme = 'dark';
            } else {
                this.$store.commit('changeTheme', 'light');
                localStorage.menuTheme = 'light';
            }
            let path = '';
            let themeLink = document.querySelector('link[name="theme"]');
            localStorage.theme = mainTheme;
            if (mainTheme !== 'b') {
                path = '/src/styles/' + mainTheme + '.css';
            } else {
                path = '';
            }
            themeLink.setAttribute('href', path);
        }
    }
};
</script>
