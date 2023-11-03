<script setup>
    import { JLForm, FormFieldField, FormFieldType, FormFieldButtonType  } from '@juicyllama/frontend-core'
    import { reactive, ref } from 'vue'

    const formInputData = reactive({data:{}})
    const form = reactive([
        {
					key: 'first_name',
					field: FormFieldField.INPUT,
					type: FormFieldType.TEXT,
					required: true,
                    label: 'First Name',
					add: true,
					edit: true,
				},{
					key: 'user_bio',
					field: FormFieldField.TEXTAREA,
					type: FormFieldType.TEXT,
					required: false,
                    label: 'Bio',
					add: true,
					edit: true,
				},{
					key: 'user_age',
					field: FormFieldField.INPUT,
					type: FormFieldType.NUMBER,
					required: true,
                    label: 'Age',
					add: true,
					edit: true,
				},{
					key: 'user_city',
					field: FormFieldField.DROPDOWN,
					type: FormFieldType.TEXT,
					required: true,
                    label: 'City',
					add: true,
					edit: true,
                    dropdown: [{
                        label: 'New York',
                        value: 'new_york'
                    }, {
                        label: 'Los Angeles',
                        value: 'los_angeles'
                    }]
				},{
					key: 'user_email',
					field: FormFieldField.INPUT,
					type: FormFieldType.EMAIL,
					required: false,
                    label: 'Email',
                    placeholder: 'Enter your email',
					add: true,
					edit: true,
				},{
					key: 'user_verifyed',
					field: FormFieldField.TOGGLE,
					type: FormFieldType.BOOLEAN,
					required: true,
                    label: 'Agree to T&C',
					add: true,
					edit: true,
				}
                ,{
					key: 'save_button',
					field: FormFieldField.BUTTON,
                    buttons: [{
                        type: FormFieldButtonType.SUBMIT,
                        icon: {
                            name: 'save',
                            type: ''
                        },
                    }],
                    label: 'Save'

				}
    ])

    const options = {
        type: 'edit',
        name: 'user',
        fields: form,
        // onFormLoad: () => {
        //     console.log('onFormLoad')
        // }
    }

    const loaded = ref(false)

    async function submittedForm(form) {
        console.log('submittedForm:', form)
    }

    const updateFormField = (field) => {
        console.log('updateFormField:', field)
        formInputData.data = {
            ...formInputData.data,
            ...field
        }
    }
</script>
<template>
        <h5>User entry form</h5>
<div class="row">
    <div class="col-md-4 col-6">
    <JLForm
    :options="options"
    @updateFormField="updateFormField"
    @submittedForm="submittedForm"></JLForm>
    </div>
    <div class="col-md-4 col-6 q-pa-md">
        <h6> Form data:</h6>
        <code>{{ formInputData.data }}</code>

        <!-- <h6>Form events:</h6>
            <q-icon name="check" color="green"/>submittedForm <br>
            <q-icon name="check"/>updateFormField <br> -->
    </div>
</div>
</template>
