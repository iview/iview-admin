<template>
    <div @click="lockScreen" class="lock-screen-btn-con">
        <Tooltip content="锁屏" placement="bottom">
            <Icon type="locked" :size="20"></Icon>
        </Tooltip>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
const setLockBackSize = () => {
    let x = document.body.clientWidth;
    let y = document.body.clientHeight;
    let r = Math.sqrt(x * x + y * y);
    return parseInt(r);
};
export default {
    name: 'lockScreen',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        lockScreen () {
            let lockScreenBack = document.getElementById('lock_screen_back');
            lockScreenBack.style.transition = 'all 3s';
            lockScreenBack.style.zIndex = 10000;
            lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset';
            this.showUnlock = true;
            Cookies.set('last_page_name', this.$route.name); // 本地存储锁屏之前打开的页面以便解锁后打开
            setTimeout(() => {
                lockScreenBack.style.transition = 'all 0s';
                this.$router.push({
                    name: 'locking'
                });
            }, 800);
            Cookies.set('locking', '1');
        }
    },
    mounted () {
        let lockScreenBack;
        if (!document.getElementById('lock_screen_back')) {
            let lockdiv = document.createElement('div');
            lockdiv.setAttribute('id', 'lock_screen_back');
            lockdiv.setAttribute('class', 'lock-screen-back');
            document.body.appendChild(lockdiv);
            lockScreenBack = document.getElementById('lock_screen_back');
            window.addEventListener('resize', () => {
                let size = setLockBackSize();
                this.lockScreenSize = size;
                lockScreenBack.style.transition = 'all 0s';
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
            });
        } else {
            lockScreenBack = document.getElementById('lock_screen_back');
        }
        let size = setLockBackSize();
        this.lockScreenSize = size;
        lockScreenBack.style.transition = 'all 3s';
        lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
    }
};
</script>

