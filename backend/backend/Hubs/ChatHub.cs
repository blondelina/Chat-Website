using backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend
{
    public class ChatHub: Hub<IChatHub>
    {
        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            await Clients.GroupExcept(userConnection.Room,Context.ConnectionId).JoinedRoomMessage("User " + userConnection.Username + " connected successfully!");

        }

        public async Task LeaveRoom(UserConnection userConnection)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId,userConnection.Room);
            await Clients.Group(userConnection.Room).LeftRoomMessage("User " + userConnection.Username + " left!");
        }

        public async Task SendMessage(UserMessage userMessage)
            => await Clients.GroupExcept(userMessage.Room, Context.ConnectionId).ReceiveMessage(userMessage);
        
    }
}
