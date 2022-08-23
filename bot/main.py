import os
import re

import firebase_admin
import twitchio
from dotenv import load_dotenv
from firebase_admin import firestore

BR_VICTORY_PATTERN = \
    r"^(?P<name>\w+) has won the Battle Royale! \+ 70 dol-lards$"


class Bot(twitchio.Client):

    def __init__(self):
        # Initialise our Bot with access token and the channel to join on boot
        super().__init__(token=os.getenv("TWITCH_ACCESS_TOKEN"),
                         initial_channels=[os.getenv("TWITCH_CHANNEL")])

    async def event_ready(self):
        # Notify us when everything is ready!
        print("Listening to battle royal events...")

    async def event_message(self, message):
        # Ignore messages not authored by streamer
        if message.author.name != self.nick:
            return

        # Only react to BR victories, and exclude streamer's one
        # TODO: Check if message can change
        match = re.match(BR_VICTORY_PATTERN, message.content)
        if match is None or match.group("name") == message.author.name:
            return

        # Retrieve user to be able to use its display_name
        name = match.group("name")
        users = await self.fetch_users([name])
        if len(users) != 1:
            print(f"error: can't find twitch user '{name}'")
            return

        # Add DB entry
        db.collection(u"events").add({
            "type": "battleroyale:victory",
            "timestamp": message.timestamp,
            "name": users[0].name,
            "display_name": users[0].display_name,
        })


# Load .env environment variables
load_dotenv()

# Setup db connexion
firebase_admin.initialize_app()
db = firestore.client()

# Start the bot
Bot().run()
