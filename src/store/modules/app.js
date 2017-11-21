import {otherRouter, appRouter} from '@/router/router';

const app = {
    state: {
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter
        ]
    },
    mutations: {
        updateMenulist (state) {
            state.menuList = appRouter;
        }
    }
};

export default app;
