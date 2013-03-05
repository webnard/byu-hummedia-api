HUMMEDIA
=========

Production Prep
------------------------
*REQUIREMENTS*
    * nodejs
    * npm
    * jsdom installed in the scripts/ directory (`npm install jsdom`)
    * the YUI Compressor (`apt-get install yui-compressor`)
    * Java
    * lessc (`apt-get install lessc`)

By adding a `data-cdn` attribute to your `<script>` tags in the index.html file, 
by running `ant compress` each one will have its `src` attribute take the value of
its `data-cdn` attribute. This can be used on production to speed up response time.

A `data-exclude-compress` attribute will exclude a file from compression.

By adding a `data-remove` attribute to your `<script>` tags, the `ant compress` command
will delete the `<script>` tags with these attributes.

By running `ant compress`, all of your LESS files will be compiled into a single CSS file.

Testing
-------

### E2E Tests
To run E2E tests, call `ant test` from the root directory. By default it will use the file `config/testacular-e2e.conf.js` as the configuration file. However, this can be overridden by calling `ant test -De2e.config=YOUR_CUSTOM_FILE`