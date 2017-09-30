<template>
    <div @click="exportImage">
        
    </div>
</template>

<script>
export default {
    name: 'ScreenShots',
    methods: {
        exportImage () {
            this.$emit('exportImage', event);
        }
    }
};
</script>
