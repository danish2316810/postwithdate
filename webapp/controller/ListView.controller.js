sap.ui.define([
    "sap/ui/core/mvc/Controller"],
     function(Controller){
        "use strict";
     return Controller.extend("app.csrf.controller.ListView",{

     onInit:function(){

     },
     onPressCreate:function(){
         this.getOwnerComponent().getRouter().navTo("RouteView1")
         
     },
    
     onPressEdit:function(){
        
         this.getOwnerComponent().getRouter().navTo("RouteUpdate")
         
     },
     onSelect:function(oEvent){
        var oListItem=oEvent.getParameter("listItem");
        let sItem=oListItem.getProperty("intro")
        this.getOwnerComponent().getRouter().navTo("RouteUpdate",{
            cId:sItem
        })
     }
     



     })
})