<script lang="ts" setup>
  import { reactive} from 'vue'
  import { useTags } from '~/stores/tags';
  import vSelect from "vue-select";  
  import 'vue-select/dist/vue-select.css';

  
  const tagUtils = useTags()
  // composable
  const { t } = useLang()
  
  // compiler macro
  definePageMeta({
    layout: 'page',
  })

  let tags = []

  const state = reactive({
    editMode: false,
    form: {},
    isOpen: false,
    activities: [],
    timer: false,
    timeDisplay: '--:--:--',
    timerStart: null,
  })

  const openModal = function () {
    state.isOpen = true; 
          
    }

  const newRow = function() {
    state.editMode = false
    state.form = {}
    state.isOpen = true
  }
  
  const { find, create, delete: _delete, update} = useStrapi4()
  const user = useStrapiUser().value
  
  const getOptions = function (row) { 
    return tagUtils.getOptions(false, tags)
  }

  const deleteRow = async function (row) {

    if (!confirm('Are you sure you want to remove?')) return;

    await _delete('activities', row.id)
    state.data.splice(state.data.indexOf(row), 1)
  }

  const edit = function(row) {
    state.editMode = true
    state.form = { ...row}

    console.log('form', state.form)
    state.isOpen = true
  }

  const displayTime = function(tin) {
    tin = (Date.now() - state.timerStart) / 1000
    state.timeDisplay =  Math.floor(tin / 3600).toString().padStart(2, "0") + ":" +
    (Math.floor(tin / 60)  % 60).toString().padStart(2, "0") 
    + ':' + Math.floor(tin % 60).toString().padStart(2, "0");
  }

  const startTimer = async function (row) {
    let newEvent = {}
    state.timerStart =   Date.now()

    newEvent.userId = user.id
    newEvent.details= JSON.stringify({startTime:  state.timerStart})
    newEvent.activity = row.id 
    let resp = await create('events', newEvent)

    Object.assign(resp.data, resp.data.attributes)
    row.event = resp.data
    row.event.details = JSON.parse(row.event.details)
    displayTime()
    setInterval(displayTime, 1000)
    console.log(resp)
  }

  const cancel = function() {
    state.isOpen = false
  }

  const completeEvent = async function (row) {
      row.event.details.stopTime = Date.now()
      row.event.complete = true
      console.log('ev', row.event)
      update('events', row.event.id, {complete: true, note: row.event.note, details: JSON.stringify(row.event.details) })
      row.event = state.timerStart= null
  }

  const store = async function () {


    let resp

    if (state.form.id) {
      let updates = {name: state.form.name,description: state.form.description,
        details: JSON.stringify(state.form.details)}

      resp = await update('activities', state.form.id, updates)
    } else {
      resp = await create('activities', state.form)
    }

    state.isOpen = false
    console.log(resp)

  if (state.form.id) {
    let updated = state.data.find(e => e.id === state.form.id)
    Object.assign(updated, resp.data.attributes)
    updated.details = JSON.parse(updated.details)
  } else {

      state.data.push(resp.data)
      Object.assign(resp.data, resp.data.attributes)

    }
    //sort
  }

  let displayEvent = function(event) {
    //let details = JSON.parse(event.details)
    let eDate = new Date(event.details.startTime)
    return eDate.toLocaleTimeString() + ' ' + Math.floor((event.details.stopTime - event.details.startTime)/60000)
  }

 let resp = await find('tags')
       
 resp.data.forEach(e=>Object.assign(e, e.attributes));  
  tags = tagUtils.withHierarchy(resp.data); console.log(tags) 


resp = await find('activities', {populate: '*'})
console.log('data', resp.data)
resp.data.forEach(e=>{
  Object.assign(e, e.attributes)
  e.details = e.details ? JSON.parse(e.details) : {}

  e.tags.data.forEach(f=>{
    Object.assign(f, f.attributes)
    f.choiceContext = tags.find(g=>g.id==f.id).choiceContext
  })
  e.tags = e.tags.data
  e.events.data.forEach(f=>{
    Object.assign(f, f.attributes)
    f.details = f.details ? JSON.parse(f.details) : {}
    if (!f.complete) {
      e.event = f
      state.timerStart = f.details.startTime
      displayTime()
      setInterval(displayTime, 1000)
  }    
  })
  e.events = e.events.data

}) 
state.data = resp.data





  </script>
  
  <template>
    <PageWrapper>
      <PageHeader>
        <button @click="newRow" class="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3">+</button>

        <PageTitle text="Activities" class="capitalize" />
      </PageHeader>
      <PageBody>

        <PageSection>

                <ContentList >
        <PageSection v-for="row in state.data" :key="row.id">
          <div
            class="relative block hover:no-underline p-6 flex space-x-6 rounded border border-gray-900/10 dark:border-gray-50/[0.2]"
          >
            <div class="mt-1 text-slate-600 dark:text-gray-400 text-right">
              <div>{{ row.date }}</div>

            </div>
            <div class="flex flex-col">
              <div
                class="text-xl font-semibold text-slate-800 dark:text-gray-50"
              >
                {{ row.name }}
              </div>
              <div class="text-slate-700 dark:text-gray-300 mb-1">
                {{ row.description }}
              </div>
              <div v-if="row.event">
                {{ state.timeDisplay }}
                <span class="text-base cursor-pointer" @click="completeEvent(row)" ><icon class ="color:yelloe"  name="carbon:task-complete" /></span>
                <span class="text-base cursor-pointer" v-if="!row.noteOpen" @click="row.noteOpen=true" ><icon class ="color:green"  name="akar-icons:comment" /></span>
              <div v-if="row.noteOpen"><input v-model="row.event.note" type = 'text' /></div>
              </div>
              <div v-if="row.reportOpen" >
                <div v-for="eRow in row.events" class="p-2 rounded border border-gray-700/10 dark:border-gray-50/[0.2]">
                  <div> 
                    {{ eRow.note }}
                  </div>
                  {{ displayEvent(eRow) }}
                </div>
              </div>
              <div class="flex absolute bottom-0 right-0">
                <span class="mx-2 text-base cursor-pointer" v-if="!row.reportOpen" @click="row.reportOpen=!row.reportOpen" ><Icon class ="color:green"  name="tabler:report" /></span>

                <span class="mx-2 text-base cursor-pointer" v-if="!state.timerStart" @click="startTimer(row)" ><Icon class ="color:green"  name="bi:stopwatch" /></span>
                <span @click="edit(row)" class="mx-2 text-base cursor-pointer"><Icon class ="text-green" name="charm:pencil" /></span>
											<span class="text-base cursor-pointer" @click="deleteRow(row)" ><Icon class ="color:red"  name="bi:trash" /></span>
              </div>
            </div>
          </div>
        </PageSection>
      </ContentList>



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
                                  <vSelect multiple label="choiceContext" v-model="state.form.tags" :options="getOptions()" />
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

        </PageSection>
      </PageBody>
    </PageWrapper>
  </template>
  