<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { Field } from "vee-validate";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{
    resultSelected: [result: NominatimResult];
}>();
const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const errorMessage = ref("");
const hasSearched = ref(false);

async function onSubmit(query: Record<string, string>) {
    try {
        loading.value = true;
        hasSearched.value = true;
        searchResults.value = [];
        errorMessage.value = "";
        const results = await $fetch("/api/search", {
            query,
        });
        searchResults.value = results;
    }
    catch (e) {
        const error = e as FetchError;
        errorMessage.value = getFetchErrorMessage(error);
    }
    loading.value = false;
}

function setLocation(result: NominatimResult) {
    emit("resultSelected", result);
    hasSearched.value = false;
    errorMessage.value = "";
    searchResults.value = [];
    if (form.value) {
        form.value.resetForm();
    }
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="text-xs italic flex justify-end gap-1">
            <span>Search results provided by:</span><a
                target="_blank"
                rel="noopener nofollow"
                class="link"
                href="https://nominatim.openstreetmap.org/ui/search.html"
            >nominatim</a>
        </div>
        <div class="flex flex-col gap-2">
            <Form
                ref="form"
                v-slot="{ errors }"
                class="flex flex-col gap-2 items-center"
                :validation-schema="toTypedSchema(SearchSchema)"
                :initial-values="{ q: '' }"
                @submit="onSubmit"
            >
                <div class="join mt-4">
                    <div>
                        <label class="input join-item">
                            <Icon name="tabler:search" />
                            <Field
                                type="text"
                                name="q"
                                :disabled="loading"
                                :class="{
                                    'input-error': errors.q,
                                }"
                                placeholder="Search for a location"
                            />
                        </label>
                        <div v-if="errors.q" class="text-error text-xs mt-1">
                            {{ errors.q }}
                        </div>
                    </div>

                    <button
                        :disabled="loading"
                        class="btn btn-neutral join-item"
                    >
                        Search
                    </button>
                </div>
            </Form>
            <div
                v-if="loading && errorMessage"
                role="alert"
                class="alert alert-error"
            >
                {{ errorMessage }}
            </div>
            <div
                v-if="!loading && hasSearched && !searchResults.length"
                role="alert"
                class="alert alert-warning"
            >
                No results found.
            </div>
            <div v-if="loading" class="flex justify-center">
                <div class="loading loading-infinity loading-xl" />
            </div>
            <div class="flex flex-col overflow-auto gap-2 max-h-50 mt-2">
                <div
                    v-for="result in searchResults"
                    :key="result.place_id"
                    class="card bg-base-100 card-sm"
                >
                    <div class="card-body">
                        <h4 class="card-title">
                            {{ result.display_name }}
                        </h4>
                        <div class="justify-end card-actions">
                            <button class="btn btn-sm btn-warning" @click="setLocation(result)">
                                Set location
                                <Icon name="tabler:map-pin-share" size="20" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
