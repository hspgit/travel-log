<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
    <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
        <div
            tabindex="0"
            role="button"
            class="btn m-1"
        >
            <div v-if="authStore.user.image" class="avatar">
                <div class="w-8 rounded-full">
                    <img :src="authStore.user.image" :alt="authStore.user.name">
                </div>
            </div>
            {{ authStore.user.name }}
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
                <NuxtLink to="/sign-out">
                    <Icon
                        name="tabler:logout-2"
                        class="text-red-500"
                        size="24"
                    />
                    <span class="text text-red-500"> Sign Out</span>
                </NuxtLink>
            </li>
        </ul>
    </div>
    <div v-else class="flex gap-2 justify-center">
        <button
            :disabled="authStore.loading"
            class="btn btn-accent"
            @click="authStore.signInWithGitHub"
        >
            GitHub
            <span v-if="authStore.loading" class="loading loading-infinity loading-md" />
            <Icon
                v-else
                name="tabler:brand-github"
                size="24"
            />
        </button>
        <button
            :disabled="authStore.loading"
            class="btn btn-secondary"
            @click="authStore.signInWithGoogle"
        >
            Google
            <span v-if="authStore.loading" class="loading loading-infinity loading-md" />
            <Icon
                v-else
                name="tabler:brand-google"
                size="24"
            />
        </button>
    </div>
</template>
