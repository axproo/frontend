import { useApi } from "@/core/http";
import { defineStore } from "pinia";

const {get_data} = useApi();
export const useAlertStore = defineStore('alert', {
    state: () => ({
        isReady: false,
        lists: []
    }),

    actions: {
        // Recupération des alertes
        async fetchAlerts() {
            this.isReady = true;

            try {
                const response = await get_data('/ui/alerts');
                if (response) {
                    this.lists = response.data?.query
                }
            } catch (error) {
                throw error;
            } finally {
                this.isReady = false;
            }
        }
    }
})