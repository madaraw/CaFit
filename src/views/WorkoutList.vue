<template>
    <div class="px-4 pt-6 md:px-12 xl:px-40">
        <div class="flex justify-center my-4">
            <h1 class="text-surface-0 font-bold text-4xl leading-tight">Workout List</h1>
        </div>
        <div v-if="workoutsTable.length">
            <DataTable @row-select="goToWorkout" v-model:selection="selectedWorkout"
                :size="device === 0 ? 'small' : device === 1 ? 'normal' : 'large'" selectionMode="single" dataKey="id"
                :value="workoutsTable" size='small'>
                <Column field="name" header="Name"></Column>
                <Column field="intensity.name" header="Intensity"></Column>
                <Column field="frequency" header="Frequency">
                    <template #body="slotProps">
                        <span>{{ slotProps.data.frequency }} time{{ slotProps.data.frequency === 1 ? '' : 's' }} per
                            week</span>
                    </template>
                </Column>
                <Column field="duration" header="Duration">
                    <template #body="slotProps"><span>{{ slotProps.data.duration }} minutes</span></template>
                </Column>
                <Column field="id">
                    <template #body="slotProps">
                        <ConfirmDialog />
                        <Button icon="pi pi-trash" severity="danger" @click="deleteWorkoutConfirm(slotProps.data.id)" />
                    </template>
                </Column>
                <Row v-if="!workoutsTable">
                    <div class="flex justify-center">
                        <h1 class="text-surface-0 font-bold text-4xl leading-tight">Workout List</h1>
                    </div>
                    <p class="text-surface-0">No workouts available</p>
                </Row>
            </DataTable>
            <div class="flex flex-col md:flex-row items-center gap-6 mt-6">
                <p class="text-surface-0 lg:text-lg xl:text-xl">Not enough workouts? Create one using this button.
                </p>
                <Button @click="createWorkout" label="Create Workout" rounded />
            </div>
        </div>
        <div class="mt-10" v-else>
            <div class="flex flex-col md:flex-row items-center gap-6 mt-2">
                <p class="text-surface-0 lg:text-lg xl:text-xl">No workouts available please create one using the button
                    below.</p>
                <Button @click="createWorkout" label="Create Workout" rounded />
            </div>
        </div>
    </div>
</template>

<script setup>
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import Row from 'primevue/row';
    import ConfirmDialog from 'primevue/confirmdialog';
    import { useConfirm } from "primevue/useconfirm";
    import { onBeforeMount, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const workoutsTable = ref([])
    const selectedWorkout = ref(null)
    const router = useRouter()
    const deleteConfirmDialog = useConfirm();
    let device = screen.width <= 640 ? 0 : screen.width <= 1024 ? 1 : 2

    const createWorkout = () => {
        router.push({ name: 'workout-setup' })
    }
    const deleteWorkoutConfirm = (id) => {
        deleteConfirmDialog.require({
            message: 'Are you sure you want to delete this workout?',
            header: 'Delete Workout',
            icon: 'pi pi-info-circle',
            acceptProps: {
                label: 'Delete',
                severity: 'danger'
            },
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary'
            },
            accept: () => {
                deleteWorkout(id)
            },
            reject: () => { }
        })
    }
    const deleteWorkout = (id) => {
        let index = workoutsTable.value.findIndex(workout => workout.id === id)
        workoutsTable.value.splice(index, 1)
        localStorage.setItem('workoutsTable', JSON.stringify(workoutsTable.value))
        const exercisesTable = JSON.parse(localStorage.getItem('exercisesTable'))
        index = exercisesTable.findIndex(exercise => exercise.id === id)
        exercisesTable.splice(index, 1)
        localStorage.setItem('exercisesTable', JSON.stringify(exercisesTable))
    }
    const goToWorkout = (slotProps) => {
        router.push({ name: 'workout-plan', params: { id: slotProps.data.id } })
    }

    onBeforeMount(() => {
        try {
            workoutsTable.value = JSON.parse(localStorage.getItem('workoutsTable'))
        } catch (error) {
            console.log(error)
            return
        }
    })

</script>