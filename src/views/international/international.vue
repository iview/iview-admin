<style lang="less">
    @import './international.less';
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col span="4">
                <Card>
                    <p slot="title">
                        <Icon type="ios-toggle"></Icon>
                        {{ $t('switchLangTitle') }}
                    </p>
                    <Row type="flex" justify="center" align="middle" class="switch-language-row1">
                        <RadioGroup :value="lang" @on-change="handleSwitch" vertical>
                            <Radio label="zh-CN">
                                <span>中文简体</span>
                            </Radio>
                            <Radio label="zh-TW">
                                <span>中文繁體</span>
                            </Radio>
                            <Radio label="en-US">
                                <span>English</span>
                            </Radio>
                        </RadioGroup>
                        <p class="switch-language-tip">{{ $t('tip') }}</p>
                    </Row>
                </Card>
            </Col>
            <Col span="20">
                <Card>
                    <p slot="title">
                        <Icon type="ios-cog"></Icon>
                        {{ $t('iviewComponentTitle') }}
                    </p>
                    <Row :gutter="10" type="flex" justify="center" align="middle" class="switch-language-row1">
                        <Col span="4" offset="1">
                            <p>{{ $t('intro') }}</p>
                        </Col>
                        <Col span="6" offset="1">
                            <Input :placeholder="placeholderText" style="width: 100%;"></Input>
                            <div style="margin-top: 25px;">
                                <DatePicker type="date" :placeholder="placeholderDate" style="width: 100%;"></DatePicker>
                            </div>
                            <div style="margin-top: 25px;">
                                <Rate show-text v-model="valueText"></Rate>
                            </div>
                        </Col>
                        <Col span="6">
                            <Table :columns="columnsI18n" :data="dataI18n"></Table>
                        </Col>
                        <Col span="6">
                            <Button type="primary" @click="showModal = true" long>{{ $t('btnText') }}</Button>
                            <Modal v-model="showModal" title="iView">
                                <p>{{ $t('modalText') }}</p>
                            </Modal>
                            <div style="margin-top: 25px;">
                                <Poptip confirm :title="$t('poptip')">
                                    <Button type="primary" long>{{ $t('showPoptipText') }}</Button>
                                </Poptip>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    name: 'international_index',
    data () {
        return {
            lang: 'zh-CN',
            valueText: 3,
            showModal: false,
            columnsI18n: [
                {
                    key: 'name',
                    title: this.$t('name')
                },
                {
                    key: 'company',
                    title: this.$t('company')
                }
            ],
            dataI18n: [
                {
                    name: 'Aresn',
                    company: 'TalkingData'
                },
                {
                    name: 'Lison',
                    company: 'TalkingData'
                },
                {
                    name: 'Lucy',
                    company: 'TalkingData'
                }
            ]
        };
    },
    methods: {
        handleSwitch (lang) {
            this.lang = lang;
            localStorage.lang = lang;
            this.$store.commit('switchLang', lang); // 如果你要自己实现多语言切换，那么只需要执行这行代码即可，修改语言类型

            this.columnsI18n = [
                {
                    key: 'name',
                    title: this.$t('name')
                },
                {
                    key: 'company',
                    title: this.$t('company')
                }
            ]; // 像iview的table组件这样一次渲染如果数据不更新视图就不更新的组件，如果切换语言需要更新一下数据才能切换组件内的多语言
        }
    },
    computed: {
        placeholderText () {
            return this.$t('placeholderText');
        },
        placeholderDate () {
            return this.$t('placeholderDate');
        }
    },
    created () {
        this.lang = localStorage.lang || 'zh-CN';
    }
};
</script>
