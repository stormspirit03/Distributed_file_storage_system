let stats = {
  totalPayload: 0,
  totalIncomingRequests: 0,
  free: true
};

function sentry(req, res, next) {
  let time = Date.now();
  // Check if the request is for an upload or download endpoint
  const isUploadEndpoint = req.method === 'POST' && req.path === '/file/upload';
  const isDownloadEndpoint = req.method === 'GET' && req.path === '/file/download';

  if (isUploadEndpoint || isDownloadEndpoint) {
    // Increment the stats when the request starts
    stats.free = false;
    stats.totalIncomingRequests += 1;
    stats.totalPayload += parseInt(req.headers['x-file-size']) || 0;
    console.log(' starting stats: ', stats);
    // Extract the 'x-file-size' header from the request

    // Update stats when the request ends (successfully or with an error)
    // Update stats when the request ends (successfully or with an error)
    req.on('error', (error) => {
      stats.free = true;
      stats.totalPayload -= parseInt(req.headers['x-file-size']) || 0;
      stats.totalIncomingRequests -= 1;
      console.log(' ending stats with error: ', stats, error);
      next(error); // Call next() with the error
    });

    res.on('finish', () => {
      time = Date.now() - time;
      console.log('full time', time);
      stats.free = true;
      stats.totalPayload -= parseInt(req.headers['x-file-size']) || 0;
      stats.totalIncomingRequests -= 1;
      console.log(' ending stats with on finish: ', stats);
    });

    next();
  } else {
    // For other endpoints, move to the next middleware
    next();
  }
}

module.exports = { stats, sentry };
