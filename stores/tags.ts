import { defineStore } from 'pinia'


export const useTags = defineStore('tags', {

  actions: {
      isOpenTimer: function (lastEntry) {
          return ['start', 'pause', 'resume'].includes(lastEntry.state)
      },
      sortedData: function (data) {
          let sdata = this.sortData(data); 
          sdata.forEach(e=>{e.children=null; e.parent={choiceContext:e.parent ? e.parent.choiceContext :''}})
          return sdata
      },
      withHierarchy: function(data) { 
        
          let children = [], roots = []
  
          data.forEach(e => { //most tags have no children
              e = JSON.parse(JSON.stringify(e))  //break reaction
              if (e.parentId)
                  children.push(e)
              else {
                  
                  e.level=0
                  e.children = []
                  roots.push(e)
              }
          }); 
  
          let lookingForChildren = [...roots]
          lookingForChildren.forEach(e => e.choiceContext = e.name)
  
          while (lookingForChildren.length && children.length)
          {
              let wouldBeParent = lookingForChildren.shift()
              for (let i = children.length-1; i>=0; i--)
                  if (wouldBeParent.id == children[i].parentId) {
                      wouldBeParent.children.push(children[i])
                      lookingForChildren.push(children[i])
                      children[i].level = wouldBeParent.level + 1
                      children[i].context = wouldBeParent.context ?  wouldBeParent.context + ':' + wouldBeParent.name : wouldBeParent.name
                      children[i].choiceContext = children[i].context ?  children[i].context + ':' +children[i].name : children[i].name
                      children[i].parent=wouldBeParent
                      children[i].children = []
                      children.splice(i,1)
                  }
  
          } 
         
          return this.flattenTags(roots, [])
      },
      flattenTags: function(roots, list) {
          let ordered = roots.sort((a,b) => a.name > b.name ? 1 : -1)
          for (let e of roots) {  
              list.push(e)
              if(e.children.length)
                  this.flattenTags(e.children, list)
          }
  
          return list
      },  
      getTagOptions: function (form, visibleTags) { 
  
          let to = this.getOptions(null, visibleTags)   
          if (form) {
              let tagIds = form.tags.reduce((c,e)=>{c.push(e.id); return c}, [])
              to = to.filter(e=>!tagIds.includes(e.id))
          }
         
          return to
      },
      getOptions: function (form, data) {  //options for tag parent
  
          let allVisible = data.slice();
          //self and children cannot be parent
          let notValid = form && form.id ? this.fetchAllChildIds(allVisible.find(e=>e.id==form.id), []) : [] 
  
          let withoutSelfChildren = []
          if (form && form.parentId) 
              withoutSelfChildren.push({choiceContext: 'move to top', id: null})
          if (form && form.parentId)   
              notValid.push(form.parentId)
          
  
          for (let i = allVisible.length -1 ; i>= 0; i--)
              if(!notValid.includes(allVisible[i].id )) {
                  allVisible[i].parent = allVisible[i].children = null
                  withoutSelfChildren.push(allVisible[i])
              }
          
          return withoutSelfChildren
      },
      displayTime(tin) {
  
          return  Math.floor(tin / 3600).toString().padStart(2, "0") + ":" +
          (Math.floor(tin / 60)  % 60).toString().padStart(2, "0") 
          + ':' + (tin % 60).toString().padStart(2, "0");
      },
      fetchAllChildIds: function(root, childIds) {
          childIds.push(root.id)
          root.children.forEach(e => this.fetchAllChildIds(e, childIds))
  
          return childIds
      }              

  
  
  },
})
