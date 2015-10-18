/**
 * New node file
 */
function route(handle, pathname, request,response) {
    console.log("About to route request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request ,response);
    } else {
        console.log("no request handler found");
        response.writeHead(404, { "Contest-type": "text/plain" });
        response.write("hard luck buddy. there is nothing to show");
        response.end();
    }
}

exports.route = route;