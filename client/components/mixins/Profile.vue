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
  },
  required: {
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
  <div data-cy="ProfileSelection">
    <fieldset :required="required">
      <legend>Agissez-vous en tant que ? <span v-if="required" class="required">&nbsp;*</span></legend>
      <DsfrTag v-for="tag in profileTags"
               :label="tag.label"
               class="fr-m-1w tag-lg"
               :aria-pressed="selectedTagType === tag.type"
               :disabled="disabled"
               @click="selectProfile(tag.type)"
               tag-name="button"/>
    </fieldset>
  </div>
</template>