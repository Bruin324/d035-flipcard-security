const expressMocker = require('supertest');
const assert = require('assert');
const application = require('./application.js');
const crypto = require('crypto');
const fs = require('file-system');
var data = require('./data.json');
const file = './data.json';
const session = require('express-session');

//clears previous data


describe('FlipCards', () => {
    before((done) => {
        data = [];
        var dataJSON = JSON.stringify([]);
        fs.writeFile(file, dataJSON, function (err) {
            console.log('file initialized');
            done();
        });
    });

    it('should allow a user to register', (done) => {
        expressMocker(application)
            .post('/api/users/register')
            .expect(200)
            .send({
                "userName": "Bruin",
                "email": "bruin@test.com",
                "password": "qwer1234"
            })
            .expect(response => {
                assert.deepEqual(response.body,
                    {
                        "userName": "Bruin",
                        "email": "bruin@test.com",
                        "userId": 1,
                        "decks": [],
                        "correct": 0,
                        "incorrect": 0
                    })
            })
            .end(done);
    })

    it('should display DNE message for incorrect email login', (done) => {
        expressMocker(application)
            .post('/api/users/login')
            .expect(200)
            .send({
                "email": "bruin1@test.com",
                "password": "qwer1234"
            })
            .expect(response => {
                assert.equal(response.body.message, "Username does not exist")
            })
            .end(done)
    });

    it('should display error message for incorrect password', (done) => {
        expressMocker(application)
            .post('/api/users/login')
            .expect(200)
            .send({
                "email": "bruin@test.com",
                "password": "wer1234"
            })
            .expect(response => {
                assert.equal(response.body.message, "Wrong password entered")
            })
            .end(done)
    })

    it('should allow a user to log in', (done) => {
        expressMocker(application)
            .post('/api/users/login')
            .expect(200)
            .send({
                "email": "bruin@test.com",
                "password": "qwer1234"
            })
            .expect(response => {
                assert.deepEqual(response.body,
                    {
                        "isAuthenticated": true,
                        "name": "Bruin",
                        "email": "bruin@test.com",
                        "userId": 1,
                        "correct": 0,
                        "incorrect": 0
                    })
            })
            .end(done);

    })

    it('should allow a user to create a new deck', (done) => {
        expressMocker(application)
            .post('/api/1/decks')
            .expect(200)
            .send({
                "name": "math"
            })
            .expect(response => {
                assert.deepEqual(response.body, 
                    {
                        "deckName": "math",
                        "deckId": 1,
                        "cards": []

                    });
            })
            .end(done);
    })

    it('should allow a user to view all their decks', (done) => {
        expressMocker(application)
            .get('/api/1/decks')
            .expect(200)
            .expect(response => {
                assert.deepEqual(response.body, [
                    {
                        "deckName": "math",
                        "deckId": 1,
                        "cards": []
                    }]);
            })
            .end(done);
    })

    it('should allow a user to create a card in a deck', (done) => {
        expressMocker(application)
            .post('/api/1/1/cards')
            .expect(200)
            .send({
                "question": "2+2",
                "answer": "5"
            })
            .expect(response => {
                assert.deepEqual(response.body, 
                    {
                        "cardId": 1,
                        "cardQuestion": "2+2",
                        "cardAnswer": "5"
                    });
            })
            .end(done)
    })

    it('should allow a user to edit a card in a deck', (done) => {
        expressMocker(application)
            .put('/api/1/1/1')
            .expect(200)
            .send({
                "question": "2+2",
                "answer": "4"
            })
            .expect(response => {
                assert.deepEqual(response.body,
                {
                    "cardId": 1,
                    "cardQuestion": "2+2",
                    "cardAnswer": "4"
                    
                });
            })
            .end(done);
    })

    it('should allow a user to view a random card in a deck', (done) => {
        expressMocker(application)
            .get('/api/1/1/quiz')
            .expect(200)
            .expect(response => {
                assert.notEqual(response.body, null);
            })
            .end(done);
    })

    it('should allow a user to select that they answered correctly', (done) => {
        expressMocker(application)
            .get('/api/1/correct')
            .expect(200)
            .expect(response => {
                assert.equal(response.body, 1);
            })
            .end(done);
    })

    it('should allow a user to select that they answered incorrectly', (done) => {
        expressMocker(application)
            .get('/api/1/incorrect')
            .expect(200)
            .expect(response => {
                assert.equal(response.body, 1);
            })
            .end(done);
    })


    it('should allow a user to delete a card in a deck', (done) => {
        expressMocker(application)
            .delete('/api/1/1/1')
            .expect(200)
            .expect(response => {
                assert.equal(response.body, []);
            })
            .end(done);
    })

})