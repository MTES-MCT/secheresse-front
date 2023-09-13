<script setup lang="ts">
defineProps<{
  content: string
  onHover?: boolean
  onClick?: boolean
  id: string,
}>();

const hover = ref(false);
const div = ref(null);
const tooltip = ref(null);

const translateTooltip = () => {
  const rect = div.value.getBoundingClientRect();
  const rectTooltip = tooltip.value.getBoundingClientRect();
  tooltip.value.style.transform = `translate(${rect.x + rect.width / 2 - (rectTooltip.width / 2)}px, ${rect.y - 50}px)`;
}

addEventListener('scroll', () => {
  hover.value = false;
});

watch(hover, () => {
  setTimeout(() => {
    translateTooltip();    
  })
})
</script>

<template>
  <div v-if="onHover">
    <div class="fr-link"
         ref="div"
         @mouseover="hover = true"
         @mouseleave="hover = false"
         :aria-describedby="id">
      <slot/>
    </div>
    <span class="fr-tooltip fr-placement fr-placement--top fr-placement--center"
          ref="tooltip"
          :class="{'fr-tooltip--shown': hover}"
          :id="id"
          role="tooltip"
          aria-hidden="true"
    >
    {{ content }}
    </span>
  </div>

  <div v-if="onClick">
    <button
      class="fr-btn--tooltip fr-btn"
      :aria-describedby="id"
    />
    <span
      class="fr-tooltip fr-placement"
      :id="id"
      role="tooltip"
      aria-hidden="true"
    >
    {{ content }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.fr-link {
  cursor: pointer;
}
</style>