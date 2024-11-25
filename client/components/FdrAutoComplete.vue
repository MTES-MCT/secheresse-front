<script setup lang="ts">
import { computed, nextTick, Ref, ref, watch } from 'vue';

const container = ref(undefined);
const optionsList = ref(undefined);
const optionSelected = ref(undefined);
const inputSearchBar: Ref<any> = ref(null);

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
  displayKey: {
    type: String,
    default: () => null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  ariaLabelList: {
    type: String,
    default: '',
  },
  light: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'search']);

const hasFocus = ref(true);
const displayOptions = computed(() => !!props.options.length);

function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function selectOption(option) {
  optionSelected.value = option;
  emit('update:modelValue', option);
  inputSearchBar.value?.focus();
}

const displayAtTheTop = ref(false);

const looseFocus = () => {
  setTimeout(() => {
    hasFocus.value = false;
  }, 100);
};

watch(displayOptions, () => {
  if (displayOptions.value) {
    const posContainerY = container.value.offsetTop;
    const containerHeight = container.value.offsetHeight;
    const screenHeight = document.body.scrollHeight;
    const optionsHeight = convertRemToPixels(17);
    const isTooLow = (optionsHeight + posContainerY + containerHeight) > screenHeight;

    displayAtTheTop.value = isTooLow;
  }
});

const activeOption = ref(-1);

const isVisible = function(ele, container) {
  const { bottom, height, top } = ele.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return top <= containerRect.top
    ? containerRect.top - top <= height
    : bottom - containerRect.bottom <= height;
};

function checkIfActiveOptionIsVisible() {
  const activeLi = optionsList.value.querySelectorAll('li')[activeOption.value];
  const isLiVisible = isVisible(activeLi, optionsList.value);

  if (!isLiVisible) {
    // Scroll to activeLi
    activeLi.scrollIntoView({ behavior: 'smooth' });
  }
}

function moveToPreviousOption() {
  const isFirst = activeOption.value <= 0;
  activeOption.value = isFirst ? props.options.length - 1 : activeOption.value - 1;
  nextTick().then(checkIfActiveOptionIsVisible);
}

function moveToNextOption() {
  const isLast = activeOption.value >= (props.options.length - 1);
  activeOption.value = isLast ? 0 : activeOption.value + 1;
  nextTick().then(checkIfActiveOptionIsVisible);
}

function checkKeyboardNav($event) {
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes($event.key)) {
    $event.preventDefault();
  }
  if ($event.key === 'Enter') {
    selectOption(props.options[activeOption.value >= 0 ? activeOption.value : 0]);
    hasFocus.value = false;
  } else if ($event.key === 'ArrowUp') {
    moveToPreviousOption();
  } else if ($event.key === 'ArrowDown') {
    moveToNextOption();
  } else if ($event.key === 'search') {
    if (props.options.length) {
      selectOption(props.options[activeOption.value >= 0 ? activeOption.value : 0]);
    } else if (optionSelected.value) {
      emit('update:modelValue', optionSelected.value);
    }
  }
}

function displayOption(option) {
  if (!props.displayKey) {
    return option;
  }
  const keys = props.displayKey.split('.');
  let toDisplay = option;
  keys.forEach(k => {
    toDisplay = toDisplay[k];
  });
  return toDisplay;
}

defineExpose({
  focusInput: () => inputSearchBar.value.focus(),
});

</script>

<template>
  <div ref="container"
       class="relative search-autocomplete">
    <div class="fr-search-bar">
      <DsfrInput label-visible
                 :model-value="modelValue"
                 :hint="placeholder"
                 :label="label"
                 v-bind="$attrs"
                 :required="required"
                 :large="!light"
                 :disabled="disabled"
                 role="combobox"
                 aria-autocomplete="list"
                 aria-expanded="true"
                 :aria-haspopup="displayOptions"
                 :autocomplete="hasFocus ? 'off' : 'address-line1'"
                 buttonText="Rechercher"
                 @update:model-value="$emit('update:modelValue', $event)"
                 ref="inputSearchBar"
                 @focus="hasFocus = true"
                 @blur="looseFocus()"
                 @keydown="checkKeyboardNav($event)" />
      <DsfrButton title="Rechercher"
                  :disabled="disabled"
                  :aria-disabled="disabled"
                  @click="checkKeyboardNav({key: 'search'})">
        Rechercher
      </DsfrButton>
      <div v-show="displayOptions"
           class="fr-sr-only"
           aria-live="polite"
           aria-atomic="true">
        <p>{{ options.length }} options disponibles</p>
      </div>
      <ul v-show="displayOptions"
          role="listbox"
          :aria-label="ariaLabelList"
          ref="optionsList"
          tabindex="1"
          class="list-none absolute m-0 right-0 z-1 left-0 bg-white box-shadow max-h-17 scroll pointer"
          :class="{'at-the-top': displayAtTheTop,}">
        <li v-for="(option, i) of options"
            :key="option"
            role="option"
            tabindex="0"
            :aria-selected="optionSelected === option"
            class="list-item fr-p-1w fr-pl-2w"
            :class="{ 'active-option': activeOption === i }"
            @click.stop="selectOption(option)"
            @keyup.enter="selectOption(option)">
          {{ displayOption(option) }}
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped lang="scss">
.box-shadow {
  box-shadow: 0px 16px 16px -16px rgba(0, 0, 0, 0.32), 0px 8px 16px rgba(0, 0, 0, 0.1);
}

.max-h-17 {
  max-height: 17rem;
}

.scroll {
  overflow: auto;
}

.at-the-top {
  bottom: 2.8rem;
  box-shadow: 0px -16px 16px -16px rgba(0, 0, 0, 0.32), 0px -8px 16px rgba(0, 0, 0, 0.1);
}

.list-item.active-option,
.list-item:hover {
  background-color: var(--blue-france-sun-113-625);
  color: white;
}

.search-autocomplete {
  position: relative;

  ul {
    position: absolute;
    width: 100%;
    z-index: 10;
    background-color: var(--grey-950-100);
    list-style-type: none;
    margin-top: 0;
    padding: 0;
    text-align: left;
    top: 100%;

    li {
      cursor: pointer;
    }
  }
}

.fr-search-bar {
  flex-wrap: wrap;

  :deep(.fr-input), .fr-btn {
    margin-top: .5rem;
    flex: 1;
  }

  :deep(.fr-label) {
    width: 100%;
    height: auto;
    position: relative;
  }

  /**
 * Obligé de faire ça car la couleur est codée en dur dans le DSFR
 * sans prendre en compte que ce champ pouvait être disabled.
 */
  .fr-input:disabled {
    box-shadow: inset 0 -2px 0 0 var(--border-disabled-grey);
    color: var(--text-disabled-grey);
  }
}
</style>