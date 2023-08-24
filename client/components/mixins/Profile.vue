<script setup lang="ts">
import { Ref } from "vue";
import { Profile } from "../../dto/profile.enum";

const props = defineProps({
  profile: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  profileUpdate: string
}>()

const selectedTagType: Ref<string> = ref('particulier');
const profileTags: Ref<any[]> = ref([]);

for (let profile in Profile) {
  profileTags.value.push({
    label: Profile[profile],
    type: profile
  })
}

const selectProfile = (profile: string) => {
  selectedTagType.value = profile;
  emit('profileUpdate', selectedTagType.value);
}

selectProfile(props.profile ? props.profile : selectedTagType.value);
</script>

<template>
  <div class="text-align-center full-width">
    <div>Agissez-vous en tant que ?</div>
    <DsfrTag v-for="tag in profileTags"
             :label="tag.label"
             class="fr-m-1w tag-lg"
             :selected="selectedTagType === tag.type"
             :disabled="disabled"
             @click="selectProfile(tag.type)"
             tag-name="button"/>
  </div>
</template>