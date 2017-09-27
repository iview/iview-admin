<template>
    <Dropdown trigger="click">
        <a href="javascript:void(0)">
            更换主题
            <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
            <DropdownItem v-for="(item, index) in themeList" :key="index" :name="item.name">
                <Row type="flex" justify="center" align="middle">
                    <span style="margin-right:10px;"><Icon :size="20" type="contrast" :color="item.menu"/></span>
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
                }
            ]
        };
    }
};
</script>
