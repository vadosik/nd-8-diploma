'use strict';
const chaiHttp = require('chai-http');
const chai = require('chai');
const expect = chai.expect;

chai.use(chaiHttp);

const rootUrl = 'http://localhost:3000';
const apiRequestUrl = '/api/v1/menu';

describe('Операции с Menu', () => {
  let server;
  before(() => {
    server = chai.request(rootUrl);

    (function runServer() {
      require('../../../index.js');
    })();
  });

  it('GET-запрос вернёт код 200', (done) => {
    server.get(apiRequestUrl)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        done();
      });
  });
  
  it('GET-запрос вернёт не пустой массив', (done) => {
    server.get(apiRequestUrl)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        const responseData = res.body;
        expect(responseData).to.be.an('array').that.is.not.empty;

        done();
      });
  });

  it('POST-запрос вернёт ошибку 404', (done) => {
    server.post(apiRequestUrl)
      .send(['some', 'testing', 'data'])
      .end(function (err, res) {
        expect(err).to.not.be.null;
        expect(err).to.have.status(404);

        done();
      });
  });
});