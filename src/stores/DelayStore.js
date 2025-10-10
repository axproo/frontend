import { defineStore } from "pinia";

export const useDelayStore = defineStore('delay', {
    state: () => ({
        RESEND_DELAY: 5 * 60 * 1000, // 15 minutes en millisecondes
        resendTimer: 0,
        countdownInterval: null,
        is_resend: false
    }),

    actions: {
        canResend() {
            const lastSent = localStorage.getItem('otp_last_sent');
            if (!lastSent) return true;
            const elapsed = Date.now() - parseInt(lastSent)
            return elapsed >= this.RESEND_DELAY
        },

        startCountdown() {
            clearInterval(this.countdownInterval);
            const lastSent = parseInt(localStorage.getItem('otp_last_sent') || 0)
            const remaining = this.RESEND_DELAY - (Date.now() - lastSent)

            if (remaining > 0) {
                this.is_resend = true;
                this.resendTimer = Math.floor(remaining / 1000);
                this.countdownInterval = setInterval(() => {
                    this.resendTimer--;
                    if (this.resendTimer <= 0) {
                        this.stopCountdown()
                    }
                }, 1000)
            } else {
                this.stopCountdown()
            }
        },

        stopCountdown() {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
            this.resendTimer = 0;
            this.is_resend = false;
        }
    }
})