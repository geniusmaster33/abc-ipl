from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS
import pickle as cPickle
app = Flask(__name__)
import os.path


import logging
import json 
logger = logging.getLogger('werkzeug')
handler = logging.FileHandler('loginaccess.log')
logger.addHandler(handler)
app.logger.addHandler(handler)
# config
app.config.update(DEBUG = False)
CORS(app)
# somewhere to login
usernameFullname = {}
usernamePK = {}
pkusername = {}
pkusernameAdmin = {}
if(os.path.isfile("usernameFullname.pickle")):
	with open(r"usernameFullname.pickle", "r") as input_file:
		usernameFullname= cPickle.load(input_file)
if(os.path.isfile("usernamePK.pickle")):
        with open(r"usernamePK.pickle", "r") as input_file:
                usernamePK= cPickle.load(input_file)
if(os.path.isfile("pkusername.pickle")):
        with open(r"pkusername.pickle", "r") as input_file:
                pkusername= cPickle.load(input_file)
if(os.path.isfile("pkusernameAdmin.pickle")):
        with open(r"pkusernameAdmin.pickle", "r") as input_file:
                pkusernameAdmin= cPickle.load(input_file)
@app.route("/login", methods=["GET", "POST"])
def login():
	if request.method == 'POST':
		content = request.json
		username = content['username']
		fullname = content['fullname']       
		pk = content['key']       
		if username in usernameFullname.keys():
			print username
			return "already registered"+usernameFullname[username],406
		else:
			if pk in pkusername.keys():
				return "PK already registered",401
			else:
				usernameFullname[username]=fullname
				usernamePK[username] = pk
				pkusername[pk] = username
				with open(r"usernameFullname.pickle", "wb") as output_file:
					cPickle.dump(usernameFullname, output_file)
				with open(r"usernamePK.pickle", "wb") as output_file:
                                        cPickle.dump(usernamePK, output_file)
				with open(r"pkusername.pickle", "wb") as output_file:
                                        cPickle.dump(pkusername, output_file)
				return "new user saved",200
	else:
		return Response('''
		<form action="" method="post">
		<p><input type=text name=username>
		<p><input type=name name=fullname>
		<p><input type=name name=key>
		<p><input type=submit value=Login>
		</form>
		''')


# somewhere to logout
@app.route("/getName")
def checkusername():
	pk = request.args.get('pk')
	if(pk in pkusername.keys()):
		if(pk in pkusernameAdmin.keys()):
			return Response(usernameFullname[pkusername[pk]]+",Admin")
		else:
			return Response(usernameFullname[pkusername[pk]])
	else:
		return "Welcome"
@app.route("/makeAdmin")
def makeAdmin():
        pk = request.args.get('pk')
	if pk in pkusername.keys():
		pkusernameAdmin[pk] =  pkusername[pk]
		with open(r"pkusernameAdmin.pickle", "wb") as output_file:
               	        cPickle.dump(pkusernameAdmin, output_file)
		return "Admin Added successfully"
	return "User Not registered"

@app.route("/removeAdmin")
def removeAdmin():
        pk = request.args.get('pk')
        if pk in pkusernameAdmin.keys():
                pkusernameAdmin.pop(pk,None)
                with open(r"pkusernameAdmin.pickle", "wb") as output_file:
                        cPickle.dump(pkusernameAdmin, output_file)
                return "Admin removed successfully"
        return "User Not Admin"

@app.route("/removeUser")
def removeusername():
        un = request.args.get('username')
        if(un in usernameFullname.keys()):
		usernameFullname.pop(un,None)
		pkusername.pop(usernamePK[un],None)
		usernamePK.pop(un,None)
		with open(r"usernameFullname.pickle", "wb") as output_file:
                        cPickle.dump(usernameFullname, output_file)
                with open(r"usernamePK.pickle", "wb") as output_file:
                	cPickle.dump(usernamePK, output_file)
                with open(r"pkusername.pickle", "wb") as output_file:
                        cPickle.dump(pkusername, output_file)
                return Response(un+"deleted")
        else:
                return "Not Found"

@app.route("/checkusername")
def checkpk():
	username = request.args.get('username')
	if(username in usernameFullname.keys()):
		return Response(usernameFullname[username]+ ","+usernamePK[username])
	else:
		return "Welcome"


if __name__ == "__main__":
	app.run(host="0.0.0.0",port=4020,debug=False,threaded=True)
