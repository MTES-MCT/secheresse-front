<script setup lang="ts">
import { Profile } from '../../dto/profile.enum';
import { Subscription } from '../../dto/subscription.dto';

const props = defineProps<{
  subscription: Subscription,
  loading; boolean
}>();
const emit = defineEmits<{
  unsubscribe: any;
}>();

const profiles = Profile;
const typesEau = {
  AEP: 'Eau potable',
  SOU: 'Eau souterraine',
  SUP: 'Eau de surface',
};
</script>

<template>
  <div class="fr-col-12 fr-col-md-4">
    <div class="eau-card fr-p-2w">
      <div class="h6 eau-card__title fr-my-2w">
        {{ subscription.libelleLocalisation }}
      </div>
      <div class="eau-card__desc">
        <DsfrTag :label="profiles[subscription.profil]" />
        <DsfrTag v-for="typeEau in subscription.typesEau"
                 class="fr-mx-1w fr-mb-1w"
                 :aria-pressed="true"
                 :label="typesEau[typeEau]" />
      </div>
      <div>
        <DsfrButton class="fr-mt-2w"
                    :disabled="loading"
                    @click="emit('unsubscribe')"
                    label="Me désabonner" />
      </div>
    </div>
  </div>
</template>
