import os
import re

import firebase_admin
import twitchio
from dotenv import load_dotenv
from firebase_admin import firestore

PATTERNS = {
    "battleroyale:victory": r"^(?P<name>\w+) has won the Battle Royale! \+ 70 dol-lards$",
    "battleroyale:poop": r"^(?P<name>\w+) a gagné 5 dol-lards en mangeant du caca !$",
    "basketball:victory": r"^(?P<name>\w+) Victory \+150$"
}


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

        # Test patterns
        for type, pattern in PATTERNS.items():
            match = re.match(pattern, message.content)

            if match is None:
                continue

            # Convert name to lowercase
            name = match.group("name").lower()

            # Exclude streamer's event
            if name == self.nick:
                return

            # Retrieve user to get its display_name
            user, *_ = await self.fetch_users([name])
            if user is None:
                print(f"error: can't find twitch user '{name}'")
                return

            # Add DB entry
            db.collection(u"events").add({
                "type": type,
                "timestamp": message.timestamp,
                "name": user.name,
                "display_name": user.display_name,
            })


# Load .env environment variables
load_dotenv()

# Setup db connexion
firebase_admin.initialize_app()
db = firestore.client()

# Start the bot
Bot().run()
