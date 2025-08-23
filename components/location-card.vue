<script lang="ts" setup>
import type { MapPoint } from "~/lib/types";

defineProps<{
    mapPoint: MapPoint;

}>();
const mapStore = useMapStore();
</script>

<template>
    <NuxtLink
        :key="mapPoint.id"
        class="card card-compact bg-base-300 h-38 w-72 shrink-0 hover:cursor-pointer border-2 mb-2"
        :class="{
            'border-accent': isPointSelected(mapPoint, mapStore.selectedPoint),
            'border-transparent': !isPointSelected(mapPoint, mapStore.selectedPoint),
        }"
        :to="mapPoint.to"
        @mouseenter="mapStore.selectedPoint = mapPoint"
        @mouseleave="mapStore.selectedPoint = null"
    >
        <div class="card-body">
            <slot name="top" />
            <h3 class="text-xl">
                {{ mapPoint.name }}
            </h3>
            <p v-if="mapPoint.description">
                {{ mapPoint.description }}
            </p>
        </div>
    </NuxtLink>
</template>
