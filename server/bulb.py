import broadlink
from broadlink.exceptions import NetworkTimeoutError
import socket
from time import sleep
import random

TIMEOUT = 3
SSID = "" # TODO add env os.environ
WIFI_PASSWORD = ""


def initialize_connection(bulb_ip, timeout=TIMEOUT):
    found_device = None
    if bulb_ip:
        try:
            device = broadlink.hello(bulb_ip, timeout=timeout)
            found_device = device
        except NetworkTimeoutError:
            print("Could not establish direct connection, initializing scan...")
    if not found_device:
        broadlink.setup(SSID, WIFI_PASSWORD, 3)
        # find devices - get the first if few were found
        ip = socket.gethostbyname(socket.gethostname())
        devices = broadlink.xdiscover(local_ip_address=ip, timeout=timeout)
        for device in devices:
            if device.name == 'Smart Bulb':
                found_device = device
    if not found_device:
        raise ConnectionError("Device not found")

    if found_device.is_locked:
        print("Device is in locked mode, make sure to unlock it")
        raise ConnectionError("Device is locked")

    found_device.auth()
    return found_device


def waves_poc(bulb, iterations=100, freq=1.0):
    for i in range(iterations):
        brightness = random.randrange(1, 101)
        red, blue, green = [random.randrange(0, 256) for r in range(3)]
        bulb.set_state(brightness=brightness, red=red, blue=blue, green=green)
        sleep(0.25)
        bulb.set_state(brightness=1, transitionduration=1500)
        print(f"Brightness: {brightness}. Change number: {i + 1}...")
        sleep(1 / freq)


if __name__ == '__main__':
    bulb = initialize_connection()
    print("State before: ", bulb.get_state())
    # bulb.set_state(brightness=50, red=0, blue=0, green=0, hue=0, saturation=0, bulb_colormode=0, transitionduration=0)

    # bulb.set_state(brightness=1)
    waves_poc(bulb, freq=4, iterations=15)

    # bulb.set_state(brightness=100)
    # bulb.set_state(brightness=100, transitionduration=1, bulb_colormode=1, red=255, green=255, blue=255)

    print("State after: ", bulb.get_state())
