<style lang="less">
    @import '../../../styles/common.less';
    @import './image-editor.less';
</style>

<template>
    <div class="image-editor">
        <Row :gutter="10">
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="qr-scanner"></Icon>
                        基础实例
                    </p>
                    <Row :gutter="10">
                        <Col span="14" class="image-editor-con1">
                            <div class="cropper">
                                <img id="cropimg1" alt="">
                            </div>
                        </Col>
                        <Col span="10" class="image-editor-con1">
                            <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                                <div id="preview1"></div>
                            </Row>
                            <div class="image-editor-con1-btn-con margin-top-10">
                                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                                <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                                <span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>
                            </div>
                            <Modal v-model="option1.showCropedImage">
                                <p slot="header">预览裁剪之后的图片</p>
                                <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;">
                            </Modal>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span="12">
                <Card>
                    <p slot="title">
                        <Icon type="android-options"></Icon>
                        获取图片数据
                    </p>
                    <Row :gutter="10">
                        <Col span="14" class="image-editor-con2">
                            <div class="cropper">
                                <img id="cropimg2" src="../../../images/cropper-test.png" alt="">
                            </div>
                        </Col>
                        <Col span="10" class="image-editor-con2">
                            <p><b>x:</b>{{ cropdata2.x }}</p>
                            <p><b>y:</b>{{ cropdata2.y }}</p>
                            <p><b>width:</b>{{ cropdata2.w }}</p>
                            <p><b>heigh:</b>{{ cropdata2.h }}</p>
                            <p><b>deg:</b>{{ cropdata2.deg }}</p>
                            <p><b>scaleX:</b>{{ cropdata2.scaleX }}</p>
                            <p><b>scaleY:</b>{{ cropdata2.scaleY }}</p>
                            <div class="margin-top-10" style="text-align: center;">
                                <ButtonGroup>
                                    <Button @click="cropper2.rotate(-90)" type="primary"><Icon :size="14" type="arrow-return-left"></Icon></Button>
                                    <Button @click="cropper2.rotate(90)" type="primary"><Icon :size="14" type="arrow-return-right"></Icon></Button>
                                    <Button @click="cropper2.zoom(0.1)" type="primary"><Icon :size="14" type="plus-round"></Icon></Button>
                                    <Button @click="cropper2.zoom(-0.1)" type="primary"><Icon :size="14" type="minus-round"></Icon></Button>
                                    <Button @click="cropper2.scaleX(-cropper2.getData().scaleX)" type="primary"><Icon :size="14" type="android-more-horizontal"></Icon></Button>
                                    <Button @click="cropper2.scaleY(-cropper2.getData().scaleY)" type="primary"><Icon :size="14" type="android-more-vertical"></Icon></Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Card>
                <p slot="title">
                    <Icon type="levels"></Icon>
                    综合实例
                </p>
                <Row :gutter="10">
                    <Col span="12" class="image-editor-con3">
                        <div class="cropper3">
                            <img id="cropimg3" src="../../../images/cropper-test.png" alt="">
                        </div>
                    </Col>
                    <Col span="6" class="image-editor-con3">
                        <Row>
                            <Col span="24" class="image-editor-con3-btn-box">
                                <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange3" id="fileinput3" class="fileinput" />
                                <label class="filelabel filelabel3" for="fileinput3"><Icon type="image"></Icon>&nbsp;选择图片</label>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="开始裁剪" placement="bottom">
                                    <Button @click="cropper3.crop()" type="primary"><Icon :size="18" type="checkmark-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="取消裁剪" placement="bottom">
                                    <Button @click="cropper3.clear()" type="primary"><Icon :size="18" type="close-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="不可用" placement="bottom">
                                    <Button @click="cropper3.disable()" type="primary"><Icon :size="18" type="android-lock"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="可用" placement="bottom">
                                    <Button @click="cropper3.enable()" type="primary"><Icon :size="18" type="android-unlock"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="放大" placement="bottom">
                                    <Button @click="handlezooml" type="primary"><Icon :size="16" type="plus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="缩小" placement="bottom">
                                    <Button @click="handlezooms" type="primary"><Icon :size="16" type="minus-round"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="左转" placement="bottom">
                                    <Button @click="handlerotatel" type="primary"><Icon :size="16" type="arrow-return-left"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右转" placement="bottom">
                                    <Button @click="handlerotater" type="primary"><Icon :size="16" type="arrow-return-right"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10" :gutter="10">
                            <Col span="24" class="crop3-btn-box">
                                <Tooltip content="左移" placement="bottom">
                                    <Button @click="handlemovel" type="primary"><Icon :size="18" type="android-arrow-back"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="右移" placement="bottom">
                                    <Button @click="handlemover" type="primary"><Icon :size="18" type="android-arrow-forward"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="上移" placement="bottom">
                                    <Button @click="handlemoveu" type="primary"><Icon :size="18" type="android-arrow-up"></Icon></Button>
                                </Tooltip>
                                <Tooltip content="下移" placement="bottom">
                                    <Button @click="handlemoved" type="primary"><Icon :size="18" type="android-arrow-down"></Icon></Button>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="24" class="crop3-btn-box">
                                <Button @click="handlecrop3" style="width: 190px;" icon="crop" type="primary">裁剪</Button>
                            </Col>
                            <Modal v-model="option3.showCropedImage">
                                <p slot="header">预览裁剪之后的图片</p>
                                <img :src="option3.cropedImg" alt="" v-if="option3.showCropedImage" style="width: 100%;">
                            </Modal>
                        </Row>
                    </Col>
                    <Col span="6">
                        <Row type="flex" justify="center" align="middle" class="image-editor-con3-preview-con">
                            <div id="preview3"></div>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import Cropper from 'cropperjs';
import './cropper.min.css';
export default {
    name: 'image-editor',
    data () {
        return {
            cropper1: {},
            option1: {
                showCropedImage: false,
                cropedImg: ''
            },
            cropper2: {},
            cropdata2: {
                x: '',
                y: '',
                w: '',
                h: '',
                deg: '',
                scaleX: '',
                scaleY: ''
            },
            cropper3: {},
            option3: {
                showCropedImage: false,
                cropedImg: ''
            }
        };
    },
    methods: {
        handleChange1 (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper1.replace(reader.result);
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        handlecrop1 () {
            let file = this.cropper1.getCroppedCanvas().toDataURL();
            this.option1.cropedImg = file;
            this.option1.showCropedImage = true;
        },
        handlerotatel () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.rotate(-30);
            }
        },
        handlerotater () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.rotate(90);
            }
        },
        handlezooml () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.zoom(0.1);
            }
        },
        handlezooms () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.zoom(-0.1);
            }
        },
        handlescalex () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.scaleX(-this.cropper3.getData().scaleX);
            }
        },
        handlescaley () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.scaleY(-this.cropper3.getData().scaleY);
            }
        },
        handleChange3 (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper3.replace(reader.result, true); // 这里必须设置true这个参数，否则旋转会有bug
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        handlemovel () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(-10, 0);
            }
        },
        handlemover () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(10, 0);
            }
        },
        handlemoveu () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(0, -10);
            }
        },
        handlemoved () {
            if (document.getElementById('fileinput3').files[0]) {
                this.cropper3.move(0, 10);
            }
        },
        handlecrop3 () {
            let file = this.cropper3.getCroppedCanvas().toDataURL();
            this.option3.cropedImg = file;
            this.option3.showCropedImage = true;
        }
    },
    mounted () {
        let img1 = document.getElementById('cropimg1');
        this.cropper1 = new Cropper(img1, {
            dragMode: 'move',
            preview: '#preview1',
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false
        });

        let img2 = document.getElementById('cropimg2');
        this.cropper2 = new Cropper(img2, {
            dragMode: 'move',
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false
        });
        img2.addEventListener('crop', (e) => {
            this.cropdata2.x = parseInt(e.detail.x);
            this.cropdata2.y = parseInt(e.detail.y);
            this.cropdata2.w = parseInt(e.detail.width);
            this.cropdata2.h = parseInt(e.detail.height);
            this.cropdata2.deg = parseInt(e.detail.rotate);
            this.cropdata2.scaleX = parseInt(e.detail.scaleX);
            this.cropdata2.scaleY = parseInt(e.detail.scaleY);
        });

        let img3 = document.getElementById('cropimg3');
        this.cropper3 = new Cropper(img3, {
            dragMode: 'move',
            preview: '#preview3',
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false
        });
    }
};
</script>

<style>

</style>
