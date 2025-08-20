import type { MapPoint } from "~/lib/types";

export type SidebarItems = {
    id: string;
    label: string;
    icon: string;
    href: string;
    location: MapPoint | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItems[]>([]);
    const loading = ref(false);
    return {
        loading,
        sidebarItems,
    };
});
