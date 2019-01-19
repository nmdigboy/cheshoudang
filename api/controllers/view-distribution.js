module.exports = {


  friendlyName: 'View distribution',


  description: 'Display "Distribution" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/distribution'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
