sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("app.csrf.controller.View1", {
        onInit: function () {
            // Initialize the OData Model with CSRF token enabled
            this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZDANPOSTPROJ_SRV/", {
                json: true,
                useBatch: false, // Disable batch mode to send individual requests
                defaultBindingMode: "TwoWay"
            });
        },

        onCreate: function () {
            var oModel = this.getView().getModel(); // Get the OData model
            var sEntitySet = "/customerEntitySet"; // Entity set name
            let inptCustId=this.getView().byId("idCustId").getValue()
            let integerId=parseInt(inptCustId)
            let sdate=this.getView().byId("idDate").getValue()
            let custName=this.getView().byId("idName").getValue()
         
            var date = new Date(sdate);
            var oNewCustomer = {
                "Customerid": integerId,
                "Dateofjoin": "/Date(" + date.getTime() + ")/", // Convert JS date to OData format
                "Custname": custName
            };
            // Fetch CSRF token
            oModel.refreshSecurityToken(
                function (oData, oResponse) {
                    var sToken = oModel.getHeaders()['x-csrf-token']; // Get CSRF Token from response headers
                    console.log("CSRF Token:", sToken);

                    // Set CSRF token for future requests
                    oModel.setHeaders({
                        "X-CSRF-Token": sToken
                    });

                    // Create the entity
                    oModel.create(sEntitySet, oNewCustomer, {
                        success: function (oData, response) {
                            sap.m.MessageBox.success("Customer created successfully!");
                            console.log("Success Response:", oData);
                        },
                        error: function (oError) {
                            sap.m.MessageBox.error("Error in creating customer.");
                            console.error("Error Response:", oError);
                        }
                    });

                }, function (oError) {
                    sap.m.MessageBox.error("Failed to fetch CSRF token. Please try again.");
                    console.error("CSRF Token Error:", oError);
                }
            );
        }
    });
});
