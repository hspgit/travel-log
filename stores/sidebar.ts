import type { RouteLocationRaw } from "vue-router";

import type { MapPoint } from "~/lib/types";

export type SidebarItems = {
    id: string;
    label: string;
    icon: string;
    href?: string;
    to?: RouteLocationRaw;
    mapPoint?: MapPoint | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItems[]>([]);
    const loading = ref(false);
    const sidebarTopItems = ref<SidebarItems[]>([]);
    return {
        loading,
        sidebarItems,
        sidebarTopItems,
    };
});
