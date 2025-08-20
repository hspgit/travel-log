<script lang="ts" setup>
const isSidebarOpen = ref(true);
const sidebarStore = useSidebarStore();
const route = useRoute();
const locationStore = useLocationStore();

onMounted(() => {
    isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
    if (route.path !== "/dashboard") {
        locationStore.refresh();
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
            class="bg-base-100 transition-all duration-300"
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
                    :show-label="isSidebarOpen"
                    label="Locations"
                    icon="tabler:map"
                    href="/dashboard"
                />
                <SidebarButton
                    :show-label="isSidebarOpen"
                    label="Add Location"
                    icon="tabler:circle-plus-filled"
                    href="/dashboard/add"
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
                        :href="location.href"
                        :show-label="isSidebarOpen"
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
        <div class="flex flex-col flex-1">
            <NuxtPage class="h-1/2" />
            <AppMap class="h-1/2" />
        </div>
    </div>
</template>
