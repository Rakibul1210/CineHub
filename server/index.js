const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const OTPGenerator = require('otp-generator');
const { useState } = require('react');
const mammoth = require('mammoth');
const Docxtemplater = require('docxtemplater');
const handlebars = require('handlebars');
const bcrypt = require('bcrypt');
const AuthService = require('./AuthService')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mysql2 = require('mysql2/promise');

// Create a MySQL pool for handling database connections
const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'moviedb',
  connectionLimit: 10,
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moviedb',
  });

  db.connect(err=>{
    if(err){
        return err;
    }
  })

// Retrieve a user's data and watched movies from the database
async function getUserData(username) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT id, username, watched_movies FROM users WHERE username = ?`,
      [username]
    );
    if (rows.length === 0) {
      throw new Error(`User ${username} not found`);
    }
    const { id, watched_movies } = rows[0];
    return { id, username, watched_movies: JSON.parse(watched_movies) };
  } finally {
    connection.release();
  }
}

const axios = require('axios');

// Retrieve movie details from the TMDB API
async function getMovieDetails(movieId) {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
    params: {
      api_key: 'YOUR_API_KEY',
      language: 'en-US',
    },
  });
  return response.data;
}

// Generate movie recommendations based on the user's watched movies
async function getMovieRecommendations(watchedMovies) {
    const movieDetails = await Promise.all(watchedMovies.map(getMovieDetails));
    const genres = movieDetails.flatMap((movie) => movie.genres);
    const genreCounts = {};
    genres.forEach((genre) => {
      if (genre.id in genreCounts) {
        genreCounts[genre.id] += 1;
      } else {
        genreCounts[genre.id] = 1;
      }
    });
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 3);
    const recommendedMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: 'YOUR_API_KEY',
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        with_genres: topGenres.join(','),
      },
    });
    return recommendedMovies.data.results;
  }

const app = express();
app.use(express.json());
app.use(cors());

// Handle requests to the /api/recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { watched_movies } = req.body;
    const recommendations = await getMovieRecommendations(watched_movies);
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});


//Authentication Section
//sgMail.setApiKey('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');
sgMail.setApiKey('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');





const uDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moviedb'
})

uDB.connect(err => {
    if (err) {
        return err;
    }
})

app.listen(5050, ()=>{
    console.log("listening to 5050")
})
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const userID = req.body.userID;
    const secretKey = req.body.secretKey;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (isMatch) {
        uDB.query("INSERT into user(Name, Email, Password, user_ID, watched, watchlist) values(?,?,?,?, NULL, NULL)",
            [name, email, hashedPassword, userID], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            });
    }
})

app.post('/getByEmail', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sign = false;

    uDB.query("SELECT * FROM user where email=?", [email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0]) {
                const hashedPassword = result[0].password
                const isMatch = bcrypt.compareSync(password, hashedPassword);
                console.log("username: ", result[0].name);

                const secretKey = crypto.randomBytes(64).toString('hex');
                AuthService.setSecretKey(secretKey)

                const encryptionKey = crypto.createHash('sha256').update(result[0].name).digest();
                const iv = Buffer.alloc(16, 0);

                const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

                let encryptedSecretKey = cipher.update(secretKey, 'utf8', 'hex');
                encryptedSecretKey += cipher.final('hex');

                console.log("SecretKey: ", encryptedSecretKey)

                const payload = { userID: result[0].name }

                const token = jwt.sign(payload, encryptedSecretKey);

                // try {
                //     jwt.verify(token, encryptedSecretKey)
                //     console.log("verified")
                // } catch (error) {
                //     console.log("not verified");
                // }

                if (isMatch) {
                    console.log(result)
                    res.send({ sign: true, token, result });
                }
                else {
                    res.send(sign)
                }
            }
            else {
                res.send(sign)
            }
        }
    });
});


app.post('/getByUID', (req, res) => {
    const uID = req.body.uID;
    console.log(uID)

    uDB.query("SELECT * FROM user where user_id=?", [uID], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    });
});




app.post('/authentication', async (req, res) => {
    const email = req.body.email;

    // const otp = otpGenerator.generate(6, {
    //     numeric: true,
    //     alphabets: false,
    //     upperCase: false,
    //     specialChars: false
    //   });

    const otp = crypto.randomInt((1000, 9999)).toString()

    const msg = {
        to: email,
        from: 'bsse1207@iit.du.ac.bd',
        subject: 'OTP Verification',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <title>OTP Verification</title>
                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        color: #333;
                        background-color: #f2f2f2;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 5px;
                        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
                    }
                    h1 {
                        font-size: 24px;
                        font-weight: normal;
                        margin-top: 0;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    p {
                        margin-top: 0;
                        margin-bottom: 20px;
                        line-height: 1.5;
                    }
                    .otp-box {
                        display: inline-block;
                        padding: 10px;
                        border: 2px solid #ccc;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>OTP Verification</h1>
                    <p>Thank you for choosing our service. As part of our security measures, we require that you verify your account with a one-time password (OTP).</p>
                    <p>
                        <div class="otp-box">${otp}</span>
                    </p>
                    <p>Please enter this OTP in the required field to complete your account verification.</p>
                    <p>If you did not request an OTP or believe that your account has been compromised, please contact us immediately at [insert contact information].</p>
                    <p>Thank you,</p>
                    <p><em>SVAS</em></p>
                </div>
            </body>
            </html>
        `
    };
    sgMail.send(msg);
    console.log(otp)

    res.send(otp);
})


app.post('/createToken', (req, res) => {
    const secretKey = crypto.randomBytes(64).toString('hex');
    const userID = crypto.randomBytes(32).toString('hex');
    const payload = { userID: userID }

    const token = jwt.sign(payload, secretKey);

    console.log({ userID, token, secretKey })

    res.send({ userID, token, secretKey });
})


app.post('/createLoginToken', (req, res) => {
    const userID = req.body.userID;
    const payload = { userID: userID };
    const secretKey = req.body.secretKey;

    const token = jwt.sign(payload, secretKey)

    res.send(token)
})



app.post('/checkValidation', (req, res) => {
    const token = req.body.token
    const userID = req.body.userID.uID
    console.log(req.body.userID.uID);
    try {
        const sign = AuthService.isAuthenticated(token, userID);
        console.log('sent');
        res.send( sign );
    } catch (err) {
        console.error("wont be sent");
        res.status(500).send('Internal server error');
    }
})



//Update movie lists

app.post('/addToWatchlist', (req, res) => {
    const uID = req.body.userID;
    const movie = req.body.movie;
    const userID = req.body.userID;
    const jsonMovie = JSON.stringify(movie);
    
    //console.log("userId :" + uID.uID  + "erfgyhujikolp[oiuytre");
    console.log(movie);
    console.log("UID :" + userID.uID);

    db.query("UPDATE user SET watchlist = ? WHERE name = ?", [jsonMovie, userID.uID], (err, result)  => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while fetching the latest event notice');
            }
            else{
            
                res.send("Movie Inserted");
            }
        }) 
    })
            


 app.post('/addToWatched', (req, res) => {
    const movie = req.body.movie;
    const userID = req.body.userID;
    const jsonMovie = JSON.stringify(movie);
    const email = "bsse1220@iit.du.ac.bd";
    //console.log("userId :" + uID.uID  + "erfgyhujikolp[oiuytre");
    console.log(movie);
    console.log("UID :" + userID.uID);

    db.query("UPDATE user SET watched = ? WHERE name = ?", [jsonMovie, userID.uID], (err, result)  => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred while fetching the latest event notice');
            }
            else{
            
                res.send("Movie Inserted");
            }
        })   

 })

// app.post('/addToWatched', (req, res) => {
//     const uID = req.body.userID;
//     const movie = req.body.movie;
//     const jsonMovie = JSON.stringify(movie);
//     const email = "bsse1220@iit.du.ac.bd";
//     console.log(movie);

//     // Check if the movie already exists in the watched column for this user
//     db.query("SELECT watched FROM user WHERE email = ?", [email], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('An error occurred while fetching the latest event notice');
//         }

//         // If the movie already exists in the watched column, return an error
//         const watchedMovies = JSON.parse(result[0].watched);
//         if (watchedMovies.some(m => m.id === movie.id)) {
//             return res.status(400).send('Movie already exists in the watched list');
//         }

//         // Otherwise, add the movie to the watched list
//         watchedMovies.push(movie);
//         const updatedWatchedMovies = JSON.stringify(watchedMovies);
//         db.query("UPDATE user SET watched = ? WHERE user_id = ?", [updatedWatchedMovies, uID], (err, result)  => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('An error occurred while fetching the latest event notice');
//             }
//             else{
//                 res.send("Movie inserted to watched list");
//             }
//         });
//     });
// });


 app.post('/removeFromWatchlist', (req, res) => {
    const userID = req.body.userID;
    const movie = req.body.movie;
    const movieID = movie.id;
    const jsonMovie = JSON.stringify(movie);

    db.query("UPDATE user SET watchlist = JSON_REMOVE(watchlist, CONCAT('$[', JSON_SEARCH(watchlist, 'one', movieID), ']')) WHERE name = userID.uID",(err2,result1)=>{
        //console.log("loop1");
        if (err2) {
            console.error(err2);
            return res.status(500).send('An error occurred while fetching the maximum event ID');
        }
       else{
        res.send("Movie is removed");
       }
       
    })
            

 })

//  app.post('/removeFromWatched', (req, res) => {
//     const uID = req.body.userID;

//     db.query("SELECT MAX(eventid) INTO @max_id FROM eventNotice",(err2,result1)=>{
//         //console.log("loop1");
//         if (err2) {
//             console.error(err2);
//             return res.status(500).send('An error occurred while fetching the maximum event ID');
//         }
//         db.query("SELECT * FROM eventNotice WHERE eventid = @max_id", (err3, result) => {
//             if (err3) {
//                 console.error(err3);
//                 return res.status(500).send('An error occurred while fetching the latest event notice');
//             }
//             else{
//                 const name = result[0].name;
//                 const startingDate = result[0].startingDate;
//                 const deadline = result[0].deadline;
//                 res.send({ name, startingDate, deadline });
//             }
//         })
//     })         

 //})

 app.post('/moveToWatchlist', (req, res) => {
    const uID = req.body.userID;

    db.query("SELECT MAX(eventid) INTO @max_id FROM eventNotice",(err2,result1)=>{
        //console.log("loop1");
        if (err2) {
            console.error(err2);
            return res.status(500).send('An error occurred while fetching the maximum event ID');
        }
        db.query("SELECT * FROM eventNotice WHERE eventid = @max_id", (err3, result) => {
            if (err3) {
                console.error(err3);
                return res.status(500).send('An error occurred while fetching the latest event notice');
            }
            else{
                const name = result[0].name;
                const startingDate = result[0].startingDate;
                const deadline = result[0].deadline;
                res.send({ name, startingDate, deadline });
            }
        })
    })
            

 })



