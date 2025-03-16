<template>
  <div class="bg-surface-950 flex items-center min-h-screen px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-100 text-center flex flex-col items-center gap-4">

      <div class="text-primary font-bold text-lg leading-tight"><i
          class="pi pi-discord !text-lg !leading-none" />&nbsp;POWERED BY MADARAW</div>
      <div class="text-surface-0 font-bold text-4xl leading-tight">Your Fitness Journey Starts Here.</div>
      <div class="text-surface-100 text-xl leading-normal">Build a personalized workout plan tailored to your goals and
        preferences.</div>
      <Button @click="createWorkout" label="Create Workout" rounded class="mt-4" />
    </div>
  </div>
</template>
<script setup>
  import Button from 'primevue/button';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const createWorkout = () => {
    router.push({ name: 'WorkoutSetup' })
  }
</script>
