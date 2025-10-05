import { useApi } from "@/core/http";
import { showError } from "@/utils/toastr";
import { defineStore } from "pinia";

const {get_data} = useApi();

export const useButtonStore = defineStore('button', {
    state: () => ({
        lists: []
    }),

    actions: {
        // Récupération de la liste des boutons
        async fetchButtons() {
            try {
                const response = await get_data('/ui/buttons')
                if (response) {
                    this.lists = response.data.query
                }
            } catch (error) {
                showError(error.message || error);
            }
        }
    }
})