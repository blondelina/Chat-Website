namespace backend.Hubs
{
    public interface IChatHub
    {
        Task ReceiveMessage(UserMessage userMessage);
        Task LeftRoomMessage(string message);
        Task JoinedRoomMessage(string message);
    }
}
