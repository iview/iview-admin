<template>
    <Row class="item">
        <Col span="2" class="height-100">
            <Row type="flex" justify="center" align="middle" class="height-100">
                <Checkbox v-model="todoitem"></Checkbox>
            </Row>
        </Col>
        <Col span="22" class="height-100">
            <Row type="flex" justify="start" align="middle" class="height-100">
                <p @click="handleHasDid" :class="{hasDid: todoitem}">{{ content }}</p>
            </Row>
        </Col>
        <!-- <Col span="4" class="height-100">
            <Row type="flex" justify="center" align="middle" class="infor-icon-row height-100">
                <Icon @click.native="showItemInfor" type="information-circled" size="20"></Icon>
            </Row>
        </Col> -->
    </Row>
</template>

<script>
export default {
    name: 'toDoListItem',
    data () {
        return {
            todoitem: false
        }
    },
    props: {
        content: String
    },
    methods: {
        handleHasDid () {
            this.todoitem = !this.todoitem;
        },
        // showItemInfor () {
        //     console.log(123)
        // }
    }
}
</script>

<style scoped>
.item{
    height: 36px;
}
span{
    display: inline-block;
    width: 100%;
}
p{
    word-break:keep-all; 
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    cursor: pointer;
}
.hasDid{
    text-decoration: line-through;
    color: gray;
    font-weight: 100;
}
.height-100{
    height: 100%;
}
.infor-icon-row{
    color: #c8c8c8;
}
</style>
