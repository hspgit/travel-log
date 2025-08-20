import type { LngLatBounds } from "maplibre-gl";

import type { MapPoint } from "~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
    const mapPoints = ref<MapPoint[]>([]);

    async function init() {
        const { useMap } = await import("@indoorequal/vue-maplibre-gl");
        const { LngLatBounds } = await import("maplibre-gl");

        const map = useMap();

        let bounds: LngLatBounds | null = null;
        const padding = 60;

        effect(() => {
            const firstPoint = mapPoints.value[0];
            if (!firstPoint) {
                return;
            }
            bounds = mapPoints.value.reduce((bounds, point) => {
                return bounds.extend([point.long, point.lat]);
            }, new LngLatBounds(
                [firstPoint.long, firstPoint.lat],
                [firstPoint.long, firstPoint.lat],
            ));

            map.map?.fitBounds(bounds, {
                padding,
                maxZoom: 10,
            });
        });
    }

    return {
        init,
        mapPoints,
    };
});
