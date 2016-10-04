const scope = require('mongoose').model('scope');


module.exports = function () {

  const scopes = [
    {
      id: "user:read",
      category: "User",
      name: "Read user information",
      description: "The application is capabable to view all of your personal details (e.g. email-adress or birthday)"
    },
    {
      id: "user:write",
      category: "User",
      name: "Write user information",
      description: "Capability to change User information (e.g. Password or telefone number)"
    },
    {
      id: "grade:read",
      category: "Grade",
      name: "Read grades",
      description: "The application is capable to view all of your grades"
    },
    {
      id: "grade:write",
      category: "Grade",
      name: "Register/Deregister for re-examination",
      description: "The application is capabable to register or deregister you from a re-examination"
    },
    {
      id: "seminar:read",
      category: "Seminar",
      name: "Read seminars",
      description: "The application is capable to read all your seminars you took part in"
    },
    {
      id: "seminar:write",
      category: "Seminar",
      name: "Register/Deregister for seminars",
      description: "The application is capable to register or deregister you for seminars"
    }
  ];

  scope.count({}, function (err, count) {
    if (!err && count < scopes.length) {
      scope.insertMany(scopes, function (error, docs) {
      });
    }
  });
};