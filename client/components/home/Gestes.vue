<script setup lang="ts">
import gestes from '../../data/gestes.json'
import { Ref } from "vue";
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";

const gesteTags: Ref<TagProps[]> = ref([{
  label: "À la maison",
  tagName: "button",
  icon: "fr-icon-home-4-line",
  selected: true
}, {
  label: "À l'extérieur",
  tagName: "button",
  icon: "ri-arrow-right-line",
  selected: false
}]);

const gestesFiltered = computed<any>(() => {
  return gestes.data.filter(g => g.home === (selectedTagIndex.value === 0));
})

const selectedTagIndex: Ref<number> = ref(0);
</script>

<template>
  <div class="gestes fr-grid-row fr-grid-row--center fr-pt-4w fr-pb-4w">
    <div class="section-title fr-mb-8w">
      <h1>Nous consommons 148 litres d’eau par jour et par personne !</h1>
      <span>En plus des restrictions, l’adoption des éco-gestes est un bon moyen de préserver les réserves d’eau et d’éviter que la situation s’aggrave. Voici quelques exemples d’habitudes à prendre pour limiter sa consommation d’eau à l’échelle individuelle.</span>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-8w">
      <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--center">
        <DsfrTag v-for="(tag, index) in gesteTags"
                 :label="tag.label"
                 class="fr-mx-2w"
                 :icon="tag.icon"
                 :selected="selectedTagIndex === index"
                 @click="selectedTagIndex = index"
                 tag-name="button"/>
      </div>
      <GestesCard v-for="geste in gestesFiltered"
                  :geste="geste"
      />
<!--      <GestesCardMore/>-->
    </div>
<!--    <span><b>Les mesures en litre d'eau annoncées sont des mesures moyennes constatées.</b></span>-->
  </div>
</template>

<style lang="scss">
.gestes {
  position: relative;

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
}
</style>