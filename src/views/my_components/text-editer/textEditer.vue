<template>
    <div>
        <Card shadow>
        <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        </Card>
    </div>
</template>

<script>
import tinymce from 'tinymce';
export default {
    mounted () {
        this.$nextTick(() => {
            var height = document.body.offsetHeight - 300;
            tinymce.init({
                selector: '#tinymceEditer',
                branding: false,
                elementpath: false,
                height: height,
                language: 'zh_CN.GB2312',
                menubar: 'edit insert view format table tools',
                theme: 'modern',
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                    'searchreplace visualblocks visualchars code fullscreen fullpage',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                ],
                toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                autosave_interval: '20s',
                image_advtab: true,
                table_default_styles: {
                    width: '100%',
                    borderCollapse: 'collapse'
                }
            });
        });
    },
    destroyed () {
        tinymce.get('tinymceEditer').destroy();
    }
};
</script>

<style>

</style>
