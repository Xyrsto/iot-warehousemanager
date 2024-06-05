# MQTT
import network
import time
import utime
from machine import Pin, ADC
from umqtt.simple import MQTTClient

# LCD
from machine import I2C, Pin
from time import sleep
from pico_i2c_lcd import I2cLcd

# RFID
from data_read import read_rfid_card
from data_write import write_rfid_card

import wifimgr


# Initialize the I2C interface
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)

# Scan for I2C devices and get the address of the LCD
devices = i2c.scan()
if devices:
    lcd_addr = devices[0]
    
# Initialize the LCD object
lcd = I2cLcd(i2c, lcd_addr, 2, 16)

adcpin = 4
sensor = machine.ADC(adcpin)
led_pin = machine.Pin("LED", machine.Pin.OUT)

def ReadTemperature():
    adc_value = sensor.read_u16()
    volt = (3.3/65535) * adc_value
    temperature = 27 - (volt-0.706)/0.001721
    return round(temperature, 1)

writtenData = ""
def write_to_lcd(dataStr):
    global writtenData
    if (writtenData != dataStr):
        lcd.clear()
        lcd.putstr(dataStr)
        
    writtenData = dataStr

wlan = wifimgr.get_connection()

if wlan is None:
    print("Não foi possível iniciar a ligação")
    while True:
        pass
    
print("OK")
print (wlan)

mqtt_server = '6.tcp.eu.ngrok.io'
client_id = 'teste'
topic_pub = b'warehouse'
topic_msg = str(ReadTemperature())
cb = ""

def mqtt_connect():
    client = MQTTClient("aaa", mqtt_server, port=16061)
    client.set_callback(mqtt_callback)
    
    client.connect()
    print('Connected to %s MQTT Broker' % (mqtt_server))
    client.subscribe(b'warehouse')
    print('Subbed to %s MQTT Broker' % (mqtt_server))
    return client

def reconnect():
    print('Failed to connect to the MQTT Broker. Reconnecting...')
    while True:
        try:
            client = mqtt_connect()
            break    
        except OSError as e:
            print("Error:", e)
            time.sleep(5)

def mqtt_callback(topic, msg):
    print("Received MQTT message on topic: {}, message: {}".format(topic, msg))
    print(msg.decode("utf-8"))
    if("write" in msg.decode("utf-8")):
        write_to_lcd("Read category ID card")
        #write_rfid_card("22222222", 1, 1)
        product_id = read_rfid_card()
        write_to_lcd("Waiting...")
        print(product_id)
        time.sleep(3)
        write_to_lcd("Get product card closer");
        item_id = msg.replace(b"write", b"").replace(b'"', b'')
        write_rfid_card(msg.replace(b"write", b"").replace(b'"', b''), 1,1)
        write_to_lcd("Successful")
        client.publish(topic_pub, str(product_id) + "+" + str(item_id).replace("'", "").replace("b",""), retain=True)
                   
    if("delete" in msg.decode("utf-8")):
        write_to_lcd("Read item card")
        item_id = read_rfid_card()
        client.publish(topic_pub, "remove" + "++" + str(item_id))
        write_to_lcd("Successful")

        
client = mqtt_connect()
last_publish_time = 0
publish_interval = 3
ledState = "off"
   
while True:
    client.check_msg()
    
    current_time = time.time()
   
    if current_time - last_publish_time >= publish_interval:
        temperature = ReadTemperature()
        
        if temperature>20:
            led_pin.high()
            ledState = "On"
        else:
            led_pin.low()
            ledState = "Off"
        
        topic_msg = str(temperature)
        client.publish("temperatura", topic_msg+ledState, retain=False)
        print("Temperature published:", topic_msg)
        last_publish_time = current_time

