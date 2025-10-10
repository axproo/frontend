import { useApi } from '@/core/http'
import { defineStore } from 'pinia'
import { nextTick, reactive } from 'vue'
import i18n from '@/i18n'
import { showError } from '@/utils/toastr'

const { get_data, post_data } = useApi()
export const useFormStore = defineStore('form', {
  state: () => ({
    isUrl: '',
    isPath: '',
    isReady: false,
    isAlert: false,
    fieldName: {},
    fields: reactive([]),
    formData: reactive([]),
    errors: [],
    isSubmit: false,
    isMultipart: false,
    isValidOtp: false,
    action: '',
    redirect: '',
    sess_require: localStorage.getItem('sess_require')
  }),

  actions: {
    // Récupérationn  de formulaire
    async fieldData(path) {
      try {
        this.isReady = true

        if (this.fieldName.field && this.fieldName.field.length > 0) {
          const params = new URLSearchParams()
          const fieldArray = JSON.stringify(this.fieldName.field)

          params.append('field', fieldArray)
          path = `${path}?${params.toString()}`
        }

        const response = await get_data(path)
        if (response) {
          const { url, path_url, fieldData, dataForm } = response.data.query

          this.fields = fieldData
          this.formData = dataForm
          this.isUrl = url
          this.isPath = path_url
        }
        // console.log(response);
      } catch (error) {
        this.isReady = false
        throw error
      }
    },

    // Validation des champs
    validateField(field, value, required = false) {
      const fieldValue = typeof value === 'string' ? value.trim() : ''
      const selector = `select[name="${field.name}"], input[name="${field.name}"], textarea[name="${field.name}"]`
      const element = document.querySelector(selector)
      let isValid = true

      if (field.name === 'code') {
        if (!fieldValue || fieldValue.length !== 6 || !/^\d{6}$/.test(fieldValue)) {
          this.isValidOtp = false
          isValid = false
        } else {
          this.isValidOtp = true
          this.errors['code'] = null
        }
        this.message = ''
        this.alert = ''
      } else {
        if (required && !fieldValue) {
          this.errors[field.name] = i18n.global.t(`form.required`, { field: field.label })
          isValid = false

          nextTick(() => {
            if (element) {
              element.classList.add('is-invalid')
            }
          })
        } else {
          this.errors[field.name] = null
          this.message = ''
          this.alert = ''

          nextTick(() => {
            if (element) {
              return this.errors[field.name]
                ? element.classList.add('is-invalid')
                : element.classList.remove('is-invalid')
            }
          })
        }
      }
      this.isSubmit = false
      return isValid
    },

    // Validation et envoi des données coté backend
    async submitForm() {
        Object.keys(this.errors).forEach((key) => {
            this.errors[key] = null
        });

        Object.values(this.fields).forEach((field) => {
            this.validateField(field, this.formData[field.name], field.required)
        })

        const hasErrors = Object.values(this.errors).some((error) => error !== null)
        
        if (!hasErrors) {
            try {
                this.isSubmit = true
                const dataForm = new FormData()

                Object.values(this.fields).forEach((field) => {
                    const value = this.formData[field.name];

                    if (field.type === 'file') {
                        if (value) {
                            this.isMultipart = true;
                            dataForm.append(field.name, value)
                        }
                    } else {
                        dataForm.append(field.name, value ?? '')
                    }
                })
                const response = await post_data(this.isUrl, dataForm, this.isMultipart)
                
                if (response) this.isAlert = true
                return {
                    success: true,
                    formData: this.formData,
                    data: response?.data,
                    action: this.action
                }
            } catch (error) {
                this.isAlert = false;
                this.isSubmit = false;
                if (typeof error === 'object') {
                    if (Object.entries(error).length === 0) throw error

                    Object.entries(error).forEach(([key, message]) => {
                        if (key === 'redirect' && this.redirect !== undefined) {
                            this.isAlert = false;
                            this.redirect.push(message)
                        }
                        if (this.formData[key] !== undefined) {
                            const field = Object.values(this.fields).find((f) => f.name === key)
                            this.validateField(field, this.formData[key], field?.required)
                        }
                        this.errors[key] = message
                    })
                } else {
                    this.isAlert = true;
                    this.isSubmit = false;
                    throw error
                }
            }
        } else {
            const error = Object.values(this.errors).filter(error => error !== null)
            if (this.sess_require === true) showError(i18n.global.t('forms.submit.failed', {err: error}))
        }
    },

    // Mise à jour du formulaire
    async updateField(path) {
        console.log(path);
    },

    resetForm() {
      this.isAlert = false;
      this.isSubmit = false;
      this.fields = [];
      this.formData = [];
    },

    // Réinitialisation de l'OTP 2FA
    resetOtpCode() {
      this.formData = []
      this.isValidOtp = false;
    }
  },
})
