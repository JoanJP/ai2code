sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("project.fiori.controller.TreeNavigation", {
    onInit() {
      this._loadEntityData("ContextNodes");
      // this._loadEntityData("Tasks");
    },
    _loadEntityData(entityName) {
      // const oUri = `http://localhost:8080/api/MainService/${entityName}?$format=JSON`;
      // const oModel = new sap.ui.model.json.JSONModel();
      // oModel.loadData(oUri);
      // // Convert entityName to camelCase for the model name
      // const modelName =
      //   entityName.charAt(0).toLowerCase() + entityName.slice(1);
      // this.getView().setModel(oModel, modelName);
      // const oTest = this.getView().getModel(modelName).getData();
      // console.log(oTest);
      const oBindList = `/${entityName}`;
      const oModel = this.getOwnerComponent().getModel();
      oModel
        .bindList(oBindList)
        .requestContexts()
        .then(
          function (aContexts) {
            var aData = aContexts.map(function (oContext) {
              return oContext.getObject(); // Returns JS object
            });

            //   Now aData is a plain JavaScript array -> can be used to create a JSONModel
            const oJSONModel = new sap.ui.model.json.JSONModel();
            oJSONModel.setData({ results: aData });

            // Use the JSON model as needed
            this.getOwnerComponent().setModel(oJSONModel, "myJSON");
            const data = this.getOwnerComponent()
              .getModel("myJSON")
              .getData().results;
            console.log(data);
          }.bind(this)
        );
    },
  });
});
