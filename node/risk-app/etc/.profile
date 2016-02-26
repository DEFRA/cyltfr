###################################################
# Web application configuration overrides - Runtime configuration.

# The protocol used to access the LTFRI web application
export LTFRI_WEB_APPLICATION_PROTOCOL=http
# The listen address of the LTFRI web application
export LTFRI_WEB_APPLICATION_LISTEN_ADDRESS=127.0.0.1
# The listen port of the LTFRI web application
export LTFRI_WEB_APPLICATION_LISTEN_PORT=3001

# Maximum event loop delay duration in milliseconds over which incoming requests are rejected with an HTTP Server Timeout (503) response.
export LTFRI_WEB_APPLICATION_LOAD_SAMPLE_INTERVAL=1000
export LTFRI_WEB_APPLICATION_LOAD_MAX_EVENT_LOOP_DELAY=100
