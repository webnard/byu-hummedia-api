HUMMEDIA
=========

Production Prep
------------------------
*REQUIREMENTS*

    *    nodejs
    *    npm

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

To get these to work with browserstack, you'll need to save the following as an executable `~/.browserstack_config.sh`

* `touch ~/.browserstack_config.sh`
* `chmod +x ~/.browserstack_config.sh`

Then edit the `~/.browserstack_config.sh` file with these contents:

    USERNAME=your_browserstack_username
    AUTOMATED_TESTING_KEY=your_testing_key
    PASSWORD=your_password