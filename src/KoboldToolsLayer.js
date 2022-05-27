export class KoboldToolsLayer extends PlaceablesLayer {

    constructor(...args) {
      super(...args);
  
      this.documentName = "Scene";
      this.active = false;
      this.isSetup = false;
    }
  
    static get layerOptions() {
      return foundry.utils.mergeObject(super.layerOptions, {
        zIndex: 180,
        name: "koboldt"
      });
    }
  
    getDocuments() {
      return [];
    }
  
    activate() {
      super.activate();
      this.active = true;
    }
  
    deactivate() {
      super.deactivate();
      this._clearChildren();
      this.active = false;
    }
  
    render(...args) {
      super.render(...args);
    }
  
    _clearChildren() {
      if (!this.UIContainer) {
          return;
      }
      this.UIContainer.children.forEach((child) => {
        child.clear();
      });
    }
  
    _onClickLeft(event) {
      const t = this.worldTransform;
      const tx = (event.data.originalEvent.clientX - t.tx) / canvas.stage.scale.x;
      const ty = (event.data.originalEvent.clientY - t.ty) / canvas.stage.scale.y;
      let coords = [tx, ty];
      coords = canvas.grid.getCenter(tx, ty);
     
    }
  
    _onClickRight(event) {
      const t = this.worldTransform;
      const tx = (event.data.originalEvent.clientX - t.tx) / canvas.stage.scale.x;
      const ty = (event.data.originalEvent.clientY - t.ty) / canvas.stage.scale.y;
      let coords = [tx, ty];
      coords = canvas.grid.getCenter(tx, ty);
      
    }
  
    selectObjects() {
      // no real implementation
    }
  
  }