<template>
	<crud :data="data" :bModel="bModel" :sort="sortedData" :preStore="preStore" :parent="this" :displayOptions="displayOptions">
        <template #hb><th class="px-4 py-2">Context</th></template>
        <template #bb="sp"><td class="border px-4 py-2">{{ sp.row.context }}</td></template>
        <template #pa="sp"><vSelect  label="choiceContext" v-model="sp.form.parent" :options="getOptions(sp.form)" /></template>
	</crud>

	
</template>

<style>

</style>

<script>
import crud from './Shared/CRUD.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import { useTags } from '~/stores/tags';


const tags = {}; //useTags()


export default {
	components: {
		crud,
        vSelect,
		QuillEditor,
	},
	data() {
		return {
      data: [],
			bModel: 'tags',
			canOpen: false,
            displayOptions: {
                textLabel: 'Name',
                textModel: 'name'
            }
		}
	},
  mounted() {
			find('tags')
        .then(resp => console.log(resp))
		},

    methods: {
        sortedData: function () {
            return tags.sortedData(this.data)
        },
        preStore: function (data) { console.log('pre', data)
            if (data.parent)
                data.parent_id = data.parent.id 
            return 
        },
        getOptions: function (form) {
            return []; //tags.getOptions(form, this.data)
        }
    },
	
}
</script>