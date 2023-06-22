<script setup lang="ts">
const props = defineProps<{
  percent: number,
  icon: string,
  description: string
}>();
</script>

<template>
  <div class="repartition">
    <div class="small c100 center" :class="'p' + percent">
      <span><VIcon :name="icon" scale="2.5"/></span>
      <div class="slice">
        <div class="bar"></div>
        <div class="fill"></div>
      </div>
    </div>
    <div class="repartition--desc">
      <b>{{ percent }}%</b><br/>
      {{ description }}
    </div>
  </div>
</template>

<style lang="scss">
.repartition {
  width: calc(1000px/8);
  font-size: 0.9rem;
  line-height: 1.2rem;
}
</style>