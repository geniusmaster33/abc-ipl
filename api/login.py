from flask import Flask, Response, redirect, url_for, request, session, abort

app = Flask(__name__)

# config
app.config.update(
    DEBUG = True)

# somewhere to login
usernameFullname = {}
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username']
        fullname = request.form['fullname']       
        if username in usernameFullname.keys():
            return usernameFullname[username]
        else:
            usernameFullname[username]=fullname
            return "new user saved"
    else:
        return Response('''
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=name name=fullname>
            <p><input type=submit value=Login>
        </form>
        ''')


# somewhere to logout
@app.route("/logout")
def logout():
    logout_user()
    return Response('<p>Logged out</p>')



if __name__ == "__main__":
    app.run(host="0.0.0.0",port=4020)
