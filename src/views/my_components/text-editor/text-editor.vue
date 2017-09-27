<template>
    <div>
        <div>
            <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
        </div>
    </div>
</template>

<script>
// import tinymce from 'tinymce';
import tinymce from './tinymce.js';
export default {
    mounted () {
        tinymce.init({
            selector: '#tinymceEditer',
            branding: false,
            elementpath: false,
            height: 500,
            // language: 'zh_CN.GB2312',
            menubar: 'edit insert view format table tools',
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                'searchreplace visualblocks visualchars code fullscreen fullpage',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons paste textcolor colorpicker textpattern imagetools codesample'
            ],
            toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
            autosave_interval: '20s', // 自动保存间隔
            image_advtab: true,  // 显示图片高级选项
            table_default_styles: {
                width: '100%',
                borderCollapse: 'collapse'
            }
            // setup: function (editor) {
            //     editor.addButton('newnote', {
            //         icon: 'newdocument',
            //         tooltip: '新建笔记',
            //         onclick: newNote
            //     });
            // }
        });
    }
};
</script>

