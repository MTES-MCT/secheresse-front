<script setup lang="ts">
import { Restriction } from "../../dto/restriction.dto";
import utils from "../../utils";
import { Ref } from "vue";
import { Usage } from "~/client/dto/usage.dto";

const props = defineProps<{
  thematique: string,
  restrictions: Restriction[],
  light: boolean,
}>();
const expandedIndex: Ref<string | null> = ref('0');
const restrictionsSurcharged: Ref<Restriction[]> = ref([]);

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

const accordionTitle = (restriction): string => {
  switch (restriction.type) {
    case 'SOU':
      return 'Si j\'utilise de l\'eau qui provient de nappes souterraines'
    case 'SUP':
      return 'Si j\'utilise de l\'eau qui provient des cours d\'eau'
    case 'DEFAULT':
      return 'Je ne sais pas d\'où provient mon eau'
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
  expandedIndex.value = index !== expandedIndex.value ? index : null;
}

if(props.restrictions.length > 1 && !sameUsages.value) {
  const defaultRestriction = {...props.restrictions[0]};
  defaultRestriction.type = 'DEFAULT';
  restrictionsSurcharged.value = [...props.restrictions];
  restrictionsSurcharged.value.unshift(defaultRestriction);  
}
</script>

<template>
  <div class="fr-col-12" v-if="restrictions.length > 1 && !sameUsages">
    <DsfrAccordionsGroup>
      <li v-for="(restriction, index) in restrictionsSurcharged">
        <DsfrAccordion :expanded-id="expandedIndex"
                       @expand="onAccordionClick(index.toString())"
                       :id="index.toString()">
          <template v-slot:title>
            <div class="full-width fr-grid-row fr-grid-row--space-between fr-grid-row--middle">
              <div class="fr-col-12 fr-col-md-7">
                {{ accordionTitle(restriction) }}
              </div>
              <div class="fr-col-12 fr-col-md-5">
                <DsfrBadge small
                           class="fr-mr-1w"
                           :class="classObject(utils.getRestrictionRank(restriction))"
                           type=""
                           :label="badgeLabel(restriction)"/>
              </div>
            </div>
          </template>
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <template v-if="usagesFiltered(restriction).length > 0">
              <div v-for="usage in usagesFiltered(restriction)"
                   class="fr-col-12 fr-col-md-4 fr-col-lg-3">
                <SituationRestrictionCard :usage="usage"/>
              </div>
            </template>
            <template v-else>
              <div class="fr-col-12 fr-col-md-4 fr-col-lg-3">
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
  <div class="fr-col-12 fr-grid-row fr-grid-row--gutters fr-grid-row--center" v-else>
    <template v-if="usagesFiltered(restrictions[0]).length > 0">
      <div v-for="usage in usagesFiltered(restrictions[0])"
           class="fr-col-12 fr-col-md-4 fr-col-lg-3">
        <SituationRestrictionCard :usage="usage"/>
      </div>
    </template>
    <template v-else>
      <div class="fr-col-12 fr-col-md-4 fr-col-lg-3">
        <div class="eau-card fr-p-2w">
          <div class="eau-card__desc">
            Aucune restriction
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.fr-accordion .fr-collapse > .fr-grid-row {
  background-color: var(--grey-975-75);
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