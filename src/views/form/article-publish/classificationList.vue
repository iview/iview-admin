<template>
    <div>
        
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
                name: 'Vue开发实战',
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
