// import * as signalR from "@microsoft/signalr";

// function getCookie(name: string) {
//   return document.cookie
//     .split("; ")
//     .find((row) => row.startsWith(name + "="))
//     ?.split("=")[1];
// }

// const connection = new signalR.HubConnectionBuilder()
//   .withUrl("https://localhost:7027/hubs/chat", {
//     withCredentials: true,
//     accessTokenFactory: () => getCookie("accessToken") ?? "",
//   })
//   .withAutomaticReconnect()
//   .build();

// export async function startConnection() {
//   try {
//     await connection.start();
//     console.log("SignalR Connected");
//   } catch (err) {
//     console.error("SignalR Connection Error:", err);
//     setTimeout(startConnection, 2000);
//   }
// }

// export function onReceiveMessage(callback: (senderId: string, msg: string) => void) {
//   connection.on("ReceiveMessage", callback);
// }

// export async function sendMessage(receiverUserId: string, message: string) {
//   try {
//     await connection.invoke("SendMessageToUser", receiverUserId, message);
//   } catch (err) {
//     console.error("SendMessage Error:", err);
//   }
// }

// export default connection;

import * as signalR from "@microsoft/signalr";

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7027/hubs/chat", {
    withCredentials: true,
    accessTokenFactory: () => getCookie("accessToken") ?? "",
  })
  .withAutomaticReconnect()
  .build();

let isStarting = false; // <-- important

export async function startConnection() {
  if (
    connection.state === signalR.HubConnectionState.Connected ||
    connection.state === signalR.HubConnectionState.Connecting ||
    isStarting
  ) {
    console.log("SignalR already starting or connected.");
    return;
  }

  try {
    isStarting = true;
    await connection.start();
    console.log("SignalR Connected");
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    setTimeout(startConnection, 2000);
  } finally {
    isStarting = false;
  }
}

export function onReceiveMessage(callback: (senderId: string, msg: string) => void) {
  connection.on("ReceiveMessage", callback);
}

export async function sendMessage(receiverUserId: string, message: string) {
  try {
    await connection.invoke("SendMessageToUser", receiverUserId, message);
  } catch (err) {
    console.error("SendMessage Error:", err);
  }
}

export default connection;

