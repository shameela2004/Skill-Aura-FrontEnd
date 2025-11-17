import { toast } from "react-toastify";
import groupChatConnection from "./GroupChatService";

groupChatConnection.on("ReceiveNotification", (notificationMessage: string) => {
  console.log(notificationMessage)
  toast.info(notificationMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
});
