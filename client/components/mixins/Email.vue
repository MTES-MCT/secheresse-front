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
  if (!error.value) {
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
                <h2>Restez informé de la situation sécheresse sur votre territoire.</h2>
                <p class="fr-text--sm">Abonnez vous pour recevoir une alerte par mail dès que les restrictions vous concernant changent.</p>
                <button class="fr-btn fr-my-1w"
                        @click="modalOpened = true"
                        title="S‘abonner à notre lettre d’information">
                  Je m'abonne aux alertes mails
                </button>
              </div>
              <div>
                <img src="/newsletter_img.png"
                     style="max-width: 100%;"
                     width="260" height="500"
                     title="Image d'illustration newsletter email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <p>Le système de notification de changement de situation sur votre territoire sera mis en place très prochainement, vous recevrez un
      email lorsque celui-ci sera activé !</p>
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
  width: 100%;
  height: 570px;
}

.fr-follow {
  position: absolute;
  width: 100vw;
  max-width: 100%;
  left: 0;
}

@media screen and (max-width: 767px) {
  .follow-wrap {
    height: 754px;
  }

  .fr-follow {
    text-align: center;
  }
}
</style>