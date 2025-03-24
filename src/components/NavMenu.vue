<template>
    <nav class="bg-surface-950 p-4 flex justify-between items-center">
        <div class="text-white text-2xl font-bold flex items-center gap-1">Cafit<i class="pi pi-mars"></i></div>
        <div class="flex space-x-4">
            <Button @click="$router.push({ name: 'home' })" label="Home" class="p-button-text text-white" />
            <Button @click="$router.push({ name: 'about' })" label="About" class="p-button-text text-white" />
            <Button @click="$router.push({ name: 'contact' })" label="Contact" class="p-button-text text-white" />
        </div>
    </nav>
</template>

<script setup>
    import Button from 'primevue/button';
</script>
