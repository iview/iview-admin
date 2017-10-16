<template>
    <div style="width: 100%;height: 100%;background: #667aa6">
        <div class="unlock-con">
            <unlock :show-unlock="showUnlock" @on-unlock="handleUnlock"></unlock>
        </div>
    </div>
</template>

<script>
import unlock from './unlock.vue';
export default {
    components: {
        unlock
    },
    data () {
        return {
            showUnlock: false
        };
    },
    methods: {
        handleUnlock () {
            this.showUnlock = false;
            let lockScreenBack = document.getElementById('lock_screen_back');
            lockScreenBack.style.zIndex = -1;
            lockScreenBack.style.boxShadow = '0 0 0 0 #667aa6 inset';
            this.$router.go(-1);
        }
    },
    mounted () {
        this.showUnlock = true;
    }
};
</script>
