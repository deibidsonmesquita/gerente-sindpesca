export default defineNuxtConfig({
    devtools: {enabled: true},

    modules: [
        'nuxt-primevue',
        '@vueuse/nuxt',
        'nuxt-appwrite'
    ],

    css: [
        'primevue/resources/themes/saga-blue/theme.css',
        '/node_modules/primeflex/primeflex.css',
        'primeicons/primeicons.css'
    ],

    primevue: {
        components: {
            include: [
                'Button', 'DataTable', 'Column', 'InputMask', 'InputText',
                'InputNumber', 'Dialog', 'Toast', 'Calendar'
            ]
        },
        composables: {
            include: '*'
        }
    },

    appwrite: {
        endpoint: 'https://cloud.appwrite.io/v1',
        project: '6531782243c6330ec52f',
    },

    compatibilityDate: '2024-09-06',
    ssr: false,
})