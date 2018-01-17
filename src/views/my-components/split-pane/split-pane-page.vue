<template>
    <div>
        <Card :padding="0">
            <div class="split-pane-con">
                <split-pane :style="{height: '100%'}" right min="100px" :max="80" @on-trigger-moving="handleMoving" direction="horizontal" v-model="triggerOffset">
                    <div slot="left" style="height: 100%;">
                        <split-pane :style="{height: '100%'}" direction="vertical" v-model="triggerOffsetV">
                            <div class="introduce-left-con" slot="top" style="background: #EDE3A0;height: 100%;padding: 30px;">
                                <h4>- 该组件可以拖动修改左右尺寸，还可以绑定v-model来设置，如设置v-model="40"即左侧40%，右侧60%，也可设置'200px'像素值</h4>
                                <h4>- 设置right属性则v-model设置的值为右侧（下册）的宽度（高度）</h4>
                                <h4>- 可设置最小和最大距离，如:min="80"即向右拖动到80%处就不能再拖动</h4>
                                <h4>- 可绑定事件@on-trigger-moving，回调函数的返回值是鼠标事件对象，同时该对象还包括两个我们自定义的变量，即atMax和atMin，即此时是否是在最大或最小距离处，类型是Boolean。来拖动右边的trigger看看吧。</h4>
                                <h4 style="margin-bottom: 10px;">- 可使用slot="trigger"自定义拖动触发器，但有三个注意点:</h4>
                                <h5>-- 样式需要设置position: absolute;</h5>
                                <h5>-- 需要给trigger绑定mousedown事件，绑定的方法调用this.$refs.pane.handleMousedow(e)，e为mousedown事件的事件对象</h5>
                                <h5>-- 给trigger添加:style="{width: offset + '%'}"，这里的offset是通过v-model给split-pane组件绑定的值</h5>
                                <h4>- 其他api请看源码</h4>
                            </div>
                            <div slot="bottom" style="background: #A2EDB6;height: 100%;">
                                <split-pane ref="pane" :style="{height: '100%'}" direction="horizontal" v-model="triggerOffsetMin">
                                    <div slot="left" style="background: #EDACE2;height: 100%;"></div>
                                    <div slot="trigger" 
                                        :style="{left: triggerOffsetMin + '%'}" 
                                        @mousedown="handleMousedown"
                                        class="custom-trigger"></div>
                                    <div slot="right" style="background: #A2EDB6;height: 100%;"></div>
                                </split-pane>
                            </div>
                        </split-pane>
                    </div>
                    <div class="split-pane-right-con" slot="right" style="background: #8FB5ED;height: 100%;">
                        <p>是否是在最小距离处： {{ atMin }}</p>
                        <p>是否是在最大距离处： {{ atMax }}</p>
                    </div>
                </split-pane>
            </div>
        </Card>
    </div>
</template>
<script>
import splitPane from './split-pane';
export default {
    name: 'split-pane-page',
    components: {
        splitPane
    },
    data () {
        return {
            triggerOffset: '300px',
            triggerOffsetV: 70,
            triggerOffsetMin: 40,
            atMax: false,
            atMin: false
        };
    },
    methods: {
        handleMousedown (e) {
            this.$refs.pane.handleMousedown(e);
        },
        handleMoving (e) {
            this.atMax = e.atMax;
            this.atMin = e.atMin;
        }
    }
};
</script>
<style lang="less" scoped>
.split-pane-con{
    width: 100%;
    height: 89vh;
}
.custom-trigger{
    position: absolute;
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 50%;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, .1) , 2px 2px 10px 2px rgba(0, 0, 0, .2) inset;
    border: 1px solid #c3c3c3;
    cursor: pointer;
}
.introduce-left-con h4{
    margin-bottom: 20px;
}
.introduce-left-con h5{
    margin-bottom: 10px;
    margin-left: 20px;
}
.split-pane-right-con{
    padding: 30px;
}
.split-pane-right-con p{
    font-size: 26px;
    font-weight: 700;
    color: white;
}
</style>

