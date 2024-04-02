<script setup lang="ts">
import { Ref } from "vue";

const date = computed(() => {
  const today = new Date();
  const options = {year: 'numeric', month: 'long', day: 'numeric'};
  return today.toLocaleDateString('fr-FR', options);
});
const tabTitles = [
  {title: 'Carte'},
  {title: 'Données'}
];
const selectedTabIndex: Ref<number> = ref(0);
</script>

<template>
  <div class="carte-wrapper fr-py-4w">
    <div class="fr-container">
      <div class="section-title fr-mb-4w">
        <h2 class="fr-mb-0">Carte des restrictions</h2>
        <span>Arrêtés publiés avant le {{ date }}</span>
      </div>
      <DsfrTabs :tab-titles="tabTitles"
                :initial-selected-index="selectedTabIndex"
                @select-tab="selectedTabIndex = $event">
        <DsfrTabContent
          panel-id="tab-content-0"
          tab-id="tab-0"
          :selected="selectedTabIndex === 0">
          <CarteMap/>
        </DsfrTabContent>
        <DsfrTabContent
          panel-id="tab-content-1"
          tab-id="tab-1"
          :selected="selectedTabIndex === 1">
          <CarteTable/>
        </DsfrTabContent>
      </DsfrTabs>      
    </div>
  </div>
</template>

<style scoped lang="scss">
.carte-wrapper {
  background: var(--yellow-tournesol-975-75);
}

.fr-tabs {
  box-shadow: none;

  &:before {
    box-shadow: none;
  }

  &__panel {
    padding-top: 0;
    padding-bottom: 0;
    z-index: 1;
    
    &:last-child {
      background-color: var(--background-alt-grey);      
    }
  }
}
</style>