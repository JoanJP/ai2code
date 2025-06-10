sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend("project.fiori.controller.TreeNavigation", {
    onInit() {
      this._loadEntityData("ContextNodes");
      // this._loadEntityData("Tasks");
    },
    _loadEntityData(entityName) {
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
            this._buildContextTree(data);
            console.log(data);
          }.bind(this)
        );
    },
    _buildContextTree: function (flatData) {
      // Result tree
      const treeData = {};

      flatData.forEach((item) => {
        const pathSegments = item.path.split("/").filter(Boolean); // e.g. ["documents", "section1"]
        let current = treeData;

        // Build hierarchy
        pathSegments.forEach((segment) => {
          if (!current[segment]) {
            current[segment] = {};
          }
          current = current[segment];
        });

        // Assign label-value pair
        current[item.label] = item.value;
      });

      console.log(treeData);

      const aTree = this._prepareTreeArray(treeData);
      const oTreeModel = new sap.ui.model.json.JSONModel({ nodes: aTree });
      this.getOwnerComponent().setModel(oTreeModel, "tree");
    },

    _prepareTreeArray: function (oObj) {
      return Object.keys(oObj).map((key) => {
        const node = { key: key, children: [] };
        const val = oObj[key];
        if (val !== null && typeof val === "object") {
          // object → recurse
          node.children = this._prepareTreeArray(val);
        } else {
          // primitive → treat as leaf with a value
          node.value = val;
        }
        return node;
      });
    },
  });
});
