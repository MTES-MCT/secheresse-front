<script setup lang="ts">
import { Ref } from 'vue';

const props = defineProps<{
  embedded: any
}>();

const tabTitles = [
  { title: 'Carte', tabId: 'tab-0', panelId: 'tab-content-0' },
  { title: 'Données', tabId: 'tab-1', panelId: 'tab-content-1' },
];
const selectedTabIndex: Ref<number> = ref(0);
const dateCarte = ref(new Date().toISOString().split('T')[0]);
</script>

<template>
  <div :class="embedded ? '' : 'fr-py-4w'">
    <div class="fr-container">
      <div class="fr-mb-4w">
        <h2 class="fr-mb-0">Carte des restrictions</h2>
        <p>Arrêtés publiés avant le {{ dateCarte }}</p>
      </div>
      <DsfrTabs :tab-titles="tabTitles"
                v-model="selectedTabIndex">
        <DsfrTabContent panel-id="tab-content-0"
                        tab-id="tab-0">
          <div class="wrap-map">
            <CarteMap :embedded="embedded"
                      :date="dateCarte" />
          </div>
        </DsfrTabContent>
        <DsfrTabContent panel-id="tab-content-1"
                        tab-id="tab-1">
          <CarteTable :date="dateCarte" />
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fr-tabs {
  box-shadow: none;
  overflow: visible;

  &:before {
    box-shadow: none;
  }

  &__panel {
    padding: 0;
    z-index: 1;
    overflow: visible;

    &:last-child {
      background-color: var(--background-alt-grey);
    }
  }
}

.wrap-map {
  position: relative;
  width: 100%;
  height: calc(100vh - 250px);
}

@media screen and (max-width: 767px) {
  .wrap-map {
    height: 90vh;
  }
}
</style>