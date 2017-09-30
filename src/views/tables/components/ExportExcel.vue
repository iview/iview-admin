<template>
    <div>
        <a id="ExportExcelHiddenComponentForDownload"></a>
        <Button type="primary" @click="handleExportExcel">下载</Button>
    </div>
</template>

<script>
export default {
    name: 'ExportExcel',
    props: {
        table: Object
    },
    methods: {
        handleExportExcel () {
            this.$emit('exportExcel');
            // transform(this.table);
        }
    }
};
</script>
