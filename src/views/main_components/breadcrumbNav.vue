<template>
    <Breadcrumb>
        <BreadcrumbItem 
            v-for="item in $store.state.currentPath" 
            :href="item.path" 
            :key="item.name"
        >{{item.title}}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: {
        currentPath: Array
    }
};
</script>

