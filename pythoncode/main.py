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

led_pin.off()
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("tudobem", "estatudobem")
#wlan.connect("CASATANCOS", "8N2151H4A0A")
time.sleep(5)
print(wlan.isconnected())
print('IP: ', wlan.ifconfig()[0])

mqtt_server = '192.168.189.218'
client_id = 'teste'
topic_pub = b'warehouse'
topic_msg = str(ReadTemperature())
cb = ""

def mqtt_connect():
    client = MQTTClient(client_id, mqtt_server, 1883, user="ruby", password="aluno23885", keepalive=3600)
    client.set_last_will(topic="test", msg="Desconectado", retain=True, qos=2)
    client.set_callback(mqtt_callback)
    
    client.connect()
    client.publish(topic_pub, "finished")
    client.subscribe(topic_pub)
    
    print('Connected to %s MQTT Broker' % (mqtt_server))
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
        write_to_lcd("Read product ID card")
        #write_rfid_card("11111111", 1, 1)
        product_id = read_rfid_card()
        print(product_id)
        time.sleep(3)
        write_to_lcd("Get item card closer");
        item_id = msg.replace(b"write", b"").replace(b'"', b'')
        write_rfid_card(msg.replace(b"write", b"").replace(b'"', b''), 1,1)
        write_to_lcd("Successful")
        client.publish(topic_pub, str(product_id) + "+" + str(item_id).replace("'", "").replace("b",""), retain=True)
                   
    if("delete" in msg.decode("utf-8")):
        write_to_lcd("Waiting to read")
        write_to_lcd(read_rfid_card())
        
    
    
            
        
    # Print the MQTT message on the LCD
client = mqtt_connect()
last_publish_time = 0
publish_interval = 3
   

while True:
    client.check_msg()	
        
    #current_time = time.time()
    #if current_time - last_publish_time >= publish_interval:
    #    temperature = ReadTemperature()
    #    topic_msg = str(temperature)
    #    client.publish(topic_pub, topic_msg, retain=True)
    #    print("Temperature published:", topic_msg)
    #    last_publish_time = current_time