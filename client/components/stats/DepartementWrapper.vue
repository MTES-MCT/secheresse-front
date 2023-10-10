<script setup lang="ts">
import { Ref } from "vue";

const props = defineProps<{
  stats: any
}>();

const tabTitles = [
  {title: 'Carte'},
  {title: 'Données'}
];
const selectedTabIndex: Ref<number> = ref(0);
</script>

<template>
  <DsfrCallout title="Répartition géographique des recherches sur les 30 derniers jours">
    <DsfrTabs :tab-titles="tabTitles"
              :initial-selected-index="selectedTabIndex"
              @select-tab="selectedTabIndex = $event">
      <DsfrTabContent
        panel-id="tab-content-0"
        tab-id="tab-0"
        :selected="selectedTabIndex === 0">
        <StatsDepartementMap :stats="stats"/>
      </DsfrTabContent>
      <DsfrTabContent
        panel-id="tab-content-1"
        tab-id="tab-1"
        :selected="selectedTabIndex === 1">
        <div  class="fr-mt-2w">
          <StatsDepartementTable :stats="stats"/>          
        </div>
      </DsfrTabContent>
    </DsfrTabs>
  </DsfrCallout>
</template>

<style scoped lang="scss">
.fr-tabs {
  box-shadow: none;

  &:before {
    box-shadow: none;
  }

  &__panel {
    padding-top: 0;
    padding-bottom: 0;
    z-index: 1;
    background-color: var(--background-alt-grey);
  }
}
</style>