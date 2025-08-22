<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

import type { NominatimResult } from "~/lib/types";

import { CENTER_USA } from "~/lib/constants";
import { InsertLocation } from "~/lib/db/schema/";

const props = defineProps<{
    initialValues?: InsertLocation | null;
    onSubmit: (location: InsertLocation) => Promise<any>;
    submitLabel: string;
    submitIcon: string;
    onSubmitComplete: () => void;
}>();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const mapStore = useMapStore();
const router = useRouter();

const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({

    // @ts-expect-error Version mismatch between Zod v4 and @vee-validate/zod
    validationSchema: toTypedSchema(InsertLocation),
    initialValues: {
        name: props.initialValues?.name || "",
        description: props.initialValues?.description || "",
        long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
        lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
    },
});

const onSubmit = handleSubmit(async (values: InsertLocation) => {
    try {
        submitError.value = "";
        loading.value = true;
        await props.onSubmit(values);
        submitted.value = true;
        props.onSubmitComplete();
    }
    catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data.data);
        }
        submitError.value = getFetchErrorMessage(error);
    }
    loading.value = false;
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

function searchResultSelected(result: NominatimResult) {
    setFieldValue("name", result.display_name);
    mapStore.addedPoint = {
        id: 1,
        name: "Added point",
        description: "",
        long: Number(result.lon),
        lat: Number(result.lat),
        centerMap: true,
    };
}

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
        long: props.initialValues?.long || (CENTER_USA as [number, number])[0],
        lat: props.initialValues?.lat || (CENTER_USA as [number, number])[1],
    };
});
</script>

<template>
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
        <p class="text-xs text-gray-400">
            Current coordinates: {{ formatNumber(controlledValues.lat) }}, {{ formatNumber(controlledValues.long) }}
        </p>
        <p>
            To set coordinates:
        </p>
        <ul class="list-disc ml-4 text-sm">
            <li>
                Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
            </li>
            <li>
                Double click on the map.
            </li>
            <li>
                Search for a location below.
            </li>
        </ul>
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
                {{ props.submitLabel }}
                <span v-if="loading" class="loading loading-infinity loading-sm" />
                <Icon
                    v-else
                    :name="props.submitIcon"
                    size="24"
                />
            </button>
        </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
