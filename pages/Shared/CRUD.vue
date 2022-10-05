<template>
  <!--   <app-layout :parent="parent"> -->

		<div v-if="!isOpen && !canceled"></div>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
						
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg px-4 py-4">
                    <button @click="openModal" class="float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3">+</button>
					<slot name="title"></slot>
					<table class="table-fixed w-full">
						<thead>
                            <tr class="bg-gray-100">
                                <th style="width:25%"   class="px-4 py-2">{{ textLabel }}</th>
								<slot name="ha"><th class="px-4 py-2">Description</th></slot>                                
								<slot name="hb"></slot>
								<th style="width:7%" class="menu px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in sorted">
                                <td :style="{ 'padding-left': row.level * 12 + 4 + 'px' }" class="border py-2">{{ rowText(row) }}  <slot name="openFolder" :row="row"></slot></td>
                                <slot name="ba" :row="row"><td class="border px-4 py-2">{{ row.description }}</td></slot>
								<slot name="bb" :row="row"></slot>
                                <td class="text-center border px-4 py-2">
									<span class="ham-menu">
										<span class="ham-btn" >
											<span class="bar top"></span>
											<span class="bar middle"></span>
											<span class="bar bottom"></span>
										</span>
										<span  class="ham-drop">
											<span v-if="parent.canOpen !==false" @click="openRow(row)" class="text-base bg-green-300">Open</span>											
											<span @click="edit(row)" class="text-base bg-green-300">Edit</span>
											<span class="text-base bg-yellow-200" @click="deleteRow(row)" >Delete</span>
										</span>
									</span>								
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="fixed z-10 inset-0 overflow-y-auto ease-out duration-400" v-if="isOpen">
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
                                      <label for="exampleFormControlInput1" class="block text-gray-700 text-sm font-bold mb-2">{{ textLabel }}:</label>
                                      <input type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exampleFormControlInput1" placeholder="Enter Text - required" v-model="textModel" >

                                  </div>
                                  <div class="mb-4">
                                      <label for="exampleFormControlInput2" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="exampleFormControlInput2" v-model="form.description" placeholder="Enter Description - optional"></textarea>
                                  </div>
                                  <slot name="pa" :form="form"></slot>
                            </div>
                          </div>
                          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                              <button wire:click.prevent="store()" type="button" class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5" @click="store(form)">
                                <span v-show="!editMode" >Save</span>
                                <span v-show="editMode" >Update</span>								
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

</template>
<script>
//import { useTags } from '~/stores/tags';

const tags = {}; //useTags()
//const { find } = useStrapi4()
	
    export default {
		name: 'crud',
        components: {

        },
        props: {
			data: Array,
			bModel: String,
			parent: Object,
			parentId: Number,
            displayOptions: Object,
            sort: Function,
            preEdit: Function,
            preStore: Function,
		},

		data() {
            return {
                editMode: false,
				canceled: false,
                isOpen: false,
                form: {
                    title: null,
                    description: null,
					active: true,
                },
            }
        },
		computed: {
            textLabel: function () {
                if(this.displayOptions.textLabel)
                    return this.displayOptions.textLabel
                return 'Text'
            },

            textModel: {
                get () {
                    if(this.displayOptions.textModel)
                        return this.form[this.displayOptions.textModel]
                    else
                        return this.form.text
                },
                set (val) {
                    if(this.displayOptions.textModel)
                         this.form[this.displayOptions.textModel] = val
                    else
                        this.form.text = val
                }
            },
			sorted: function () {
                if (this.sort)
                    return this.sort(this.data)

				return this.data.sort((firstEl, secondEl) => {
                    return (( this.displayOptions.textModel ? 
                        firstEl[this.displayOptions.textModel] : firstEl.title)
                    > ( this.displayOptions.textModel ? 
                        secondEl[this.displayOptions.textModel] : secondEl.title)) ? 1 : -1
                });
			}
		},
		mounted() {
			this.initMenu();
		},
		updated() {
			this.initMenu();
		},        
		methods: {
            rowText: function(row) {
                if(this.displayOptions.textModel)
                    return row[this.displayOptions.textModel]
                else
                    return row.text
            },            
			initMenu: function (){

			
			},
            openModal: function () {
    			this.canceled = false;
                this.isOpen = true;
            },
            closeModal: function () {
				this.isOpen = false;
				this.clearMessages();
				this.reset();
				this.editMode=false;
            },
            reset: function () {
                this.form = {
                    title: null,
                    body: null,
                }
            },
            store: function (data) {  
				data.pid = this.parentId; 
                if(this.preStore)
                    this.preStore(data);
                    console.log('store', data)
				data.active = true;
                this.$inertia.put('/' + this.bModel + '/store', data, {
					onSuccess: () => { this.closeModal();},
					});
            },
            edit: function (data) { 
                this.form = Object.assign({}, data);
                if(this.preEdit)
                    this.preEdit(this.form);
                this.editMode = true;
                this.openModal();
            },
			openRow: function (row) { 
				this.parent.openRow(row);
				this.closeModal();				
			},
			cancel: function () {
				this.canceled = true;
				//clear messages, make an index request??
				this.closeModal();
			},
            deleteRow: function (data) { 
                if (!confirm('Are you sure you want to remove?')) return;
                this.$inertia.post('/' + this.bModel + '/destroy', data)
            },
			clearMessages: function () {
			//	this.$inertia.put('/tags/store', {action: 'nop'});  //nop
			}			
        }
    }
</script>

<style>
.ham-menu {
    display: block;
	position: relative;
    width: 20px;
    height: 20px;
    font-size: 10px;
    cursor: pointer;
}

.bar {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 20px;
    height: 2px;
    background: #999;
    -webkit-transition: all .5s;
    transition: all .5s;
    -webkit-transform-origin: left top;
    -ms-transform-origin: left top;
    transform-origin: left top;
}

.bar.middle {
    top: 10px;
    opacity: 1;
}

.ham-drop .text-base {
	margin: 15px;
	padding: 5px;
	border-radius:10px;
}

.bar.bottom {
    top: 20px;
    -webkit-transform-origin: left bottom;
    -ms-transform-origin: left bottom;
    transform-origin: left bottom;
}

.ham-menu.open .bar.top {
    width: 28px;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

.ham-menu.open .bar.middle {
    opacity: 0;
}

.ham-menu.open .bar.bottom {
    width: 28px;
    top: 20px;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.ham-drop {
	position: absolute;
	z-index: auto;
	background-color: #fff;
	display: none;
	padding: 10px;
	top: -33px;
	right: 30px;
	border: 1px solid black;
	border-radius: 5px;	
}

.ham-menu.open .ham-drop {
	display: inline-block;
}

</style>