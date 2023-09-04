<script setup lang="ts">
import { Ref } from "vue";
import api from "../../api";

const modalOpened: Ref<boolean> = ref(false);
const modalSuccessOpened: Ref<boolean> = ref(false);
const modalErrorOpened: Ref<boolean> = ref(false);
const subscribing: Ref<boolean> = ref(false);

const closeModal = () => {
  modalOpened.value = false;
  modalSuccessOpened.value = false;
  modalErrorOpened.value = false;
}

const subscribe = async (form: any) => {
  subscribing.value = true;
  const {data, error} = await api.subscribeMail(form);
  subscribing.value = false;
  closeModal();
  if(!error.value) {
    modalSuccessOpened.value = true;    
  } else {
    modalErrorOpened.value = true;
  }
}
</script>

<template>
  <div class="follow-wrap fr-mt-4w">
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-follow__newsletter">
              <div>
                <h2 class="fr-h5">Restez informé de la situation sécheresse sur votre territoire.</h2>
                <p class="fr-text--sm">Abonnez vous pour recevoir une alerte par mail dès que les restrictions vous concernant changent.</p>
              </div>
              <div>
                <button class="fr-btn" title="S‘abonner à notre lettre d’information" @click="() => modalOpened = true">
                  Je m'abonne
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <DsfrFollow>-->
    <!--      <div class="fr-col-12">-->
    <!--        <DsfrNewsLetter title="Restez informé de la situation sécheresse sur votre territoire."-->
    <!--                        description="Abonnez vous pour recevoir une alerte par mail dès que les restrictions vous concernant changent."-->
    <!--                        :buttonAction="() => modalOpened = true"-->
    <!--                        :onlyCallout="true"/>-->
    <!--      </div>-->
    <!--    </DsfrFollow>-->
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
    <p>Le système de notification de changement de situation sur votre territoire sera mis en place très prochainement, vous recevrez un email lorsque celui-ci sera activé !</p>
  </DsfrModal>
  <DsfrModal :opened="modalErrorOpened"
             title=" "
             @close="closeModal">
    <h1>Une erreur est survenue !</h1>
    <p>Veuillez ré-essayer avec une autre adresse.</p>
  </DsfrModal>
</template>

<style scoped lang="scss">
.follow-wrap {
  height: 176px;
}

.fr-follow {
  position: absolute;
  width: 100vw;
  max-width:100%;
  left: 0;
}

@media screen and (max-width: 637px) {
  .follow-wrap {
    height: 216px;
  }
}

@media screen and (max-width: 342px) {
  .follow-wrap {
    height: 268px;
  }
}
</style>