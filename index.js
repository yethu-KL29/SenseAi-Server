const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passportApi');
const pasportRouter = require('./routers/pasportRouter');


const userRouter = require('./routers/userRouter');


const app = express();

dotenv.config();

app.use(express.json())
app.use(
	cors()
);
app.use(
	cookieSession({
		name: "session",
		keys: ["googleSession"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());



app.use('/auth', pasportRouter);
app.use('/', userRouter);





const URL = process.env.URL;
mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected');
    })
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
)
