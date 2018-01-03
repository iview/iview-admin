<style lang="less">
    @import '../../../styles/common.less';
    @import 'markdown-editor.less';
</style>


<template>
    <div>
        <Row class="margin-top-20">
            <Col span="16" offset="4">
                <div class="markdown-con">
                    <Card>
                        <textarea  id="iview_admin_markdown_editor" style="display:none;"></textarea>                
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import './simplemde.min.css';
export default {
    name: 'markdown-editor',
    mounted () {
        new SimpleMDE({
            element: document.getElementById('iview_admin_markdown_editor'),
            toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'heading-smaller', 'heading-bigger', 'heading-1', 'heading-2', 'heading-3', '|', 'code', 'quote', 'unordered-list', 'clean-block', '|', 'link', 'image', 'table', 'horizontal-rule', '|', 'preview', 'guide']
        });
    }
};
</script>
