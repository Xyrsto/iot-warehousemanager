from mfrc522 import MFRC522
from rfidaccess import RfidAccess
import utime

def convert_string_to_array(string_data):
    pairs = [string_data[i:i+2] for i in range(0, len(string_data), 2)]
    hex_pairs = [int(pair, 16) for pair in pairs]
    hex_pairs += [0x00] * (16 - len(hex_pairs))
    print(hex_pairs)
    
    return hex_pairs

    
def write_rfid_card(dataToWrite, sectorToWrite, blockToWrite):
    reader = MFRC522(spi_id=0, sck=6, miso=4, mosi=7, cs=5, rst=22)
    access = RfidAccess()

    try:
        while True:
            reader.init()
            (stat, tag_type) = reader.request(reader.REQIDL)
            if stat == reader.OK:
                (stat, uid) = reader.SelectTagSN()
                if stat == reader.OK:
                    #print("Card detected {}  uid={}".format(hex(int.from_bytes(bytes(uid), "little", False)).upper(),reader.tohexstring(uid)))
                    defaultKey = [255, 255, 255, 255, 255, 255]

                    # Define the sector and block where you want to write your data
                    sector_to_write = 1
                    block_to_write = 1

                    # Prepare your own data
                    #example # my_data = [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00]
                    my_data = convert_string_to_array(dataToWrite)
                    print(my_data)
                    # Write your data to the specified sector and block
                    if reader.writeSectorBlock(uid, sectorToWrite, blockToWrite, my_data, keyA=defaultKey) == reader.ERR:
                        print("Writing data failed!")
                    else:
                        print("Data successfully written to sector {} block {}".format(sector_to_write, block_to_write))

                    return  # Exit the function after writing the card
            utime.sleep_ms(50)

    except KeyboardInterrupt:
        print("Bye")

# Call the function if this file is run directly
if __name__ == "__main__":
    #convert_string_to_array("12345678")
    #
    write_rfid_card()