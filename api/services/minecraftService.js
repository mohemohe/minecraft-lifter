const McQuery = require("mcquery");

module.exports = {
  minecraftQueryAsync: function(host, port = 25565, timeout = 3000) {
    return new Promise((resolve, reject) => {
      let timeoutHendle = setTimeout(() => {
				resolve({
          success: false,
          result: {
            error_reason: 'timeout',
          },
        });
      }, timeout);

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
            clearTimeout(timeoutHendle);
          });
        }
      });
    });
  }
};
