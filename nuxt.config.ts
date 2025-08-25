import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

import env from "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: [
        "@nuxt/eslint",
        "@nuxt/icon",
        "@nuxtjs/color-mode",
        "@pinia/nuxt",
        "@vee-validate/nuxt",
        "nuxt-csurf",
        "nuxt-maplibre",
        "nuxt-easy-lightbox",
    ],
    css: ["~/assets/app.css"],
    runtimeConfig: {
        public: {
            s3BucketUrl: env.S3_BUCKET_URL,
        },
    },
    vite: {
        plugins: [tailwindcss()],
        server: {
            watch: {
                ignored: ["./docker-data/*"],
            },
        },
    },
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        dataValue: "theme",
    },
});
