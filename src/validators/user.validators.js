var updateUserProfile = {
  email: {
    presence: {
      message: "is required",
    },
    email: {
      message: "doesn't look like a valid email",
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
  oldPassword: {
    presence: {
      message: "is required",
    },
    format: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "must be 8 characters and contains both letter and digit",
    },
  },
  password: {
    presence: {
      message: "is required",
    },
    format: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "must be 8 characters and contains both letter and digit",
    },
  },
};

module.exports = { updateUserProfile };
