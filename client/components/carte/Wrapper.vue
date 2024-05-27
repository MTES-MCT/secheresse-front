<script setup lang="ts">
import { Ref } from 'vue';

const props = defineProps<{
  embedded: any
}>();

// const date = computed(() => {
//   const today = new Date();
//   const options = {year: 'numeric', month: 'long', day: 'numeric'};
//   return today.toLocaleDateString('fr-FR', options);
// });
const tabTitles = [
  { title: 'Carte' },
  { title: 'Données' },
];
const selectedTabIndex: Ref<number> = ref(0);
const dateCarte = ref(new Date().toISOString().split('T')[0]);
const currentDate = new Date();
</script>

<template>
  <div :class="embedded ? '' : 'carte-wrapper fr-py-4w'">
    <div class="fr-container">
      <div v-if="!embedded" class="section-title fr-mb-4w">
        <h2 class="fr-mb-0">Carte et historique</h2>
        <DsfrInput
          id="dateCarte"
          v-model="dateCarte"
          label="Situation en date du"
          label-visible
          type="date"
          name="dateCarte"
          min="2012-01-01"
          :max="currentDate.toISOString().split('T')[0]"
        />
      </div>
      <DsfrTabs :tab-titles="tabTitles"
                :initial-selected-index="selectedTabIndex"
                @select-tab="selectedTabIndex = $event">
        <DsfrTabContent
          panel-id="tab-content-0"
          tab-id="tab-0"
          :selected="selectedTabIndex === 0">
          <CarteMap :embedded="embedded"
                    :date="dateCarte" />
        </DsfrTabContent>
        <DsfrTabContent
          panel-id="tab-content-1"
          tab-id="tab-1"
          :selected="selectedTabIndex === 1">
          <CarteTable />
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
    padding: 0;
    z-index: 1;

    &:last-child {
      background-color: var(--background-alt-grey);
    }
  }
}
</style>