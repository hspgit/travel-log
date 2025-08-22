<script lang="ts" setup>
const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();
const route = useRoute();
const locationStore = useLocationStore();
const mapStore = useMapStore();

const { currentLocation } = storeToRefs(locationStore);

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
    if (route.path !== "/dashboard") {
        locationStore.refreshLocations();
    }
});

effect(() => {
    if (route.name === "dashboard") {
        sidebarStore.sidebarTopItems = [
            {
                id: "link-dashboard",
                label: "Locations",
                href: "/dashboard",
                icon: "tabler:map",
            },
            {
                id: "link-location-add",
                label: "Add Location",
                href: "/dashboard/add",
                icon: "tabler:circle-plus-filled",
            },
        ];
    }
    else if (route.name === "dashboard-location-slug") {
        sidebarStore.sidebarTopItems = [
            {
                id: "link-dashboard",
                label: "Back to Locations",
                href: "/dashboard",
                icon: "tabler:arrow-left",
            },
            {
                id: "link-dashboard",
                label: currentLocation.value ? currentLocation.value.name : "View Logs",
                to: {
                    name: "dashboard-location-slug",
                    params: {
                        slug: currentLocation.value?.slug,
                    },
                },
                icon: "tabler:map",
            },
            {
                id: "link-location-edit",
                label: "Edit Location",
                to: {
                    name: "dashboard-location-slug-edit",
                    params: {
                        slug: currentLocation.value?.slug,
                    },
                },
                icon: "tabler:map-pin-cog",
            },
            {
                id: "link-location-add",
                label: "Add Location Log",
                to: {
                    name: "dashboard-location-slug-add",
                    params: {
                        slug: currentLocation.value?.slug,
                    },
                },
                icon: "tabler:circle-plus-filled",
            },
        ];
    }
});

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
    localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
    <div class="flex-1 flex">
        <div
            class="bg-base-100 transition-all duration-300 shrink-0"
            :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
        >
            <div
                class="flex hover:cursor-pointer hover:bg-base-200 p-2"
                :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
                @click="toggleSidebar"
            >
                <Icon
                    v-if="isSidebarOpen"
                    name="tabler:layout-sidebar-left-collapse"
                    size="32"
                />
                <Icon
                    v-else
                    name="tabler:layout-sidebar-right-collapse"
                    size="32"
                />
            </div>
            <div class="flex flex-col">
                <SidebarButton
                    v-for="item in sidebarStore.sidebarTopItems"
                    :key="item.id"
                    :show-label="isSidebarOpen"
                    :label="item.label"
                    :icon="item.icon"
                    :href="item.href"
                    :to="item.to"
                />

                <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
                <div v-if="sidebarStore.loading" class="px-4">
                    <div class="skeleton h-4 w-full" />
                </div>
                <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
                    <!-- <ClientOnly> to resolve Hydration children mismatch in div server rendered element contains more child nodes than client vdom -->
                    <SidebarButton
                        v-for="location in sidebarStore.sidebarItems"
                        :key="location.id"
                        :label="location.label"
                        :icon="location.icon"
                        :to="location.to"
                        :show-label="isSidebarOpen"
                        :icon-color="isPointSelected(location.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
                        @mouseenter="mapStore.selectedPoint = location.mapPoint ?? null"
                        @mouseleave="mapStore.selectedPoint = null"
                    />
                    <!-- </ClientOnly> -->
                </div>

                <div class="divider" />
                <SidebarButton
                    :show-label="isSidebarOpen"
                    label="Sign Out"
                    icon="tabler:logout-2"
                    href="/sign-out"
                />
            </div>
        </div>
        <div class="flex-1 overflow-auto bg-base-200">
            <div class="flex size-full" :class="{ 'flex-col': route.path !== '/dashboard/add' }">
                <NuxtPage />
                <AppMap class="flex-1" />
            </div>
        </div>
    </div>
</template>
