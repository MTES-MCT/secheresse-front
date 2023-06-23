<script setup lang="ts">
import { Restriction } from "../../dto/restriction.dto";
import utils from "../../utils";
import { Usage } from "~/client/dto/usage.dto";

const props = defineProps<{
  thematique: string,
  restrictions: Restriction[],
  light: boolean,
  expandedIndex: string | null
}>();

const emit = defineEmits(['update:expandedIndex']);

const restrictionsAccordion: Restriction[] = [...props.restrictions];
restrictionsAccordion.shift();

const sameUsages = computed<boolean>(() => {
  if (!props.restrictions[0].usagesHash) {
    return false;
  }
  const usagesHash = props.restrictions[0].usagesHash;
  return props.restrictions.every(r => r.usagesHash === usagesHash);
});

const usagesFiltered = (restriction: Restriction): Usage[] => {
  return restriction.usages.filter(u => u.thematique === props.thematique);
};

const accordionTitle = (restriction, light: boolean = false): string => {
  switch (restriction.type) {
    case 'SOU':
      return !light ? `Si j'utilise de l'eau qui provient de nappes souterraines (formations géologiques, aquifères, puits ...) des restrictions différentes s'appliquent` :
        `de nappes souterraines (formations géologiques, aquifères, puits ...)`
    case 'SUP':
      return !light ? `Si j'utilise de l'eau qui provient des cours d'eau (étangs, mares, rivières, lacs ...) des restrictions différentes s'appliquent` :
        `des cours d'eau (étangs, mares, rivières, lacs ...)`
  }
};

const classObject = (rank: number | undefined): any => {
  const bgClass = `situation-level-bg-${rank}`;
  const cssClass: any = {}
  cssClass[bgClass] = true;
  return cssClass;
}

const badgeLabel = (restriction: Restriction): string => {
  return utils.getSituationLabel(utils.getRestrictionRank(restriction));
};

const onAccordionClick = (index: string) => {
  const newIndex = index !== props.expandedIndex ? index : null;
  emit('update:expandedIndex', newIndex);
}
</script>

<template>
  <div class="fr-col-12 fr-grid-row fr-grid-row--gutters fr-grid-row--center">
    <template v-if="usagesFiltered(restrictions[0]).length > 0">
      <div v-for="usage in usagesFiltered(restrictions[0])"
           class="fr-col-12 fr-col-md-4">
        <SituationRestrictionCard :usage="usage"/>
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
  <div class="fr-col-12" v-if="restrictions.length > 1 && !sameUsages">
    <div>
      <p>
        Ces restrictions s'appliquent à l'eau qui provient {{ accordionTitle(restrictions[0], true) }}.</p>
    </div>
    <DsfrAccordionsGroup>
      <li v-for="(restriction, index) in restrictionsAccordion">
        <DsfrAccordion :expanded-id="expandedIndex"
                       @expand="onAccordionClick(index.toString())"
                       :id="index.toString()">
          <template v-slot:title>
            <div class="full-width fr-grid-row fr-grid-row--space-between fr-grid-row--middle">
              <div class="fr-col-12 fr-col-md-8">
                {{ accordionTitle(restriction) }}
              </div>
              <div class="fr-col-12 fr-col-md-4">
                <DsfrBadge small
                           class="fr-mr-1w"
                           :class="classObject(utils.getRestrictionRank(restriction))"
                           type=""
                           :label="badgeLabel(restriction)"/>
              </div>
            </div>
          </template>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-p-2w">
            <template v-if="usagesFiltered(restriction).length > 0">
              <div v-for="usage in usagesFiltered(restriction)"
                   class="fr-col-12 fr-col-md-4">
                <SituationRestrictionCard :usage="usage"/>
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
        </DsfrAccordion>
      </li>
    </DsfrAccordionsGroup>
  </div>
</template>

<style lang="scss" scoped>
.fr-accordion .fr-collapse > .fr-grid-row {
  background-color: var(--blue-france-975-75);
}

.eau-card {
  background-color: var(--background-default-grey);
}

@media screen and (min-width: 768px) {
  .fr-accordion__title .fr-grid-row > div:nth-child(2) {
    text-align: right;
  }
}

@media screen and (max-width: 767px) {
  .fr-accordion__title .fr-grid-row > div {
    text-align: center;

    .fr-badge {
      margin-top: 8px;
    }
  }
}
</style>