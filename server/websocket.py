import asyncio
import websockets
import os
from bulb import initialize_connection

PORT = 6543
BULB_IP = os.environ.get("BULB_IP")


async def handler(websocket):
    bulb = None
    async for message in websocket:
        splitted_message = message.split("!")
        command_type = splitted_message[0]
        # command_type must be one of: connect, power, brightness, color or state
        if command_type == "connect":
            try:
                bulb = initialize_connection(BULB_IP)
                await websocket.send("connected")
                continue
            except Exception:
                # send "failed" and continue to next message if exists
                await websocket.send("connection_failed")
                print("[] Closing websocket connection with client")
                return None

        elif command_type == "state":
            await websocket.send(str(bulb.get_state()))

        if len(splitted_message) < 2:
            await websocket.send("invalid_payload")
            print("[] Invalid payload")
            continue

        command_value = splitted_message[1]

        if command_type == "power":
            bulb.set_state(pwr=int(command_value))

        elif command_type == "brightness":
            bulb.set_state(brightness=int(command_value))

        elif command_type == "color":
            # color is in RGB
            r, g, b = command_value.split("-")
            bulb.set_state(red=int(r), green=int(g), blue=int(b))

        elif command_type == "colormode":
            bulb.set_state(bulb_colormode=int(command_value))


        # if got here and no error has been raised - send "ok" message to client
        await websocket.send("ok")

    print("[] Client disconnected...")


async def main():
    async with websockets.serve(handler, "0.0.0.0", PORT):
        print(f"[] Listening on port {PORT}...")
        await asyncio.Future()


if __name__ == '__main__':
    asyncio.run(main())
