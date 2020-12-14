import {WbBaseNode} from "./WbBaseNode.js";
import {WbShape} from "./WbShape.js";
import {WbWrenShaders} from "./WbWrenShaders.js"
import {WbAbstractAppearance} from "./WbAbstractAppearance.js"


class Use extends WbBaseNode {
  constructor(id, def, parent){
    super(id);
    this.def = def;

    this.parent = parent;
    this.wrenObjectsCreatedCalled = false

    this.wrenRenderable;
    this.wrenTextureTransform;
    this.wrenMaterial;
    this.wrenMesh;
  }

  //TODO Cleanup, test the type of the def node to know what is necessary to replace
  createWrenObjects() {
    super.createWrenObjects();
    let temp = this.def.parent;
    this.def.parent = this.parent;

    let temp2 = this.def.wrenRenderable;
    this.def.wrenRenderable = undefined;

    let temp3 = this.def.wrenMaterial;
    this.def.wrenMaterial = undefined;

    let temp4 = this.def.wrenMesh;
    this.def.wrenMesh = undefined;

    this.def.createWrenObjects();

    this.def.parent = temp;

    this.wrenRenderable = this.def.wrenRenderable;
    this.def.wrenRenderable = temp2;

    this.wrenMaterial = this.def.wrenMaterial;
    this.def.wrenMaterial = temp3;

    this.wrenMesh = this.def.wrenMesh;
    this.def.wrenMesh = temp4;

    this.wrenObjectsCreatedCalled = true;
  }


  modifyWrenMaterial1(wrenMaterial) {
    wrenMaterial = this.def.modifyWrenMaterial(wrenMaterial);
    return wrenMaterial;
  }

  modifyWrenMaterial2(wrenMaterial, textured) {
    return this.def.modifyWrenMaterial(wrenMaterial, textured);
  }

  modifyWrenMaterial(wrenMaterial, mainTextureIndex, backgroundTextureIndex) {
    let temp
    if(typeof this.def.textureTransform !== 'undefined') {
      temp = this.def.textureTransform.wrenTextureTransform;
      this.def.textureTransform.wrenTextureTransform = undefined;
    } else {
      temp = this.def.wrenTextureTransform;
      this.def.wrenTextureTransform = undefined;
    }

    if (typeof backgroundTextureIndex === 'undefined') {
      if (typeof mainTextureIndex === 'undefined')
        wrenMaterial = this.modifyWrenMaterial1(wrenMaterial);
      else
        wrenMaterial = this.modifyWrenMaterial2(wrenMaterial, mainTextureIndex);
    }else
      wrenMaterial = this.def.modifyWrenMaterial(wrenMaterial, mainTextureIndex, backgroundTextureIndex);

    if(typeof this.def.textureTransform !== 'undefined') {
      this.wrenTextureTransform = this.def.textureTransform.wrenTextureTransform;
      this.def.textureTransform.wrenTextureTransform = temp;
    } else {
      this.wrenTextureTransform = this.def.wrenTextureTransform;
      this.def.wrenTextureTransform = temp;
    }


    return wrenMaterial;
  }

  setWrenMaterial(wrenMaterial, castShadow) {
    let temp2 = this.def.wrenRenderable;
    this.def.wrenRenderable = this.wrenRenderable;

    this.def.setWrenMaterial(wrenMaterial, castShadow);

    this.wrenRenderable = this.def.wrenRenderable;
    this.def.wrenRenderable = temp2;
  }

  preFinalize(){
    this.isPreFinalizeCalled = true;
  }

  postFinalize(){
    this.isPreFinalizeCalled = false;
  }

  computeCastShadows(castShadows){
    this.def.computeCastShadows(castShadows);
  }
}

export{Use}
