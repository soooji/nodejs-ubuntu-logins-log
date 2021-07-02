var register = {
  email: {
    presence: {
      message: "is required",
    },
    email: {
      message: "doesn't look like a valid email",
    },
  },
  username: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 3,
      tooShort: "needs to have 3 letters or more",
    },
  },
  answer: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 1,
      tooShort: "needs to have 1 letters or more",
    },
  },
  password: {
    presence: {
      message: "is required",
    },
    format: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
      message: "must be 8 characters and contains both letter and digit",
    },
  },
  first_name: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 2,
      tooShort: "needs to have 2 letters or more",
    },
  },
  last_name: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 2,
      tooShort: "needs to have 2 letters or more",
    },
  },
};

var changePassword = {
  username: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 3,
      tooShort: "needs to have 3 letters or more",
    },
  },
  answer: {
    presence: {
      message: "is required",
    },
    length: {
      minimum: 1,
      tooShort: "needs to have 2 letters or more",
    },
  },
  password: {
    presence: {
      message: "is required",
    },
    format: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
      message: "must be 8 characters and contains both letter and digit",
    },
  },
};

module.exports = { register: register, changePassword: changePassword };
