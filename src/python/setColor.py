import blinkt
import sys

blinkt.set_clear_on_exit(False)
blinkt.set_all(int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[1]))
blinkt.show()
