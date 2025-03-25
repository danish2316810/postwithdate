sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
   "use strict";

   return Controller.extend("app.csrf.controller.UpdateView", {

       onInit: function () {
           let oRouter = this.getOwnerComponent().getRouter();
           oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
       },

       onRouteMatched: function (oEvent) {
           let key = oEvent.getParameter("arguments").cId; // Correct way to get route parameter
           let oModel = this.getOwnerComponent().getModel();
           this.entity = "/customerEntitySet(" + key + ")"; // Store the entity path

           let that = this;
           oModel.read(this.entity, {
               success: function (odata) {
                   let date = new Date(odata.Dateofjoin); // Convert OData date to JS date

                   let day = String(date.getDate()).padStart(2, '0');
                   let month = String(date.getMonth() + 1).padStart(2, '0');
                   let year = date.getFullYear();
                   let formattedDate = `${year}-${month}-${day}`;

                   let data = {
                       custID: odata.Customerid,
                       custName: odata.Custname,
                       date: formattedDate
                   };

                   let oModelUpdate = new sap.ui.model.json.JSONModel();
                   oModelUpdate.setData(data);
                   that.getView().setModel(oModelUpdate, "UpdateModel");
               },
               error: function (error) {
                   console.log("Error fetching data:", error);
               }
           });
       },

       onUpdate: function () {
           let that = this;
           var oModel = this.getOwnerComponent().getModel();

           let inptCustId = this.getView().byId("idCustIdUp").getValue();
           let integerId = parseInt(inptCustId);
           let sdate = this.getView().byId("idDateUp").getValue();
           let custName = this.getView().byId("idNameUp").getValue();

           var date = new Date(sdate);
           var oUpdatedCustomer = {
               "Customerid": integerId,
               "Dateofjoin": "/Date(" + date.getTime() + ")/", // Convert JS date to OData format
               "Custname": custName
           };

           // Fetch CSRF token before making an update request
           oModel.refreshSecurityToken(
               function (oData, oResponse) {
                   var sToken = oResponse.headers["x-csrf-token"]; // Get CSRF Token from headers
                   console.log("CSRF Token:", sToken);

                   // Set CSRF token in request headers
                   oModel.setHeaders({
                       "X-CSRF-Token": sToken
                   });

                   // Update request to backend
                   oModel.update(that.entity, oUpdatedCustomer, {
                       success: function (oData, response) {
                           sap.m.MessageBox.success("Customer updated successfully!");
                           console.log("Update Success:", oData);
                       },
                       error: function (oError) {
                           sap.m.MessageBox.error("Error updating customer.");
                           console.error("Update Error:", oError);
                       }
                   });

               },
               function (oError) {
                   sap.m.MessageBox.error("Failed to fetch CSRF token.");
                   console.error("CSRF Token Error:", oError);
               }
           );
       }
   });
});
