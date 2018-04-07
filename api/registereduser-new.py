from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS
import pickle as cPickle
import os
import logging
import json
logger = logging.getLogger('werkzeug')
handler = logging.FileHandler('access.log')
logger.addHandler(handler)
app = Flask(__name__)
app.logger.addHandler(handler)
app.config.update(DEBUG = False)
CORS(app)
@app.route("/getusers")
def checkuser():
#     username = request.args.get('username')
#        if(username in usernameFullname.keys()):
        if(os.path.isfile("usernameFullname.pickle")):
                with open(r"usernameFullname.pickle", "r") as input_file:
                        usernameFullname= cPickle.load(input_file)
                        return json.dumps(usernameFullname)
        #else:
        return "NA"
@app.route("/getuserspk")
def checkpk():
        output = "["
        if(os.path.isfile("usernamePK.pickle")):
                with open(r"usernamePK.pickle", "r") as input_file:
                        usernamePK= cPickle.load(input_file)
                        if(os.path.isfile("usernameFullname.pickle")):
                                with open(r"usernameFullname.pickle", "r") as input_file1:
                                        usernameFullname= cPickle.load(input_file1)
                                        for i in usernamePK.keys():
                                                output = output + "{ \"name\":\""+usernameFullname[i]+"\", \"key\":\""+usernamePK[i]+"\"},"
                        output = output[:len(output)-1] + "]"
                        return output
                #else:
        return "NA"
if __name__ == "__main__":
        app.run(host="0.0.0.0",port=4030,debug=False,threaded=True)
