from mfrc522 import MFRC522
from rfidaccess import RfidAccess
import utime

def extract_first_4_bytes(data):
    # Extract the first 4 bytes
    first_4_bytes_hex = data[:8]

    # Convert the extracted bytes to a string of hexadecimal representation
    first_4_bytes_str = ''.join(['{:02x}'.format(byte) for byte in first_4_bytes_hex])

    return first_4_bytes_str[0:8]

def read_rfid_card():
    reader = MFRC522(spi_id=0, sck=6, miso=4, mosi=7, cs=5, rst=22)
    access = RfidAccess()

    while True:
        reader.init()
        (stat, tag_type) = reader.request(reader.REQIDL)
        if stat == reader.OK:
            (stat, uid) = reader.SelectTagSN()
            if stat == reader.OK:
                defaultKey = [255, 255, 255, 255, 255, 255]

                # Define the sector and block to read
                sector_to_read = 1
                block_to_read = 1

                # Read data from the card
                data_read = reader.readSectorBlock(uid, sector_to_read, block_to_read, keyA=defaultKey)
                if data_read != reader.ERR:
                    # Extract the first 4 bytes as bytes
                    first_4_bytes = extract_first_4_bytes(data_read[1])
                    return first_4_bytes

# Call the function if this file is run directly
if __name__ == "__main__":
    #
    read_rfid_card()