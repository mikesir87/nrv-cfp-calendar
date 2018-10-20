const Joi = require('joi');
const moment = require('moment');

const SCHEMA = Joi.object().keys({
    summary : Joi.string().required(),
    description : Joi.string().required(),
    url : Joi.string().uri({ scheme : [ /https?/ ]}).required(),
    date_added : Joi.date().required(),
    location : Joi.string().required(),
    conference_dates : Joi.object().keys({
        start : Joi.date().required(),
        end : Joi.date().required(),
    }),
});

/**
 * Extract the contents from a 1.0 schema format. Will validate
 * against the schema described above.
 * @param contents {object} The YAML data, JSONified
 * @return {object} Calendar specific options, extracted from the contents.
 */
function version1Extractor(contents) {
    const event = contents.event;

    const { error } = Joi.validate(event, SCHEMA);
    if (error)
        throw error;

    const startDate = moment(event.conference_dates.start);
    const endDate = moment(event.conference_dates.end);

    return {
        timestamp : moment(event.date_added, 'YYYY-MM-DD'),
        allDay : true,
        summary : `${event.summary}`,
        description : `Conference Dates: ${startDate.format('YYYY-MM-DD')} - ${endDate.format('YYYY-MM-DD')}\nLocation:${event.location}\n\n${event.description}`,
        url : event.url,
    }
}

exports.version1Extractor = version1Extractor;