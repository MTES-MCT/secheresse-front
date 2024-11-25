<script setup lang="ts">
import gestes from '../../data/gestes.json'
import { Ref } from "vue";
import { Icon } from '@iconify/vue';

const gesteTags: Ref<any[]> = ref([{
  label: "À la maison",
  icon: "eau-maison",
  home: true
}, {
  label: "À l'extérieur",
  icon: "eau-soleil",
  home: false
}]);

const gestesFiltered = (tag: any) => {
  return gestes.data.filter(g => g.home === tag.home);
};

const selectedTagIndex: Ref<number> = ref(0);
</script>

<template>
  <div class="gestes fr-container fr-grid-row fr-grid-row--center fr-py-4w">
    <div class="section-title">
      <h2>Nous consommons 148 litres d’eau potable par jour et par personne !</h2>
    </div>
    <div class="fr-col-12 fr-grid-row fr-grid-row--center fr-grid-row--middle">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrPicture src="/repartition_consommation.svg"
                     size="small"
                     alt="Répartition de la consommation d'eau potable des français selon les usages. 39% - Se laver, 20% - Aller au WC, 12% - Laver son linge, 10% - Faire la vaisselle, 6% - Cuisiner, 6% - Laver sa voiture ou arroser son jardin, 1% - Boire, 6% - Divers. Source : Ademe"
                     legend="Source&nbsp;: Ademe"
        />
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <GestesCallout class="fr-p-4w"/>
      </div>
    </div>
    <div class="section-title">
      <h2 class="fr-mt-4w">Comment réduire votre consommation d'eau ?</h2>
      <p>En plus des restrictions, l’adoption des éco-gestes est un bon moyen de préserver les ressources en eau et d’éviter que la situation s’aggrave. Voici quelques exemples d’habitudes à prendre pour limiter sa consommation d’eau à l’échelle individuelle.</p>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--center">
        <DsfrTag v-for="(tag, index) in gesteTags"
                 class="fr-mx-1w tag-lg"
                 :aria-pressed="selectedTagIndex === index"
                 @click="selectedTagIndex = index"
                 tag-name="button">
          <Icon :icon="'vigieau:' + tag.icon" class="fr-mr-1w" />
          {{ tag.label }}
        </DsfrTag>
      </div>
      <DsfrTabs class="tabs-light" v-model="selectedTagIndex">
        <DsfrTabContent v-for="(tag, index) in gesteTags"
                        :panel-id="'tab-content-' + index"
                        :tab-id="'tab-' + index"
                        role="">
          <div class="fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <GestesCard v-for="geste in gestesFiltered(tag)"
                        :geste="geste"
            />
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
</template>

<style lang="scss">
.gestes {
  position: relative;

  .section-title {
    max-width: 1000px;
  }

  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100%;
    left: 50%;
    top: 0;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: linear-gradient(180deg, var(--yellow-tournesol-975-75), var(--blue-france-850-200));
    opacity: 0.5;
    z-index: -1;
  }

  img {
    aspect-ratio: auto !important;
  }
}
</style>