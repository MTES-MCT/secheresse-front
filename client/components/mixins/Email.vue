<script setup lang="ts">
import { Ref } from "vue";
import api from "../../api";

const modalOpened: Ref<boolean> = ref(false);
const modalSuccessOpened: Ref<boolean> = ref(false);
const subscribing: Ref<boolean> = ref(false);

const closeModal = () => {
  modalOpened.value = false;
  modalSuccessOpened.value = false;
}

const subscribe = async (form: any) => {
  subscribing.value = true;
  const {data, error} = await api.subscribeMail(form);
  subscribing.value = false;
  closeModal();
  modalSuccessOpened.value = true;
}
</script>

<template>
  <div class="section-title fr-mb-4w">
    <div>
      Restez informé de la situation sécheresse sur votre territoire . Abonnez vous pour recevoir une alerte par mail dès que les
      restrictions vous concernant changent.
    </div>
    <DsfrButton @click="modalOpened = true"
                icon="ri-mail-line"
                class="fr-mt-1w">
      M'abonner à VigiEau
    </DsfrButton>
  </div>
  <DsfrModal :opened="modalOpened"
             title=" "
             @close="closeModal">
    <h1>M'abonner à VigiEau</h1>
    <p>Tenez vous au courant des changements de situation de votre territoire</p>
    <MailForm :subscribing="subscribing"
              @subscribe="subscribe($event)"
              @close="closeModal"/>
  </DsfrModal>
  <DsfrModal :opened="modalSuccessOpened"
             title=" "
             @close="closeModal">
    <h1>Vous êtes abonnés !</h1>
    <p>Le système de notification de changement de situation sur votre territoire sera mis en place fin 2023, vous recevrez un email lorsque
      celui-ci sera activé !</p>
  </DsfrModal>
</template>