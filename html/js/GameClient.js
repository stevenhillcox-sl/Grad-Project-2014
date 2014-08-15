function GameClient(webSocketClient, viewModel)
{
    var self = this;
    
    var joinMessage = webSocketClient.createMessage('join', viewModel.userName());
    webSocketClient.sendMessage(joinMessage);
}