<script setup lang="ts">
import { Button, Icon } from 'src/types';


const props = defineProps<{
    confirm: boolean
	icon: Icon
	text?: string
    button_cancel?: Button 
    button_proceed?: Button 
}>()

const emit = defineEmits([
	'cancel',
	'proceed',
])

</script>
<template>
    <q-dialog v-model="confirm" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <h5>
                    <q-icon
                        :class="props.icon.classes"
                        :size="props.icon.size"
                        :name="props.icon.type + ' ' + props.icon.name" />

                    <span class="q-ml-sm">{{ text ?? 'Are you sure?' }}</span>
                </h5>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn :label="props.button_cancel?.label ?? 'cancel'" :color="props.button_cancel?.color ?? 'secondary'" @click="emit('cancel')" />
                <q-btn  :label="props.button_proceed?.label ?? 'Proceed'" :color="props.button_proceed?.color ?? 'primary'"  @click="emit('proceed')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>