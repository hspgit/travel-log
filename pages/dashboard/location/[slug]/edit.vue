<script lang="ts" setup>
import type { InsertLocation } from "~/lib/db/schema";

const locationStore = useLocationStore();
const { $csrfFetch } = useNuxtApp();
const route = useRoute();

async function onSubmit(values: InsertLocation) {
    await $csrfFetch(`/api/locations/${route.params.slug}`, {
        method: "put",
        body: values,
    });
};

function onSubmitComplete() {
    navigateTo({
        name: "dashboard-location-slug",
        params: {
            slug: route.params.slug,
        },
    });
}
</script>

<template>
    <LocationForm
        v-if="locationStore.currentLoationStatus !== 'pending' && locationStore.currentLocation"
        :zoom="15"
        :on-submit
        :initial-values="locationStore.currentLocation"
        submit-label="Update"
        submit-icon="tabler:map-pin-up"
        :on-submit-complete
    />
</template>
