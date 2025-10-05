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
                const response = await get_data('/buttons')
                console.log(response);
            } catch (error) {
                showError(error.message || error);
            }
        }
    }
})