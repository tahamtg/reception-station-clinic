import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Personal
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"services_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        print("Connected:", self.room_name)

    async def disconnect(self, code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        print("Disconnected:", self.room_name)

    async def receive(self, text_data):

        data = json.loads(text_data)

        model = await sync_to_async(list)(Personal.objects.all())

        if data["type"] == "send_data":

            for person in model:

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "service_message",
                        "name": person.name,
                        "age": person.age,
                        "phone": person.phone,
                        "file": person.file,
                        "address": person.address,
                        "reserve_date": person.reserve_date,
                        "date": person.date,
                        "services": person.services,
                        "id": person.id,
                        "price": person.price,
                    }
                )

    async def service_message(self, event):

        await self.send(
            text_data=json.dumps({
                "type": "get_Data",
                "name": event["name"],
                "age": event["age"],
                "phone": event["phone"],
                "file": event["file"],
                "address": event["address"],
                "reserve_date": str(event["reserve_date"]),
                "date": str(event["date"]),
                "id": event["id"],
                "services": event["services"],
                "price": event["price"],
            })
        )

    async def new_person(self, event):

        person = await sync_to_async(
            Personal.objects.get
        )(id=event["id"])

        await self.send(
            text_data=json.dumps({
                "type": "get_Data",
                "name": person.name,
                "age": person.age,
                "phone": person.phone,
                "file": person.file,
                "address": person.address,
                "reserve_date": str(person.reserve_date),
                "date": str(person.date),
                "services": person.services,
                "price": person.price,
            })
        )
