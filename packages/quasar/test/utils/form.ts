import { VueWrapper } from '@vue/test-utils/dist/vueWrapper'

async function prefillFormByName (wrapper: VueWrapper, object):Promise<T> {
    for (const field in object){
        const quasarFieldElement = wrapper.get(`[name="${field}"]`)
        await quasarFieldElement.setValue(object[field])
    }

}

export { prefillFormByName }
