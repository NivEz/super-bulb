import asyncio
import websockets
import os
import json
# from dotenv import load_dotenv
from bulb import initialize_connection

# load_dotenv()

PORT = 6543
BULB_IP = os.environ.get("BULB_IP")
RELEVANT_STATE_FIELDS = ["pwr", "brightness", "bulb_colormode", "red", "green", "blue", "transitionduration"]


async def handler(websocket):
    bulb = None
    # maintaining brightness state to prevent glitch with color command
    brightness_state = 0
    async for message in websocket:
        splitted_message = message.split("!")
        command_type = splitted_message[0]
        # command_type must be one of: connect, power, brightness, color or state

        if command_type == "state":
            bulb_state = bulb.get_state()
            relevant_state_data = {k: bulb_state.get(k) for k in RELEVANT_STATE_FIELDS}
            await websocket.send(json.dumps(relevant_state_data))
            continue

        # From this point the messages have multiple values and are needed to be splitted

        if len(splitted_message) < 2 or not splitted_message[1]:
            await websocket.send("invalid_payload")
            print("[] Invalid payload")
            continue

        # commands with payloads
        command_payload = splitted_message[1]

        if command_type == "connect":
            try:
                bulb_ip, ssid, wifi_password = command_payload.split("-")
                bulb = initialize_connection(bulb_ip, ssid, wifi_password)
                await websocket.send("connected")
                continue
            except Exception as e:
                # send "failed" and continue to next message if exists
                await websocket.send("connection_failed")
                print("[] Closing websocket connection with client because of error:")
                print(e)
                return None

        elif command_type == "power":
            bulb.set_state(pwr=int(command_payload))

        elif command_type == "brightness":
            bulb.set_state(brightness=int(command_payload))
            brightness_state = int(command_payload)

        elif command_type == "colormode":
            bulb.set_state(bulb_colormode=int(command_payload))

        elif command_type == "color":
            # color is in RGB
            r, g, b = command_payload.split("-")
            bulb.set_state(red=int(r), green=int(g), blue=int(b))
            # from some reason when changing colors it changes the brightness to 100
            bulb.set_state(brightness=int(brightness_state))

        elif command_type == "transition_duration":
            bulb.set_state(transitionduration=int(command_payload))

        # if got here and no error has been raised - send "ok" message to client
        await websocket.send("ok")

    print("[] Client disconnected...")


async def main():
    async with websockets.serve(handler, "0.0.0.0", PORT):
        print(f"[] Listening on port {PORT}...")
        await asyncio.Future()


if __name__ == '__main__':
    asyncio.run(main())
