const eventsFolder = './events/';
const fs = require('fs');
const YAML = require('yamljs');
const ical = require('ical-generator');
const moment = require('moment');
const { version1Extractor } = require("./extractor/version1");

const FILENAME_MATCHER = /(\d{4}-\d{2}-\d{2})-[a-z0-9-]+/;
const cal = ical({
    domain: 'nrvdev.com', name: 'CFP Calendar', 
    id : 'nrvdev-cfp-calendar',
    prodId: {company: 'nrvdev.com', product: 'cfp-calendar'}, 
});

const dryRun = (process.argv.indexOf("--dry-run") > -1);

Promise.all(
    getFilenames().map(f => processFile(f))
)
.then(data => data.forEach(event => cal.createEvent(event)))
.then(() => {
    if (dryRun) 
        console.log(cal.toString());
    else  
        fs.writeFileSync('./calendars/cfp-calendar.ical', cal.toString());
});


/**
 * Extract all of the files from the events directory and validate
 * the filename is structured correctly.
 * @return string[] Filenames found in the events directory
 */
function getFilenames() {
    const eventFilenames = fs.readdirSync("./events");

    eventFilenames.forEach(f => {
        if (f.match(FILENAME_MATCHER) === null)
            throw new Error(`Event file '${f}' does not have a valid filename`);
    });
    
    return eventFilenames;
}

/**
 * Process a specific file by reading its contents and extracting
 * the details from it.
 * @param filename {string} The filename to extract
 * @return {Promise} Resolved when processing complete or rejected upon error
 */
function processFile(filename) {
    return new Promise((acc, rej) => {
        return fs.readFile(`./events/${filename}`, (err, fileData) => {
            if (err) return rej(err);

            try {
                const data = extractData(YAML.parse(fileData.toString()));
                const date = moment(filename.match(FILENAME_MATCHER)[1]);
                acc( Object.assign({}, data, { start : date, end : date } ));
            } catch (err) {
                throw new Error(`Error processing ${filename}: ${err.message}`);
            }
        });
    });
}

/**
 * Read the YAML (turned into JSON) and extract the details out of it
 * @param contents {object} The YAML contents, JSONified
 * @return {object} Ical specific contents
 */
function extractData(contents, parsers = { "1.0" : version1Extractor }) {
    if (parsers[contents.version] === undefined)
        throw new Error(`Unsupported schema version found: ${contents.version}`);
    
    return parsers[contents.version](contents);
}
