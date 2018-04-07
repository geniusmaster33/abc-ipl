from flask import Flask,jsonify
import pytz
from datetime import datetime
from flask_cors import CORS
import logging
app = Flask(__name__)
CORS(app)
logger = logging.getLogger('werkzeug')
handler = logging.FileHandler('timeaccess.log')
logger.addHandler(handler)
app.logger.addHandler(handler)

@app.route('/getTime')
def hello_name():
	naive_dt = datetime.now()
	tz = pytz.timezone('Etc/GMT0')
	epochtime = datetime.now(tz)
	return epochtime.strftime('%s')

if __name__ == '__main__':
   app.run(debug = False,host ='0.0.0.0',threaded=True)
