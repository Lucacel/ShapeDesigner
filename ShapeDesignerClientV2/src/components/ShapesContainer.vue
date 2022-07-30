<script lang="ts">
import {
  Circle,
  Diamond,
  Triangle,
  type ShapeObject,
} from "@/models/ShapeModels";
import { defineComponent } from "vue";
export default defineComponent({
  mounted() {
    fetch("http://localhost:3000/shapes").then((res) => {
      res.json().then((resData) => {
        for (let i = resData.length - 1; i >= 0; i--) {
          const shapeData = resData[i];
          this.addFromApiData(shapeData);
        }
        console.log("SHAPES ADDED: ", this.shapes);
      });
    });
  },

  data() {
    return {
      shapes: [] as ShapeObject[],
      isConnected: false,
    };
  },
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "message" channel.
    message(data: {
      x: number;
      y: number;
      shapeType: "circle" | "diamond" | "triangle";
      label: string;
    }) {
      this.addFromApiData(data);
    },
  },

  methods: {
    addFromApiData(data: {
      x: number | string;
      y: number | string;
      label: string;
      shapeType: string;
    }) {
      console.log("ADD SHAPE FROM API");
      switch (data.shapeType) {
        case "circle":
          this.addShape(new Circle(Number(data.x), Number(data.y), data.label));
          break;
        case "diamond":
          this.addShape(
            new Diamond(Number(data.x), Number(data.y), data.label)
          );
          break;
        case "triangle":
          this.addShape(
            new Triangle(Number(data.x), Number(data.y), data.label)
          );
          break;
        default:
          break;
      }
    },

    addShape(shape: ShapeObject) {
      this.shapes.push(shape);
      if (this.shapes.length > 10) {
        this.shapes.splice(0, 1);
      }
    },
    onDeleteItemCallback(shape: ShapeObject) {
      const index = this.shapes.findIndex((elem) => elem.label === shape.label);
      if (index !== -1) {
        //remove element at position x
        this.shapes.splice(index, 1);
      }
    },

    cleanOpenMenu() {
      for (let i = 0; i < this.shapes.length; i++) {
        this.shapes[i].isMenuShowing = false;
      }
    },

    onScreenClick(event: MouseEvent) {
      //clean menus
      this.cleanOpenMenu();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      this.$socket.client.emit("message", { x: event.x, y: event.y });
    },
    onRightClick(shape: ShapeObject) {
      shape.isMenuShowing = true;
    },
  },
});
</script>

<template>
  <div v-on:click="onScreenClick" class="container">
    <div
      v-for="shape in shapes"
      class="elementContainer"
      v-bind:key="JSON.stringify(shape)"
      :style="{
        top: shape.y + 'px',
        left: shape.x + 'px',
        position: 'absolute',
      }"
      v-on:contextmenu.prevent="(event) => onRightClick(shape)"
    >
      <div v-html="shape.renderShape()"></div>
      <div v-show="shape.isMenuShowing" class="contextMenu">
        <div
          v-for="item in shape.contextMenu"
          :key="item.label"
          class="contextMenuItem"
          @click.stop.prevent="
            shape.onMenuItemPressed(item.action, onDeleteItemCallback)
          "
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex: 1;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
}

.contextMenu {
  padding: 0px;
  border: 2px cornflowerblue solid;
  border-radius: 5px;
}

.contextMenuItem {
  padding: 4px;
  cursor: pointer;
}

.contextMenuItem:hover {
  background-color: rgb(155, 172, 203);
}
</style>
