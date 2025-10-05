<template>
    <div v-if="isAlert && alert" :class="['alert', alert.class]" role="alert">
        <i :class="alert.icon"></i>
        <span>
            {{ message }}
        </span>
    </div>
</template>

<script setup>
import { useAlertStore } from '@/stores/AlertStore';
import { showError } from '@/utils/toastr';
import { computed, onMounted } from 'vue';


const props = defineProps({
    isAlert: {type: Boolean, default: true},
    type: {type: String, default: 'info'},
    message: String
})

const alerts = useAlertStore();
const alert = computed(() => alerts.lists?.find(item => item.alert === props.type));

const loadAlert = async () => {
    try {
        await alerts.fetchAlerts();
    } catch (error) {
        showError(error.message || error);
    }
}

onMounted(async () => {
    await loadAlert();
})
</script>