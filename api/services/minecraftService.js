const McQuery = require("mcquery");

module.exports = {
  minecraftQueryAsync: function(host, port = 25565) {
    return new Promise((resolve, reject) => {
      const query = new McQuery(host, port);
      query.connect((error) => {
        if (error) {
          resolve({
            success: false,
            result: error,
          });
        } else {
          query.full_stat((err, stat) => {
            if (err) {
              resolve({
                success: false,
                result: err,
              });
            } else {
              resolve({
                success: true,
                result: stat,
              });
            }
            if (query.outstandingRequests() === 0) {
              query.close();
            }
          });
        }
      });
    });
  }
};
