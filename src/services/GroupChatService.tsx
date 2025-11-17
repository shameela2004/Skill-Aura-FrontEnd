import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";


function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}
const groupChatConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7027/hubs/groupchat", {
    withCredentials: true,
    accessTokenFactory: () => getCookie("accessToken") ?? "",
  })
  .withAutomaticReconnect()
  .build();


export default groupChatConnection;
groupChatConnection.on("ReceiveNotification", (notificationMessage: string) => {
  // Handle notification message here, e.g. show toast, popup, alert
  toast.info(notificationMessage);
  // You can integrate a toast library here to show UI notification
});
