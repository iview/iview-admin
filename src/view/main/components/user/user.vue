<template>
  <div class="user-avator-dropdown">
    <Dropdown>
      <Avatar :src="userAvator"/>
      <Icon :size="12" type="arrow-down-b"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem>退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
export default {
  name: 'user',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  }
}
</script>
