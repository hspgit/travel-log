<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
    <div class="hero bg-base-300 container mx-auto mt-4">
        <div class="hero-content text-center min-h-96">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">
                    Hello there
                </h1>
                <p class="py-6">
                    Keep track of your travels with Travel Log, the ultimate travel companion app.
                    Document your adventures, share your experiences, and create lasting memories.
                </p>
                <AuthButton v-if="!authStore.user" />
                <NuxtLink
                    v-else
                    to="/dashboard"
                    class="btn btn-primary"
                >
                    Start Logging
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
