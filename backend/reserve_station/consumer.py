from channels.generic.websocket import AsyncWebsocketConsumer


class chatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        url = self.scope["url_route"]["kwargs"]["room_name"]

        print(url)

        await self.accept()

    def receive(self, text_data):
        pass

        