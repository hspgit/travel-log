<script lang="ts" setup>
const props = defineProps<{
    label: string;
    name: string;
    error?: string;
    type?: "text" | "textarea" | "number";
    disabled?: boolean;

}>();
</script>

<template>
    <fieldset class="fieldset">
        <legend class="fielset-legend">
            {{ props.label }}
        </legend>
        <Field
            :name="props.name"
            :type="props.type || 'text'"
            placeholder="Type here"
            :disabled="props.disabled"
            class="w-full"
            :class="{
                'input-error': props.error,
                'input': !type || type === 'text' || type === 'number',
                'textarea': type === 'textarea',
            }"
        />
        <p v-if="props.error" class="fieldset-label text-error">
            {{ props.error }}
        </p>
    </fieldset>
</template>
