import type { ApiShape, ShapeObject } from "@/models/ShapeModels";
import { convertIntoShapeObject, getShapesFromApi } from "../api/api";
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    shapes: [] as ShapeObject[],
  }),
  getters: {
    getShapes: (state) => state.shapes,
  },
  actions: {
    initiateShapes() {
      getShapesFromApi().then((res) => {
        this.shapes = res;
      });
    },
    addShape(shape: ShapeObject) {
      this.shapes.push(shape);
      if (this.shapes.length > 10) {
        this.shapes.splice(0, 1);
      }
    },
    addShapeFromApi(shape: ApiShape) {
      const shapeObj = convertIntoShapeObject(shape);
      if (shapeObj) this.addShape(shapeObj);
    },
  },
});
