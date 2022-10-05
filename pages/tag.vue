<script lang="ts" setup>
  import { reactive} from 'vue'
  import { useTags } from '~/stores/tags';
  import vSelect from "vue-select";  
  import 'vue-select/dist/vue-select.css';

  
  const tags = useTags()
  // composable
  const { t } = useLang()
  
  // compiler macro
  definePageMeta({
    layout: 'page',
  })


  const state = reactive({
    editMode: false,
    form: {},
    isOpen: false,
    tags: []
  })

  const openModal = function () {
    state.isOpen = true; 
          
    }

  const newTag = function() {
    state.form = {}
    state.isOpen = true
  }
  
  const { find, create, delete: _delete, update} = useStrapi4()
  
  const getOptions = function (tag) { 
    return tags.getOptions(tag, state.tags)
  }

  const deleteRow = async function (tag) {
    
    if (!confirm('Are you sure you want to remove?')) return;

    await _delete('tags', tag.id)
    state.tags.splice(state.tags.indexOf(tag), 1)
  }

  const edit = function(tag) {
    state.editMode = true
    state.form = { ...tag}
    if(state.form.parentId)
      state.form.parent = state.tags.find(e => e.id == state.form.parentId)
    console.log('form', state.form)
    state.isOpen = true
  }

  const cancel = function() {
    state.isOpen = false
  }

  const store = async function () {

    if(state.form.parent)
      state.form.parentId = state.form.parent.id

    let resp

    if (state.form.id) {
      let updates = {name: state.form.name,description: state.form.description, parentId: state.form.parentId}

      resp = await update('tags', state.form.id, updates)
    } else {
      resp = await create('tags', state.form)
    }

    state.isOpen = false
    console.log(resp)

  if (state.form.id) {
    let updatedTag = state.tags.find(e => e.id === state.form.id)
    Object.assign(updatedTag, resp.data.attributes)
  } else {

      state.tags.push(resp.data)
      Object.assign(resp.data, resp.data.attributes)

    }
    state.tags = tags.withHierarchy(state.tags)  
  }
  
  find('tags')
          .then(resp => {
            resp.data.forEach(e=>Object.assign(e, e.attributes));  state.tags = tags.withHierarchy(resp.data); console.log(state.tags)
          })
  
  </script>
  
  <template>
    <PageWrapper>
      <PageHeader>
        <PageTitle text="Tags" class="capitalize" />
      </PageHeader>
      <PageBody>

        <PageSection>
          <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
						
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg px-4 py-4">
                    <button @click="newTag" class="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3">+</button>

					<table class="table-fixed w-full">
						<thead>
                            <tr class="bg-gray-100">
                                <th style="width:35%"   class="px-4 py-2">Name</th>
								<slot name="ha"><th class="px-4 py-2">Context</th></slot>                                
								<slot name="hb"></slot>
								<th style="width:7%" class="menu px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in state.tags" :key="row.id">
                                <td :style="{ 'padding-left': row.level * 12 + 4 + 'px' }" class="border py-2">  {{ row.name}}</td>
                                <slot name="ba" :row="row"><td class="border px-4 py-2">{{ row.context }}</td></slot>

                                <td class="text-center border px-4 py-2">

										
											<span @click="edit(row)" class="text-base bg-green-300"><Icon class ="color:green" name="charm:pencil" /></span>
											<span class="text-base bg-yellow-200" @click="deleteRow(row)" ><Icon class ="color:red"  name="bi:trash" /></span>
							
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="fixed z-10 inset-0 overflow-y-auto ease-out duration-400" v-if="state.isOpen">
                      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        
                        <div class="fixed inset-0 transition-opacity">
                          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <!-- This element is to trick the browser into centering the modal contents. -->
                        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>​
                        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                          <form>
                          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						
                            <div class="">
                                  <div class="mb-4">
                                      <label for="exampleFormControlInput1" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                                      <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exampleFormControlInput1" placeholder="Enter Text - required" v-model="state.form.name" >

                                  </div>
                                  <div class="mb-4">
                                      <label for="exampleFormControlInput2" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exampleFormControlInput2" v-model="state.form.description" placeholder="Enter Description - optional"></textarea>
                                  </div>
                                  <vSelect  label="choiceContext" v-model="state.form.parent" :options="getOptions(form)" />
                            </div>
                          </div>
                          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                              <button wire:click.prevent="store()" type="button" class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5" @click="store(form)">
                                <span v-show="!state.editMode" >Save</span>
                                <span v-show="state.editMode" >Update</span>								
                              </button>
                            </span>

                            <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                              
                              <button @click="cancel" type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                Cancel
                              </button>
                            </span>
                          </div>
                          </form>
                          
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        </PageSection>
      </PageBody>
    </PageWrapper>
  </template>
  