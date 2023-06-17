from concurrent.futures import thread
from math import e
from time import sleep
from tkinter import LEFT
from pynput import keyboard
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

SERVER_URL = "http://localhost:10555"
authHeader = {"Authorization": "Hello1controller"}

print("Start numpad listener")

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

LEFT_MONITOR = "Lenovo L32p-30"
CENTER_MONITOR = "Asus PG32UQ"
RIGHT_MONITOR = "Lenovo P27h-20"
SELECTED_MONITOR = CENTER_MONITOR

VOLUME_STEP = 5

# Use ThreadPoolExecutor to run multiple requests asynchronously
thread_pool_executor = thread.ThreadPoolExecutor(max_workers=20)

def post_async(url, json = None):
  thread_pool_executor.submit(s.post, url, json=json, timeout=timeout, headers=authHeader)

def on_press(key: keyboard.Key):
  global SELECTED_MONITOR
  if key == keyboard.Key.esc:
    return False

  try:
    key_code = key.vk
  except AttributeError:
    key_code = key.value.vk

  try:
    # Single monitor per computer

    if key_code == NUMPAD_1:
      print("Single monitor per computer/SuperComputer main")
      post_async(SERVER_URL + "/presets/Single monitor per computer/SuperComputer main/activate")
    if key_code == NUMPAD_2:
      print("Single monitor per computer/MacbookPro main")
      post_async(SERVER_URL + "/presets/Single monitor per computer/MacbookPro main/activate")
    if key_code == NUMPAD_3:
      print("Single monitor per computer/DellLaptop main")
      post_async(SERVER_URL + "/presets/Single monitor per computer/DellLaptop main/activate")

    # All monitors for main computer

    if key_code == NUMPAD_4:
      print("All monitors for main computer/SuperComputer main")
      post_async(SERVER_URL + "/presets/All monitors for main computer/SuperComputer main/activate")
    if key_code == NUMPAD_5:
      print("All monitors for main computer/MacbookPro main")
      post_async(SERVER_URL + "/presets/All monitors for main computer/MacbookPro main/activate")
    if key_code == NUMPAD_6:
      print("All monitors for main computer/DellLaptop main")
      post_async(SERVER_URL + "/presets/All monitors for main computer/DellLaptop main/activate")

    # Mute monitors

    if key_code == NUMPAD_7:
      SELECTED_MONITOR = LEFT_MONITOR
      print("Toggle mute", SELECTED_MONITOR)
      post_async(SERVER_URL + "/monitors/" + SELECTED_MONITOR + "/changeVolume", json={"toggleMute": True})
    if key_code == NUMPAD_8:
      SELECTED_MONITOR = CENTER_MONITOR
      print("Toggle mute", SELECTED_MONITOR)
      post_async(SERVER_URL + "/monitors/" + SELECTED_MONITOR + "/changeVolume", json={"toggleMute": True})
    if key_code == NUMPAD_9:
      SELECTED_MONITOR = RIGHT_MONITOR
      print("Toggle mute", SELECTED_MONITOR)
      post_async(SERVER_URL + "/monitors/" + SELECTED_MONITOR + "/changeVolume", json={"toggleMute": True})

    # Mute all monitors
    if key_code == NUMPAD_MINUS:
      print("Mute all")
      for monitor in [LEFT_MONITOR, CENTER_MONITOR, RIGHT_MONITOR]:
        post_async(SERVER_URL + "/monitors/" + monitor + "/changeVolume", json={"isMuted": True})


    # Change volume

    if key_code == NUMPAD_DIVIDE:
      print("Volume down", SELECTED_MONITOR)
      post_async(SERVER_URL + "/monitors/" + SELECTED_MONITOR + "/changeVolume",
        json={"volumeAdded": -VOLUME_STEP})
    if key_code == NUMPAD_MULTIPLY:
      print("Volume up", SELECTED_MONITOR)
      post_async(SERVER_URL + "/monitors/" + SELECTED_MONITOR + "/changeVolume",
        json={"volumeAdded": VOLUME_STEP})

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

while(True):
  if not listener.running:
    listener.stop()
    print("Restarting numpad listener")
    listener = keyboard.Listener(on_press=on_press, win32_event_filter=win32_event_filter, suppress=False)
    listener.start()  
  sleep(1)