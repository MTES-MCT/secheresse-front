<script setup lang="ts">
</script>

<template>
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12">
            <div class="fr-follow__newsletter">
              <div>
                <h2>Restez informé de la situation sécheresse sur votre territoire.</h2>
                <p class="fr-text--sm">Abonnez vous pour recevoir une alerte par mail dès que les restrictions vous concernant changent.</p>
                <router-link to="/abonnements/nouveau"
                             class="fr-btn fr-my-1w"
                             title="S‘abonner à notre lettre d’information">
                  Je m'abonne aux alertes mails
                </router-link>
              </div>
              <div>
                <img src="/newsletter_img.png"
                     style="max-width: 100%;"
                     width="260" height="500"
                     alt="Newsletter email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="scss">
@media screen and (max-width: 767px) {
  .fr-follow {
    text-align: center;
  }
}
</style>