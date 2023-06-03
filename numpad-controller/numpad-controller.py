from math import e
from time import sleep
from pynput import keyboard
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

SERVER_URL = "http://pqhuy.ddns.net:10555"
print("Start numpad-controller.py")

s = requests.Session()
s.mount('http://', HTTPAdapter(max_retries=Retry(total=1)))
timeout = 0.5

NUMPAD_PLUS = (107)
NUMPAD_MINUS = (109)
NUMPAD_MULTIPLY = (106)
NUMPAD_DIVIDE = (111)
NUMPAD_DOT = (110)
NUMPAD_0 = (96)
NUMPAD_1 = (97)
NUMPAD_2 = (98)
NUMPAD_3 = (99)
NUMPAD_4 = (100)
NUMPAD_5 = (101)
NUMPAD_6 = (102)
NUMPAD_7 = (103)
NUMPAD_8 = (104)
NUMPAD_9 = (105)

def on_press(key: keyboard.Key):
  if key == keyboard.Key.esc:
    return False

  try:
    key_code = key.vk
  except AttributeError:
    key_code = key.value.vk

  try:
    if key_code == NUMPAD_1:
      print("All monitors for main computer/SuperComputer main")
      s.post(SERVER_URL + "/presets/All monitors for main computer/SuperComputer main/activate", timeout=timeout)
    if key_code == NUMPAD_2:
      print("All monitors for main computer/Macbook main")
      s.post(SERVER_URL + "/presets/All monitors for main computer/Macbook main/activate", timeout=timeout)
    if key_code == NUMPAD_3:
      print("All monitors for main computer/DellLaptop main")
      s.post(SERVER_URL + "/presets/All monitors for main computer/DellLaptop main/activate", timeout=timeout)
    if key_code == NUMPAD_4:
      print("Single monitor per computer/SuperComputer main")
      s.post(SERVER_URL + "/presets/Single monitor per computer/SuperComputer main/activate", timeout=timeout)
    if key_code == NUMPAD_5:
      print("Single monitor per computer/Macbook main")
      s.post(SERVER_URL + "/presets/Single monitor per computer/Macbook main/activate", timeout=timeout)
    if key_code == NUMPAD_6:
      print("Single monitor per computer/DellLaptop main")
      s.post(SERVER_URL + "/presets/Single monitor per computer/DellLaptop main/activate", timeout=timeout)
  except Exception as e:
    print("Error: " + str(e))

# Block numpad key event propagation to other apps
def win32_event_filter(msg, data):
  if not (msg == 257 or msg == 256):
    return True
  if ([NUMPAD_1, NUMPAD_2, NUMPAD_3, NUMPAD_4, NUMPAD_5,
       NUMPAD_6, NUMPAD_7, NUMPAD_8, NUMPAD_9, NUMPAD_0,
       NUMPAD_PLUS, NUMPAD_MINUS, NUMPAD_MULTIPLY, NUMPAD_DIVIDE,
       NUMPAD_DOT].count(data.vkCode) > 0):
    listener._suppress = True # block event propagation to other apps
  else:
    listener._suppress = False # do not block

  return True

listener = keyboard.Listener(on_press=on_press, win32_event_filter=win32_event_filter, suppress=False)
listener.start()

while(not sleep(5)):
  pass