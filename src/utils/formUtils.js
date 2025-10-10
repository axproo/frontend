import { useFormStore } from "@/stores/FormStore";

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let debounceTimeout = null;
export const debounceUrl = (path, url_content, key, value) => {
    return new Promise((resolve) => {
        const params = new URLSearchParams(useFormStore().formData)
        const queryString = params.toString() ? `${params.toString()}` : '';

        const queryParams = (url, key, value) => {
            const regex = new RegExp(`([?&])${key}=([^&]*)`, 'i')

            if (regex.test(url)) {
                return url.replace(regex, `$1${key}=${value}`)
            }
            return url.includes('?') ? `${url}&${key}=${value}` : `${url}?${key}=${value}`
        }
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            if (!path.includes(url_content)) {
                path = `${path}${url_content}${queryString}`
            }
            path = queryParams(path, key, value)
            resolve(path)
        }, 300)
    })
}