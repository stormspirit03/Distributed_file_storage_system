let stats = {
  totalPayload: 0,
  totalIncomingRequests: 0,
  free: true
};

/**
 * Middleware function that updates the 'stats' object based on the incoming request.
 * If the request is for an upload or download endpoint, the 'stats' object is updated with the request details.
 * If there is an error during the request, the 'stats' object is updated to reflect the error.
 * If the request finishes successfully, the 'stats' object is updated to reflect the completion of the request.
 * The function then calls the next middleware function to continue the request handling.
 *
 * @param {object} req - The request object containing information about the incoming request.
 * @param {object} res - The response object used to send the response back to the client.
 * @param {function} next - The next middleware function to be called.
 * @returns {void}
 */
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
