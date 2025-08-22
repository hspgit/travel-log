<script lang="ts" setup>
import type { InsertLocation } from "~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
    await $csrfFetch("/api/locations", {
        method: "post",
        body: values,
    });
};

function onSubmitComplete() {
    navigateTo("/dashboard");
}
</script>

<template>
    <div class="container max-w-md mx-auto p-4">
        <div class="my-4">
            <h1 class="text-lg">
                Add location
            </h1>
            <p>
                A location is a place you have travelled or will travel to.
            </p>
        </div>
        <LocationForm
            :on-submit
            submit-label="Add"
            submit-icon="tabler:circle-plus-filled"
            :on-submit-complete
        />
    </div>
</template>
