import broadlink
from broadlink.exceptions import NetworkTimeoutError
import socket

TIMEOUT = 3


def initialize_connection(bulb_ip, ssid, wifi_password, timeout=TIMEOUT):
    found_device = None
    if bulb_ip:
        try:
            device = broadlink.hello(bulb_ip, timeout=timeout)
            found_device = device
        except Exception as e:
            print(e)
            print("Could not establish direct connection, initializing scan...")
    if not found_device:
        if not ssid or not wifi_password:
            raise NetworkTimeoutError("Missing SSID or Wifi password")
        broadlink.setup(ssid, wifi_password, 3)
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
