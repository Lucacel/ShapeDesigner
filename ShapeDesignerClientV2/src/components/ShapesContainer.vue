<script lang="ts">
import type { ApiShape, ShapeObject } from "@/models/ShapeModels";
import { defineComponent } from "vue";
import { useStore } from "../store/piniaStore";
export default defineComponent({
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  mounted() {
    this.store.initiateShapes();
  },

  data() {
    return {
      // shapes: [] as ShapeObject[],
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
    message(data: ApiShape) {
      this.store.addShapeFromApi(data);
    },
  },

  methods: {
    onDeleteItemCallback(shape: ShapeObject) {
      const index = this.store.shapes.findIndex(
        (elem) => elem.label === shape.label
      );
      if (index !== -1) {
        //remove element at position x
        this.store.shapes.splice(index, 1);
      }
    },

    cleanOpenMenu() {
      for (let i = 0; i < this.store.shapes.length; i++) {
        this.store.shapes[i].isMenuShowing = false;
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
      v-for="shape in store.shapes"
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
