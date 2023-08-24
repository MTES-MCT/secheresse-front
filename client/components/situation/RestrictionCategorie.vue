<script setup lang="ts">
import { Zone } from "../../dto/zone.dto";
import { Usage } from "../../dto/usage.dto";
import { useAddressStore } from "../../store/address";

const props = defineProps<{
  thematique: any,
  zones: Zone[],
  light: boolean,
  expandedIndex: string | null
}>();

const emit = defineEmits(['update:expandedIndex']);
const adressStore = useAddressStore();
const {isParticulier} = adressStore;

const sameUsages = computed<boolean>(() => {
  if (!props.zones[0].usagesHash) {
    return false;
  }
  const usagesHash = props.zones[0].usagesHash;
  return props.zones.every(z => z.usagesHash === usagesHash);
});

const usagesFiltered = (zone: Zone): Usage[] => {
  return zone.usages.filter(u => u.thematique === props.thematique.thematique);
};

const accordionTitle = (zone: Zone): string => {
  switch (zone.type) {
    case 'SOU':
      return `Si j’utilise de l’eau de nappe souterraine provenant d’un puit, d’un forage, etc`
    case 'SUP':
      return `Si j’utilise de l’eau superficielle provenant de cours d’eau, plan d’eau, etc`
  }
};

const classObject = (rank: number | undefined): any => {
  const bgClass = `situation-level-bg-${rank}`;
  const cssClass: any = {}
  cssClass[bgClass] = true;
  return cssClass;
}

const badgeLabel = (zone: Zone): string => {
  return utils.getSituationBadgeLabel(utils.getRestrictionRank(zone));
};

const onAccordionClick = (index: string) => {
  const newIndex = index !== props.expandedIndex ? index : null;
  emit('update:expandedIndex', newIndex);
}
</script>

<template>
  <div class="fr-col-12" v-if="(zones.length > 1 && !sameUsages) || !isParticulier()">
    <DsfrAccordionsGroup>
      <li v-for="(zone, index) in zones">
        <DsfrAccordion :expanded-id="expandedIndex"
                       @expand="onAccordionClick(index.toString())"
                       :id="index.toString()">
          <template v-slot:title>
            <div class="full-width fr-grid-row fr-grid-row--space-between fr-grid-row--middle">
              <div class="fr-col-12 fr-col-md-8">
                {{ accordionTitle(zone) }}
              </div>
              <div class="fr-col-12 fr-col-md-4 text-align-right">
                <DsfrBadge small
                           class="fr-mr-1w"
                           :class="classObject(utils.getRestrictionRank(zone))"
                           type=""
                           :label="badgeLabel(zone)"/>
              </div>
            </div>
          </template>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-p-2w">
            <template v-if="usagesFiltered(zone).length > 0">
              <div v-for="usage in usagesFiltered(zone)"
                   class="fr-col-12 fr-col-md-4">
                <SituationRestrictionCard :usage="usage"
                                          :thematique="thematique"
                                          :departement="zone.departement"/>
              </div>
            </template>
            <template v-else>
              <div class="fr-col-12 fr-col-md-4">
                <div class="eau-card fr-p-2w">
                  <div class="eau-card__desc">
                    Aucune restriction
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div v-if="index === 0 && zones.length > 1">
            <p class="fr-mt-4w fr-mb-0">
              Attention ces restrictions s'appliquent à l'eau qui provient
              {{ zone.type === 'SUP' ? 'des cours d\'eau' : 'de nappes souterraines' }}. Si vous utilisez de l'eau qui provient
              {{ zone.type === 'SUP' ? 'de nappes souterraines' : 'des cours d\'eau' }}
              veuillez consulter les restrictions ci-dessous.</p>
          </div>
        </DsfrAccordion>
      </li>
    </DsfrAccordionsGroup>
  </div>
  <div class="fr-col-12 fr-grid-row fr-grid-row--gutters fr-grid-row--center" v-else>
    <template v-if="usagesFiltered(zones[0]).length > 0">
      <div v-for="usage in usagesFiltered(zones[0])"
           class="fr-col-12 fr-col-md-4">
        <SituationRestrictionCard :usage="usage"
                                  :thematique="thematique"
                                  :departement="zones[0].departement"/>
      </div>
    </template>
    <template v-else>
      <div class="fr-col-12 fr-col-md-4">
        <div class="eau-card fr-p-2w">
          <div class="eau-card__desc">
            Aucune restriction
          </div>
        </div>
      </div>
    </template>
  </div>
</template>