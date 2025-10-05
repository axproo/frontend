import { showError } from "@/utils/toastr";
import { defineStore } from "pinia";

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
                console.log(error);
                showError(error.message || error);
            }
        }
    }
})