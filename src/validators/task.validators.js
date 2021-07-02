var create = {
  name: {
    presence: {
      message: "is required",
    },
  },
  project_id: {
    presence: {
      message: "is required",
    },
  },
  status_id: {
    presence: {
      message: "is required",
    },
  },
};

module.exports = { create };
