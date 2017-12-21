'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;

chai.use(chaiHttp);

const rootUrl = 'http://localhost:3000';
const apiRequestUrl = '/api/v1/users';

const userTestEmail = 'looks-like@valid.email';
const userTestName = 'Tester';
const fakeUserObjectWithoutName = { email: userTestEmail };
const fakeUserObjectWithoutEmail = { name: userTestName };
const fakeUncorrectUserObject = { someFareField: 'Some value' };

const uncorrectUserData = [
  fakeUserObjectWithoutName,
  fakeUserObjectWithoutEmail,
  fakeUncorrectUserObject
];

const fakeCorrectUserObject = {
  email: userTestEmail,
  name: userTestName
};

describe('Операции с Users', () => {
  let server;
  before(() => {
    server = chai.request(rootUrl);

    (function runServer() {
      require('../../../index.js');
    })();
  });

  it('GET-запрос вернёт ошибку 404', (done) => {
    server.get(apiRequestUrl)
      .end(function (err, res) {
        expect(err).to.not.be.null;
        expect(err).to.have.status(404);

        done();
      });
  });

  it('Не корректный POST-запрос вернёт ошибку 400', (done) => {
    uncorrectUserData.forEach((userData, index, verifiableArray) => {
      server.post(apiRequestUrl)
        .send(userData)
        .end(function (err, res) {
          expect(err).to.not.be.null;
          expect(err).to.have.status(400);

          if (index === (verifiableArray.length - 1)) {
            done();
          }
        });
    });
  });

  it('Корректный POST-запрос вернёт код  200', (done) => {
    server.post(apiRequestUrl)
      .send(fakeCorrectUserObject)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Корректный POST-запрос вернёт serverResponse-объект', (done) => {
    server.post(apiRequestUrl)
      .send(fakeCorrectUserObject)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        const responseObject = res.body;
        expect(responseObject).to.have.own.property('serverResponse');

        const serverResponseObject = responseObject.serverResponse;
        expect(serverResponseObject).to.have.own.property('credits');
        expect(serverResponseObject).to.have.own.property('orders');
        expect(serverResponseObject['_id']).to.equal(fakeCorrectUserObject.email);
        expect(serverResponseObject['name']).to.equal(fakeCorrectUserObject.name);

        done();
      });
  });

  it('POST-запрос создаст нового пользователя, если такой не обнаружен в базе и вернёт его', (done) => {
    const dateStringify = JSON.stringify(new Date());
    const uniqueNewUserObject = {
      email: `${dateStringify}@test.com`,
      name: dateStringify
    };

    server.post(apiRequestUrl)
      .send(uniqueNewUserObject)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        const responseObject = res.body;
        const serverResponseObject = responseObject.serverResponse;
        expect(serverResponseObject['_id']).to.equal(uniqueNewUserObject.email);
        expect(serverResponseObject['name']).to.equal(uniqueNewUserObject.name);

        done();
      });
  });

  it('Отправка обновлённых данных пользователя обновит его в базе данных', (done) => {
    const testIterationsCount = 5;

    for (let i = 0; i <= testIterationsCount; i++) {
      const dateStringify = JSON.stringify(new Date());
      fakeCorrectUserObject.name = dateStringify;

      server.post(apiRequestUrl)
        .send(fakeCorrectUserObject)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);

          const responseObject = res.body;
          const nameResponseValue = responseObject.serverResponse.name;
          expect(nameResponseValue).to.equal(dateStringify);

          if (i === testIterationsCount) {
            done();
          }
        });
    }
  })
});