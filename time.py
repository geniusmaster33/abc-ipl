from flask import Flask
import pytz
from datetime import datetime
app = Flask(__name__)

@app.route('/getTime')
def hello_name():
        naive_dt = datetime.now()
        tz = pytz.timezone('Asia/Calcutta')
        epochtime = datetime.now(tz)
        return epochtime.strftime('%s')

if __name__ == '__main__':
   app.run(debug = True,host ='0.0.0.0')