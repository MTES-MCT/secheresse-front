<script setup lang="ts">
import faq from '../../data/faq.json'
import { Ref } from "vue";

const expandedIndex: Ref<string | null> = ref(null);

const onAccordionClick = (index: string) => {
  expandedIndex.value = index !== expandedIndex.value ? index : null;
}
</script>

<template>
  <div class="faq fr-mt-8w">
    <div class="section-title fr-mb-8w">
      <h1>Les questions fréquemment posées</h1>
    </div>
    <div class="section-title">
      <DsfrAccordionsGroup>
        <li v-for="(item, index) in faq.data">
          <DsfrAccordion :title="item.question"
                         :expanded-id="expandedIndex"
                         @click="onAccordionClick(index.toString())"
                         :id="index.toString()">
            {{ item.response }}
          </DsfrAccordion>
        </li>
      </DsfrAccordionsGroup>
      <div class="fr-mt-2w">
        Vous souhaitez-nous poser une question qui n’apparaît pas ici ?
        <a class="fr-link"
           title="Contactez-nous"
           href="mailto:test@test.com">
          Contactez nous
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.section-title:nth-child(2) {
  text-align: left;
}
</style>