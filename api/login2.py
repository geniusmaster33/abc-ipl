from flask import Flask, Response, redirect, url_for, request, session, abort

app = Flask(__name__)

# config
app.config.update(
DEBUG = True)

# somewhere to login
usernameFullname = {}
usernamePK = {}
pkusername = {}
@app.route("/login", methods=["GET", "POST"])
def login():
	if request.method == 'POST':
		username = request.form['username']
		fullname = request.form['fullname']       
		pk = request.form['privatekey']       
		if username in usernameFullname.keys():
			return "already registered"+usernameFullname[username]
		else:
			if pk in pkusername.keys():
				return "PK already registered"
			else:
				usernameFullname[username]=fullname
				usernamePK[username] = pk
				pkusername[pk] = username
				return "new user saved"
	else:
		return Response('''
		<form action="" method="post">
		<p><input type=text name=username>
		<p><input type=name name=fullname>
		<p><input type=name name=privatekey>
		<p><input type=submit value=Login>
		</form>
		''')


# somewhere to logout
@app.route("/checkusername")
def checkusername():
	username = request.args.get('username')
	if(username in pkusername.keys()):
		return Response(usernamePK[username])
	else:
		return "Not registered"

@app.route("/checkpk")
def checkpk():
	username = request.args.get('pk')
	if(username in usernameFullname.keys()):
		return Response(usernameFullname[username]+ +usernamePK[username])
	else:
		return "Not registered"


if __name__ == "__main__":
	app.run(host="0.0.0.0",port=4020)
