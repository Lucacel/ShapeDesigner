import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import socketio from "socket.io-client";
import VueSocketIOExt from "vue-socket.io-extended";

export const SocketInstance = socketio("http://localhost:3000");

const app = createApp(App);

app.use(VueSocketIOExt, SocketInstance);

app.mount("#app");
