import os
import re

import firebase_admin
import twitchio
from dotenv import load_dotenv
from firebase_admin import firestore as firebase_firestore
from google.auth.credentials import AnonymousCredentials
from google.cloud import firestore

MESSAGE_PATTERNS = {
    "basketball:victory": r"^(?P<name>\w+) Victory \+150$",
    "battleroyale:victory": r"^(?P<name>\w+) has won the Battle Royale! \+ 70 dol-lards$",
    "battleroyale:poop": r"^(?P<name>\w+) a gagné 5 dol-lards en mangeant du caca !$",
}

COMMAND_EVENTS = {
    "basket": "basketball:victory",
    "br": "battleroyale:victory",
    "duel": "duel:victory",
    "gartic": "garticshow:victory",
    "marbles": "marbles:victory",
    "skyjo": "skyjo:victory",
}

COMMAND_PATTERN = (
    r"^!jambot (?P<event>" + "|".join(COMMAND_EVENTS.keys()) + ") @?(?P<name>\w+)$"
)

USER_ALIASES = {
    "jarvets": {"name": "stephymanette", "display_name": "StephyManette"},
    "stephymanette_": {"name": "stephymanette", "display_name": "StephyManette"},
}


def find_event(content):
    """
    Return event type and user name if content correspond to pattern
    """
    for event, pattern in MESSAGE_PATTERNS.items():
        match = re.match(pattern, content)
        if match is not None:
            return event, match.group("name").lower()

    match = re.match(COMMAND_PATTERN, content)
    if match is None:
        return None, None

    event, name = match.groups()
    return COMMAND_EVENTS.get(event), name.lower()


class Bot(twitchio.Client):
    def __init__(self):
        # Initialise our Bot with access token and the channel to join on boot
        super().__init__(
            token=os.getenv("TWITCH_ACCESS_TOKEN"),
            initial_channels=[os.getenv("TWITCH_CHANNEL")],
        )

    async def event_ready(self):
        # Notify us when everything is ready!
        print("Listening to battle royale events...")

    async def event_message(self, message):
        # Ignore messages not authored by streamer
        if message.author.name != self.nick:
            return

        # Find valid patterns
        event, name = find_event(message.content)
        if event is None or name is None:
            return

        # Exclude streamer's event
        if name == self.nick:
            return

        # Retrieve user to get its display_name
        user = None
        try:
            user, *_ = await self.fetch_users([name])
        except:
            pass

        if user is None:
            print(
                f"error: Can't find twitch user '{name}'. Triggered by message '{message.content}'"
            )
            return

        event = {
            "type": event,
            "timestamp": message.timestamp,
            "name": user.name,
            "display_name": user.display_name,
        }

        # Handle renamed user
        alias = USER_ALIASES.get(user.name)
        if alias is not None:
            event.update(**alias, path=user.name)

        # Add DB entry
        db.collection("events").add(event)


# Load .env environment variables
load_dotenv()

# Setup db connexion
if os.getenv("FIRESTORE_EMULATOR_HOST") is not None:
    db = firestore.Client(credentials=AnonymousCredentials())
else:
    firebase_admin.initialize_app()
    db = firebase_firestore.client()

# Start the bot
Bot().run()
