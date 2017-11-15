<template>
    <div class="user-dropdown-menu-con">
        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                    <span class="main-user-name">{{ userName }}</span>
                    <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'userInfo'
};
</script>
