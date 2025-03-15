<template>
    <div class=" px-4 py-20 md:px-12 lg:px-20">
        <Stepper value="1" linear>
            <StepItem value="1">
                <Step>Workout setup</Step>
                <StepPanel class="py-6" v-slot="{ activateCallback }">
                    <form class="space-y-6 ms-4">
                        <div class="flex items-center justify-start gap-4">
                            <label for="intensity" class="text-surface-0 font-medium">Intensity</label>
                            <Select id="intensity" v-model="workoutOptions.intensity" :options="intensityOptions"
                                checkmark optionLabel="name" placeholder="Select an Intensity"
                                :invalid="!workoutOptions.intensity"></Select>
                        </div>
                        <div class="flex items-center justify-start gap-4">
                            <label for="frequency" class="text-surface-0 font-medium">Frequency</label>
                            <InputNumber id="frequency" v-model="workoutOptions.frequency" mode="decimal" :min="1"
                                :max="7" placeholder="Frequency"
                                :suffix="workoutOptions.frequency === 1 ? ' time per week' : ' times per week'" />
                        </div>
                        <div class="flex flex-col gap-4">
                            <label for="duration" class="text-surface-0 font-medium">Duration {{ workoutOptions.duration
                                }}
                                minutes</label>
                            <div class="flex justify-center">
                                <Slider id="duration" v-model="workoutOptions.duration" :min="30" :max="180" :step="15"
                                    class="w-3/4" />
                            </div>
                        </div>
                        <div class="space-y-1 mt-8">
                            <p class="text-red-400" v-if="selectedOptionsError">Please select an intensity, frequency,
                                and
                                duration.</p>
                            <Button label="Next" @click="goToExerciseSelection(activateCallback)" />

                        </div>
                    </form>
                </StepPanel>
            </StepItem>
            <StepItem value="2">
                <Step>Exercise selection</Step>
                <StepPanel v-if="exercisesByCategory" class="p-4" v-slot="{ activateCallback }">
                    <Tabs v-model:value="selectedTab" scrollable>
                        <TabList>
                            <Tab v-for="(exerciseCategory, index) in Object.keys(exercisesByCategory)" :key="index"
                                :value="index" :disabled="disableTabs && currentExerciseCategory !== index">
                                {{ exerciseCategory.charAt(0).toUpperCase() + exerciseCategory.slice(1) }}

                            </Tab>
                        </TabList>
                        <TabPanels>
                            <p class="mb-3">Choose a maximum of {{ `${workoutPlan.numberExercisesPerBodyPart}
                                ${workoutPlan.numberExercisesPerBodyPart === 1 ? 'exercise' : 'exercises'}` }} per body
                                part
                                please</p>
                            <TabPanel v-for="(exerciseCategory, index) in Object.keys(exercisesByCategory)" :key="index"
                                :value="index">
                                <WorkoutList v-if="exercisesByCategory[exerciseCategory]"
                                    :workouts="exercisesByCategory[exerciseCategory]"
                                    :max-exercises="workoutPlan.numberExercisesPerBodyPart" :index="index"
                                    :list-name="exerciseCategory" @exceed-max-exercises="blockUserMaxExercises"
                                    ref="workoutList" />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                    <p class="text-red-400" v-if="selectedExercisesError">{{ selectedExercisesErrorMessage }}</p>
                    <Button label="Next" @click="getExercisePlan(activateCallback)" />
                    <Button label="randomize" @click="randomExercises(activateCallback)" />
                </StepPanel>
            </StepItem>
            <StepItem value="3">
                <Step>Review</Step>
                <StepPanel class="py-6" v-slot="{ activateCallback }">
                    <div class="space-y-3">
                        <p class="font-bold">Review your workout plan</p>
                        <div class="space-y-2">
                            <p>Intensity: {{ workoutOptions.intensity.name }}</p>
                            <p>Frequency: {{ `${workoutOptions.frequency} ${workoutOptions.frequency === 1 ?
                                ' time per week' : ' times per week'}` }}</p>
                            <p>Duration: {{ workoutOptions.duration }} minutes</p>
                        </div>
                        <p class="font-bold">Exercises:</p>
                        <div class="space-y-2">
                            <p class="flex gap-2" v-for="(muscle, index) in Object.keys(exercisePlanShow)" :key="index">
                                <span class="font-semibold "> {{ muscle.charAt(0).toUpperCase() +
                                    muscle.slice(1)
                                    }}:</span>
                                {{exercisePlanShow[muscle].map(exercise =>
                                    exercise.name).join(', ')}}
                            </p>
                        </div>
                    </div>

                    <Button label="Back" class="!mr-2" @click="activateCallback('2')" />
                    <Button label="Finish" class="!mt-8" @click="makeWorkutPlan" />
                </StepPanel>
            </StepItem>
        </Stepper>

    </div>
</template>

<script setup>
    import Select from 'primevue/select';
    import Slider from 'primevue/slider';
    import Button from 'primevue/button';
    import InputNumber from 'primevue/inputnumber';
    import Stepper from 'primevue/stepper';
    import StepItem from 'primevue/stepitem';
    import Step from 'primevue/step';
    import StepPanel from 'primevue/steppanel';
    import Tabs from 'primevue/tabs';
    import TabList from 'primevue/tablist';
    import Tab from 'primevue/tab';
    import TabPanels from 'primevue/tabpanels';
    import TabPanel from 'primevue/tabpanel';
    import { ref, useTemplateRef } from 'vue';
    import WorkoutList from '../components/WorkoutList.vue';
    import exercises from '../data/exercises.json';
    import router from '@/router';



    const intensityOptions = [
        { name: 'Low', code: 'low' },
        { name: 'Medium', code: 'medium' },
        { name: 'High', code: 'high' },
    ];
    const categories = {
        allCategories: ['chest', 'biceps', 'quadriceps', 'shoulders', 'triceps', 'abdominals', 'calves', 'hamstrings', 'glutes'],
        backCategory: ['lats', 'middle back', 'lower back'],
    }
    const workoutOptions = ref({
        intensity: "",
        frequency: 1,
        duration: 30,
    })
    const selectedOptionsError = ref(false);
    const selectedTab = ref(0);
    const disableTabs = ref(false);
    const currentExerciseCategory = ref(0);
    const workoutList = useTemplateRef('workoutList')
    const selectedExercisesError = ref(false)
    const selectedExercisesErrorMessage = ref('')
    const exercisePlan = ref({})
    const exercisePlanShow = ref({})
    let workoutPlan = {}

    const makeWorkutPlan = () => {
        localStorage.setItem('exercisePlan', JSON.stringify(exercisePlan.value))
        localStorage.setItem('workoutPlan', JSON.stringify(workoutOptions.value))
        router.push('/workout-plan')
    }

    const generateExercisePlanShow = (basicExercisePlan) => {

        exercisePlanShow.value = basicExercisePlan.reduce((acc, exercise) => {
            const { primaryMuscle } = exercise
            if (!acc[primaryMuscle]) {
                acc[primaryMuscle] = []
            }
            acc[primaryMuscle].push(exercise)
            return acc
        }, {})
    }

    const randomExercises = (callback) => {
        const valid = []
        workoutList.value.forEach(list => {
            const randomExercises = []
            const noRepeat = []
            for (let i = 0; i < workoutPlan.numberExercisesPerBodyPart; i++) {
                // generate random number from 0 to length of exercises in the list
                const randomExerciseId = Math.floor(Math.random() * (exercisesByCategory.value[list.listName].length))
                if (noRepeat.includes(randomExerciseId)) {
                    i--
                    continue
                }
                noRepeat.push(randomExerciseId)
                randomExercises.push(exercisesByCategory.value[list.listName][randomExerciseId])
            }
            valid.push(...randomExercises)
        })
        exercisePlan.value = valid
        generateExercisePlanShow(valid)
        console.log(exercisePlanShow.value)
        callback('3');
    }

    const getExercisePlan = (callback) => {
        let valid = [], invalid = [];
        selectedExercisesError.value = false;
        workoutList.value.forEach(list => {
            if (list.selectedExercises.length == workoutPlan.numberExercisesPerBodyPart) {
                valid.push(...list.selectedExercises)
            }
            else {
                invalid.push(list.listName)
            }

        })
        if (invalid.length) {
            selectedExercisesError.value = true;
            if (invalid.length > 3)
                selectedExercisesErrorMessage.value = 'Please select the correct number of exercises for each muscle group'
            else
                selectedExercisesErrorMessage.value = `Please select the correct number of exercises for the following muscle groups: ${invalid.join(', ')}`
            return
        }
        exercisePlan.value = valid
        generateExercisePlanShow(valid)
        callback('3');
    }
    const blockUserMaxExercises = (index) => {
        if (index == null) {
            disableTabs.value = false;
            return
        }
        disableTabs.value = true;
        currentExerciseCategory.value = index;
    }

    const goToExerciseSelection = (goNextFunction) => {
        if (!workoutOptions.value.intensity)
            return selectedOptionsError.value = true;
        selectedOptionsError.value = false;
        workoutPlan = lawsOfExercise();
        goNextFunction('2');
    }

    // make a function that will take intensity frequency and duration in min and make a workout plan (upper lower/ full body/ full body EOD/ etc)
    const lawsOfExercise = () => {
        const { intensity, frequency, duration } = workoutOptions.value;
        let workoutPlan = {};
        // based off duration you can choose more or less exercises
        let numberExercisesPerBodyPart = 0;
        // based off intensity you can get more or less reps/sets
        let totalSetPerBodyPart = 0;
        // based off frequency you can get the type of workout
        let workoutType = '';
        // based off all of these you can get the type of workout plan

        if (duration <= 45) {
            numberExercisesPerBodyPart = 1;
        } else if (duration <= 90) {
            numberExercisesPerBodyPart = 2;
        } else {
            numberExercisesPerBodyPart = 3;
        }

        if (intensity === 'low') {
            totalSetPerBodyPart = 3;
        } else if (intensity === 'medium') {
            totalSetPerBodyPart = 5;
        } else if (intensity === 'high') {
            totalSetPerBodyPart = 8;
        }

        if (frequency <= 3) {
            workoutType = ['full body'];
        } else {
            workoutType = ['upper lower', 'full body EOD'];
        }

        return workoutPlan = {
            numberExercisesPerBodyPart,
            totalSetPerBodyPart,
            workoutType
        };
    }

    const exercisesByCategory = ref(exercises.reduce((acc, exercise) => {
        const { primaryMuscles } = exercise;

        // Iterate over each muscle in the primaryMuscles array
        primaryMuscles.forEach((muscle) => {

            if (!categories.backCategory.includes(muscle) && !categories.allCategories.includes(muscle)) {
                return
            }

            if (categories.backCategory.includes(muscle)) {
                muscle = "back"
            }

            // If the muscle group doesn't exist in the accumulator, initialize it
            if (!acc[muscle]) {
                acc[muscle] = [];
            }

            // Add the exercise to the corresponding muscle group
            acc[muscle].push(exercise);
        });

        return acc;
    }, {}))
</script>

<style>
    .p-stepitem .p-steppanel-content {
        margin-inline-start: 0 !important;
    }

    .p-stepper-separator {
        display: none !important;
        margin-left: 0 !important;
    }
</style>