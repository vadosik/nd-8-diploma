module.exports = class Authorization {
  constructor() {
    this.url = '/#!/authorization';
    this.notAuthStateName = 'authorization';
    this.authorizedStateName = 'authorized';
    this.pageFormName = '$ctrl.loginForm';
    this.validFieldClassName = 'ng-valid';
    this.fieldNamesPatternsCalled = {
      name: 'userName',
      email: 'userEmail'
    }; // this is a getters names of current class

    this.validData = {
      name: 'Name min length - 3 symbols',
      email: 'looks-like@valid.email'
    };

    this.inValidData = {
      name: [
        {
          data: '',
          description: 'Ввод меньше 3 символов не валиден'
        },
        {
          data: '         ',
          description: 'Поле не валидно, если заполнить пробелами'
        }
      ],

      email: [
        {
          data: 'strange.pseudo.email',
          description: 'Ввод строки без @ не валиден'
        },
        {
          data: 'strange.pseudo.email@mailru',
          description: 'Ввод строки c @ но без .domain-zone не валидна'
        },
        {
          data: '@mailru',
          description: 'Ввод строки c без текста перед @ не валиден'
        },
        {
          data: 'a@b.c',
          description: 'Попытка имитировать слишком короткий email не валидна'
        }
      ]
    };
  }

  getPage() {
    browser.get(this.url);
  }

  get userName() {
    return element(by.model('$ctrl.userData.name'));
  }

  get userEmail() {
    return element(by.model('$ctrl.userData.email'));
  }

  get sendBtn() {
    return element(by.css('button.send-btn'));
  }

  async setValueAndCheckFieldValid(field, value) {
    try {
      await field.sendKeys(value);
      const filledFieldClasses = await field.getAttribute('class');

      return filledFieldClasses.split(' ').some(className => className === this.validFieldClassName);

    } catch (error) {
      return error;
    }
  }

  async isFromExist() {
    try {
      return await browser.isElementPresent(by.css(`[name="${this.pageFormName}"]`));

    } catch (error) {
      return error;
    }
  }

  fillFormAndSubmit() {
    Object.keys(this.validData).forEach(validDataFieldName => {
      const currentFieldValidData = this.validData[validDataFieldName];
      const currentFieldPatternName = this.fieldNamesPatternsCalled[validDataFieldName];
      const currentInputField = this[currentFieldPatternName];

      currentInputField.sendKeys(currentFieldValidData);
    });

    this.sendBtn.click();
  }
};