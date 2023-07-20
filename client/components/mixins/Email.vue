<script setup lang="ts">
import { Ref } from "vue";

const modalOpened: Ref<boolean> = ref(false);
const runtimeConfig = useRuntimeConfig();

const closeModal = () => {
  modalOpened.value = false;
}
</script>

<template>
  <div class="full-width text-align-center" v-if="runtimeConfig.public.newsletterUrl">
    <DsfrButton @click="modalOpened = true"
                icon="ri-mail-line">
      M'abonner à VigiEau
    </DsfrButton>
  </div>
  <DsfrModal :opened="modalOpened"
             title=" "
             @close="closeModal">
    <div>
      <iframe :src="runtimeConfig.public.newsletterUrl"
              allowfullscreen
              style="display: block;margin-left: auto;margin-right: auto;width: 100%;height: 50vh">
      </iframe>
    </div>
  </DsfrModal>
</template>