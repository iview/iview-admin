<template>
    <div>
        <Checkbox >{{ checkText }}</Checkbox>
    </div>
</template>

<script>
export default {
    name: 'classificationList',
    data () {
        return {
            classification: []
        };
    },
    mounted () {
        this.classification = [
            {
                name: 'Vue实例',
                children: [
                    {
                        name: '数据与方法'
                    },
                    {
                        name: '生命周期'
                    }
                ]
            },
            {
                name: 'Class与Style绑定',
                children: [
                    {
                        name: '绑定HTML class',
                        children: [
                            {
                                name: '对象语法'
                            },
                            {
                                name: '数组语法'
                            },
                            {
                                name: '用在组件上'
                            }
                        ]
                    },
                    {
                        name: '生命周期'
                    }
                ]
            },
            {
                name: '模板语法',
                children: [
                    {
                        name: '插值'
                    },
                    {
                        name: '指令'
                    },
                    {
                        name: '缩写'
                    }
                ]
            }
        ];
    }
};
</script>
