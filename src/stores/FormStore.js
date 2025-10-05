import { useApi } from '@/core/http'
import { defineStore } from 'pinia'
import { nextTick, reactive } from 'vue'
import i18n from '@/i18n'

const { get_data } = useApi()
export const useFormStore = defineStore('form', {
  state: () => ({
    isUrl: '',
    isPath: '',
    isReady: false,
    fieldName: {},
    fields: reactive([]),
    formData: reactive([]),
    errors: [],
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
        console.log(required)
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
  },
})
