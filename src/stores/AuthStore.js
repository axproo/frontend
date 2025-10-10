import { useApi } from "@/core/http";
import { defineStore } from "pinia";

const { get_data, post_data } = useApi();
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        users: null
    }),

    actions: {
        // Initialisation du compte user
        async init() {
            try {
                const response = await get_data('/me');
                if (response) {
                    const { query: { user } = {}} = response.data
                    this.users = user
                    this.isAuthenticated = true
                }
            } catch (error) {
                this.logout()
            }
        },

        // Connexion user
        async login(router, redirect) {
            try {
                await this.init();
                router.push(sessionStorage.getItem('lastVisiteUrl') || redirect);
            } catch (error) {
                console.warn(error.message || error);
            }
        },

        // Déconnexion user
        async logout() {
            try {
                const response = await post_data('/logout')
                if (response) {
                    this.isAuthenticated = false
                }
            } catch (error) {
                throw error
            }
        }
    }
})