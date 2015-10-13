# Whacky Calculator

The Whacky Calculator is a stylish little app for adding numbers up in
increments of five and ten - but it's not as simple as it sounds!

Simply hit the "add five" button to add that much to your calculation. If you
press "add ten" however, you'll see it get added to the summation - but you'll
have to wait for an HTTP request to complete before it gets added to the total!

With its bizarre functionality and retro blinking text, this page is sure to
make you LOL (that's Laugh Out Loud, folks)!


## Setup

To set up the development scripts you need to have
[NPM](https://www.npmjs.com/) installed. Run `npm install` to install the
required dependencies.

Once that's done you can use Grunt to test and build your code;
- `grunt test` will run jshint and jasmine tests
- `grunt justbuild` will simply build the production script without testing
- `grunt` will run the tests and build if they're successful
