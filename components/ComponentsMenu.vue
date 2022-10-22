<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { availableLocales } from '~/utils/lang'

// micro compiler
const props = defineProps({
  type: {
    type: String,
    default: 'dropdown-right-top',
  },
})

// state
const currentStyle = toRef(props, 'type')
const localeSetting = useState<string>('locale.setting')
</script>

<template>
  <div class="flex items-center">
    <Listbox
      v-if="currentStyle === 'dropdown-right-top'"
      v-model="localeSetting"
      as="div"
      class="relative flex items-center"
    >
      <ListboxLabel class="sr-only">Components</ListboxLabel>
      <ListboxButton
        type="button"
        title="Work with Components"
        class="transition-colors duration-300"
      >
        <span class="justify-center items-center flex">
          Components
          <IconUil:angle-down />
        </span>
      </ListboxButton>
      <ListboxOptions
        class="p-1 absolute z-50 top-full right-0 outline-none bg-white rounded-lg ring-1 ring-gray-900/10 shadow-lg overflow-hidden w-36 py-1 text-sm text-gray-700 font-semibold dark:bg-gray-800 dark:ring-0 dark:highlight-white/5 dark:text-gray-300"
      >
        <ListboxOption

          :class="{
            'py-2 px-2 flex items-center cursor-pointer': true,
            'text-sky-500 bg-gray-100 dark:bg-gray-600/30':
              false,
            'hover:bg-gray-50 dark:hover:bg-gray-700/30':
              true,
          }"
        >
          <Anchor :to="{name: 'tags'}" >Tags</Anchor>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
    <div
      v-if="currentStyle === 'list'"
      class="w-full px-2 pr-3 py-1 outline-none rounded border bg-transparent text-gray-700 dark:text-gray-300 border-gray-900/10 dark:border-gray-50/[0.2]"
    >

      Components
        

        <Anchor class="px-4 flex items-center space-x-2" :to="{name: 'tags'}" >Tags</Anchor>

    </div>
  </div>
</template>
