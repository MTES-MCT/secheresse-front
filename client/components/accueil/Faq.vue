<script setup lang="ts">
import faq from '../../data/faq.json'
import { Ref } from "vue";

const expandedIndex: Ref<string | null> = ref(null);
const domainName = useRuntimeConfig().public.domainName;
const email = useRuntimeConfig().public.email;
const onAccordionClick = (index: string) => {
  expandedIndex.value = index !== expandedIndex.value ? index : null;
}
</script>

<template>
  <div class="faq fr-container fr-mt-4w">
    <div class="section-title fr-mb-8w">
      <h2>Les questions fréquemment posées</h2>
    </div>
    <div class="section-title">
      <DsfrAccordionsGroup>
        <template v-for="(category, x) in faq.categories">
          <h3 class="fr-mt-4w h6">{{ category.name }}</h3>
          <li v-for="(item, y) in category.data">
            <DsfrAccordion :title="item.question"
                           :expanded-id="expandedIndex"
                           @expand="onAccordionClick(x.toString() + y.toString())"
                           :id="x.toString() + y.toString()">
              <div v-html="item.response"></div>
            </DsfrAccordion>
          </li>
        </template>
      </DsfrAccordionsGroup>
      <div class="fr-mt-2w">
        Vous souhaitez-nous poser une question qui n’apparaît pas ici ?
        <a class="fr-link"
           :title="`Contactez-nous sur ${email}`"
           :href="`mailto:${email}`">
          Contactez nous sur {{ email }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-title:last-child {
  text-align: left;
}
</style>