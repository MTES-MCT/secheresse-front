<script setup lang="ts">
import { Ref } from "vue";
import laws from '../../../data/laws.json';

const selectedTabIndex: Ref<number> = ref(0);
const lawsCategories: Ref<any[]> = ref([
  {title: 'Les interdictions', tabId: 'interdictions'},
  {title: 'Les limitations', tabId: 'limitations'},
  {title: 'Sensibiliation', tabId: 'sensibilisation'}
]);
</script>

<template>
  <DsfrTabs :tab-titles="lawsCategories"
            tab-list-name="LawsTable"
            :initial-selected-index="selectedTabIndex"
            @select-tab="selectedTabIndex = $event">
    <DsfrTabContent panel-id="interdictions"
                    :selected="selectedTabIndex === 0"
                    tab-id="tab-0">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div v-for="law in laws.data"
             class="fr-col-12 fr-col-md-4 fr-col-lg-3">
          <DsfrCard link="https://www.systeme-de-design.gouv.fr/"
                    :title="law.title"
                    imgSrc="/card_bg.svg"
                    description="En savoir plus"
                    :detail="null"
          />
        </div>
      </div>
    </DsfrTabContent>
    <DsfrTabContent panel-id="limitations"
                    :selected="selectedTabIndex === 1"
                    tab-id="tab-1">
      <div>Contenu 1 avec d'autres composants</div>
    </DsfrTabContent>
    <DsfrTabContent panel-id="sensibilisation"
                    :selected="selectedTabIndex === 2"
                    tab-id="tab-2">
      <div>Contenu 1 avec d'autres composants</div>
    </DsfrTabContent>
  </DsfrTabs>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}
</style>