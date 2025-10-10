import { useApi } from "@/core/http";
import { defineStore } from "pinia";

const { get_data } = useApi();

export const useConfigStore = defineStore('config', {
    state: () => ({
        logo_lg: '/assets/images/cyberprotect.png',
        logo_sm: '/assets/images/logo500.png',
        help_icon: '/assets/images/help-icon.svg',
        siteLogo: {},
        services: {}
    }),

    actions: {
        init () {
            this.siteLogo = {
                large: {
                    class: 'logo-lg',
                    src: this.logo_lg,
                    imgClass: ''
                },
                small: {
                    class: 'logo-sm',
                    src: this.logo_sm,
                    imgClass: 'logo-circle'
                }
            }

            
        },

        async fetchService() {
            try {
                const response = await get_data('/ui/services');
                if (response) {
                    const { query } = response.data
                    this.services = query;
                }
            } catch (error) {
                throw error
            }
        }
    }
})