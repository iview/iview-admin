<style lang="less">
    @import '../../../styles/common.less';
    @import 'markdown-editor.less';
</style>


<template>
    <div>
        <Row class="margin-top-20">
            <Col span="16" offset="4">
                <Card>
                    <textarea  id="iview_admin_markdown_editor" style="display:none;"></textarea>                
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import SimpleMDE from 'SimpleMDE';
export default {
    data () {
        return {
            editorContent: '',
            simplemde: {},
            simplemde_view: {}
        };
    },
    mounted () {
        let vm = this;
        let simplemde = new SimpleMDE({
            element: document.getElementById('iview_admin_markdown_editor')
        });
        simplemde.codemirror.on('change', function () {
            vm.editorContent = simplemde.value();
        });
    }
};
</script>
