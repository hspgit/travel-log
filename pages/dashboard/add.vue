<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema/";

const mapStore = useMapStore();
const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
    // @ts-expect-error Version mismatch between Zod v4 and @vee-validate/zod
    validationSchema: toTypedSchema(InsertLocation),
    initialValues: {
        name: "",
        description: "",
        long: (CENTER_USA as [number, number])[0],
        lat: (CENTER_USA as [number, number])[1],
    },
});

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        loading.value = true;
        await $csrfFetch("/api/locations", {
            method: "post",
            body: values,
        });
        submitted.value = true;
        navigateTo("/dashboard");
    }
    catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data.data);
        }
        submitError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occured.";
    }
    loading.value = false;
});

effect(() => {
    if (mapStore.addedPoint) {
        setFieldValue("long", mapStore.addedPoint.long);
        setFieldValue("lat", mapStore.addedPoint.lat);
    }
});

onMounted(() => {
    mapStore.addedPoint = {
        id: 1,
        name: "Added point",
        description: "",
        long: (CENTER_USA as [number, number])[0],
        lat: (CENTER_USA as [number, number])[1],
    };
});

onBeforeRouteLeave(() => {
    if (!submitted.value && meta.value.dirty) {
        const confirmB = window.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
        if (!confirmB) {
            return false;
        }
    }
    mapStore.addedPoint = null;
    return true;
});

function formatNumber(value?: number) {
    if (!value) {
        return 0;
    }
    return value.toFixed(5);
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
        <div
            v-if="submitError"
            role="alert"
            class="alert alert-error"
        >
            <span>{{ submitError }}</span>
        </div>

        <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
            <AppFormField
                name="name"
                label="Name"
                :error="errors.name"
                :disabled="loading"
            />
            <AppFormField
                name="description"
                label="Desciption"
                type="textarea"
                :error="errors.description"
                :disabled="loading"
            />
            <!-- <AppFormField
                name="lat"
                label="Latitude"
                type="number"
                :error="errors.lat"
                :disabled="loading"
            />
            <AppFormField
                name="long"
                label="Longitude"
                type="number"
                :error="errors.long"
                :disabled="loading"
            /> -->
            <p>
                Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker to your desired location
            </p>
            <p>
                Or double click on the map.
            </p>
            <p class="text-xs text-gray-400">
                Current location: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
            </p>
            <div class="flex justify-end gap-2">
                <button
                    :disabled="loading"
                    type="button"
                    class="btn btn-outline"
                    @click="router.back()"
                >
                    Cancel
                    <Icon name="tabler:arrow-left" size="24" />
                </button>
                <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                >
                    Add
                    <span v-if="loading" class="loading loading-infinity loading-sm" />
                    <Icon
                        v-else
                        name="tabler:circle-plus-filled"
                        size="24"
                    />
                </button>
            </div>
        </form>
    </div>
</template>
